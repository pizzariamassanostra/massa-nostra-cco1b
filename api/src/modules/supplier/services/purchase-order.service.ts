// ============================================
// SERVIÇO: PEDIDOS DE COMPRA
// ============================================
// Lógica de negócio para pedidos de compra
// Aprovação, recebimento, nota fiscal
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { Supplier } from '../entities/supplier.entity';
import { CreatePurchaseOrderDto } from '../dtos/create-purchase-order.dto';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,

    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  // ============================================
  // CRIAR PEDIDO DE COMPRA
  // ============================================
  // Gera número único: PO-YYYYMMDD-XXX
  // ============================================
  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // Validar fornecedor
    const supplier = await this.supplierRepo.findOne({
      where: { id: dto.supplier_id, deleted_at: null },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor #${dto.supplier_id} não encontrado`,
      );
    }

    // Gerar número do pedido
    const orderNumber = await this.generateOrderNumber();

    // Converter itens para JSON
    const itemsJson = JSON.stringify(dto.items);

    // Criar pedido
    const order = this.purchaseOrderRepo.create({
      supplier_id: dto.supplier_id,
      order_number: orderNumber,
      items_json: itemsJson,
      total_value: dto.total_value,
      payment_method: dto.payment_method,
      expected_delivery_date: dto.expected_delivery_date,
      status: dto.status || PurchaseOrderStatus.DRAFT,
      notes: dto.notes,
      approved_by: dto.approved_by,
    });

    const savedOrder = await this.purchaseOrderRepo.save(order);

    console.log(
      `Pedido de compra ${orderNumber} criado para fornecedor #${dto.supplier_id}`,
    );

    return savedOrder;
  }

  // ============================================
  // GERAR NÚMERO ÚNICO DO PEDIDO
  // ============================================
  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Buscar a ÚLTIMA ordem do dia
    const lastOrder = await this.purchaseOrderRepo
      .createQueryBuilder('order')
      .where('order.order_number LIKE :pattern', { pattern: `PO-${dateStr}%` })
      .orderBy('order.id', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastOrder) {
      const lastNumber = lastOrder.order_number.split('-').pop();
      sequence = parseInt(lastNumber || '0', 10) + 1;
    }

    return `PO-${dateStr}-${String(sequence).padStart(3, '0')}`;
  }

  // ============================================
  // LISTAR TODOS OS PEDIDOS
  // ============================================
  async findAll(filters?: {
    status?: PurchaseOrderStatus;
    supplier_id?: number;
  }): Promise<PurchaseOrder[]> {
    const query = this.purchaseOrderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.supplier', 'supplier');

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.supplier_id) {
      query.andWhere('order.supplier_id = :supplier_id', {
        supplier_id: filters.supplier_id,
      });
    }

    query.orderBy('order.created_at', 'DESC');

    return query.getMany();
  }

  // ============================================
  // BUSCAR PEDIDO POR ID
  // ============================================
  async findOne(id: number): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepo.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido de compra #${id} não encontrado`);
    }

    return order;
  }

  // ============================================
  // APROVAR PEDIDO
  // ============================================
  async approve(id: number, adminId: number): Promise<PurchaseOrder> {
    const order = await this.findOne(id);

    // Aceitar DRAFT ou PENDING_APPROVAL
    if (
      order.status !== PurchaseOrderStatus.PENDING_APPROVAL &&
      order.status !== PurchaseOrderStatus.DRAFT
    ) {
      throw new BadRequestException(
        'Apenas pedidos em rascunho ou pendentes podem ser aprovados',
      );
    }

    order.status = PurchaseOrderStatus.APPROVED;
    order.approved_by = adminId;

    return this.purchaseOrderRepo.save(order);
  }

  // ============================================
  // CONFIRMAR RECEBIMENTO (FORNECEDOR)
  // ============================================
  async confirm(id: number): Promise<PurchaseOrder> {
    const order = await this.findOne(id);

    if (order.status !== PurchaseOrderStatus.APPROVED) {
      throw new BadRequestException(
        'Apenas pedidos aprovados podem ser confirmados',
      );
    }

    order.status = PurchaseOrderStatus.CONFIRMED;
    return this.purchaseOrderRepo.save(order);
  }

  // ============================================
  // MARCAR COMO EM TRÂNSITO
  // ============================================
  async markInTransit(id: number): Promise<PurchaseOrder> {
    const order = await this.findOne(id);
    order.status = PurchaseOrderStatus.IN_TRANSIT;
    return this.purchaseOrderRepo.save(order);
  }

  // ============================================
  // MARCAR COMO ENTREGUE
  // ============================================
  async markDelivered(id: number, deliveryDate: Date): Promise<PurchaseOrder> {
    const order = await this.findOne(id);
    order.status = PurchaseOrderStatus.DELIVERED;
    order.actual_delivery_date = deliveryDate;
    return this.purchaseOrderRepo.save(order);
  }

  // ============================================
  // MARCAR COMO RECEBIDO (CONFERIDO)
  // ============================================
  async markReceived(id: number): Promise<PurchaseOrder> {
    const order = await this.findOne(id);
    order.status = PurchaseOrderStatus.RECEIVED;
    return this.purchaseOrderRepo.save(order);
  }

  // ============================================
  // REGISTRAR NOTA FISCAL
  // ============================================
  async registerInvoice(
    id: number,
    nfeNumber: string,
    nfeXmlUrl?: string,
  ): Promise<PurchaseOrder> {
    const order = await this.findOne(id);

    if (order.status !== PurchaseOrderStatus.RECEIVED) {
      throw new BadRequestException(
        'Apenas pedidos recebidos podem ter NF registrada',
      );
    }

    order.nfe_number = nfeNumber;
    order.nfe_xml_url = nfeXmlUrl;
    order.status = PurchaseOrderStatus.COMPLETED;

    return this.purchaseOrderRepo.save(order);
  }

  // ============================================
  // CANCELAR PEDIDO
  // ============================================
  async cancel(id: number, reason?: string): Promise<PurchaseOrder> {
    const order = await this.findOne(id);

    if (order.status === PurchaseOrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Pedidos concluídos não podem ser cancelados',
      );
    }

    order.status = PurchaseOrderStatus.CANCELLED;
    order.notes = reason || 'Pedido cancelado';

    return this.purchaseOrderRepo.save(order);
  }
}
