/**
 * ============================================
 * SERVIÇO: PEDIDOS (Order Service)
 * ============================================
 * Lógica de negócio para criação e gestão de pedidos
 * Integrado com geração automática de comprovantes
 * eração automática de order_number
 * ============================================
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { ProductVariant } from '../../product/entities/product-variant.entity';
import { PizzaCrust } from '../../product/entities/pizza-crust.entity';
import { CrustFilling } from '../../product/entities/crust-filling.entity';
import { Address } from '../entities/address.entity';
import { ReceiptService } from '@/modules/receipt/services/receipt.service';

// Função para gerar order_number
import { generateOrderNumber } from '@/common/functions/generate-order-number';

@Injectable()
export class OrderService {
  constructor(
    // ============================================
    // REPOSITORIES
    // ============================================
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(OrderStatusHistory)
    private readonly historyRepo: Repository<OrderStatusHistory>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(PizzaCrust)
    private readonly crustRepo: Repository<PizzaCrust>,

    @InjectRepository(CrustFilling)
    private readonly fillingRepo: Repository<CrustFilling>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    // ============================================
    // SERVIÇO
    // ============================================
    private readonly receiptService: ReceiptService,
  ) {}

  /**
   * ============================================
   * CRIAR PEDIDO COMPLETO
   * ============================================
   * 1. Validar endereço
   * 2. Calcular preços dos itens
   * 3. Criar pedido
   * 4. Gerar order_number automático
   * 5. Salvar itens do pedido
   * 6. Registrar histórico
   * ============================================
   */
  async create(dto: CreateOrderDto): Promise<Order> {
    // ============================================
    // VALIDAR ENDEREÇO
    // ============================================
    const address = await this.addressRepo.findOne({
      where: { id: dto.address_id, deleted_at: null },
    });

    if (!address) {
      throw new BadRequestException(
        `Endereço #${dto.address_id} não encontrado`,
      );
    }

    // Validar que o endereço pertence ao cliente
    if (address.common_user_id !== dto.common_user_id) {
      throw new BadRequestException(`Endereço não pertence a este cliente`);
    }

    // ============================================
    // PROCESSAR ITENS DO PEDIDO
    // ============================================
    let subtotal = 0;
    const orderItems = [];

    for (const itemDto of dto.items) {
      // Buscar variação (tamanho/preço da pizza ou bebida)
      const variant = await this.variantRepo.findOne({
        where: { id: itemDto.variant_id },
      });

      if (!variant) {
        throw new BadRequestException(
          `Variação #${itemDto.variant_id} não encontrada`,
        );
      }

      // Preço base da variação
      let unitPrice = parseFloat(variant.price.toString());
      let crustPrice = 0;
      let fillingPrice = 0;

      // Se é pizza, buscar preço adicional da borda
      if (itemDto.crust_id) {
        const crust = await this.crustRepo.findOne({
          where: { id: itemDto.crust_id },
        });
        if (crust) {
          crustPrice = parseFloat(crust.price_modifier.toString());
        }
      }

      // Se é pizza, buscar preço adicional do recheio da borda
      if (itemDto.filling_id) {
        const filling = await this.fillingRepo.findOne({
          where: { id: itemDto.filling_id },
        });
        if (filling) {
          fillingPrice = parseFloat(filling.price.toString());
        }
      }

      // Calcular subtotal do item: quantidade × (preço base + borda + recheio)
      const itemSubtotal =
        itemDto.quantity * (unitPrice + crustPrice + fillingPrice);

      // Preparar item para salvar no banco
      orderItems.push({
        product_id: itemDto.product_id,
        variant_id: itemDto.variant_id,
        crust_id: itemDto.crust_id,
        filling_id: itemDto.filling_id,
        quantity: itemDto.quantity,
        unit_price: unitPrice,
        crust_price: crustPrice,
        filling_price: fillingPrice,
        subtotal: itemSubtotal,
        notes: itemDto.notes,
      });

      // Somar ao subtotal do pedido
      subtotal += itemSubtotal;
    }

    // ============================================
    // CALCULAR TOTAIS
    // ============================================
    const deliveryFee = 5.0; // Taxa fixa de entrega (pode ser dinâmica)
    const discount = 0; // Desconto inicial (será preenchido depois se houver cupom)
    const total = subtotal + deliveryFee - discount;

    // ============================================
    // CRIAR PEDIDO NO BANCO
    // ============================================
    // valores são numbers (para satisfazer a entidade Order)
    const orderData = {
      common_user_id: dto.common_user_id,
      address_id: dto.address_id,
      status: 'pending',
      subtotal: subtotal, // number
      delivery_fee: deliveryFee, // number
      discount: discount, // number
      total: total, // number
      payment_method: dto.payment_method,
      notes: dto.notes,
      estimated_time: 45,
      order_number: '',
    };

    // fixa tipos numéricos que podem vir como string do front-end
    const fixedOrderData = {
      ...orderData,
      subtotal: Number(orderData.subtotal),
      delivery_fee: Number(orderData.delivery_fee),
      discount: Number(orderData.discount),
      total: Number(orderData.total),
    };

    // CRIAR E SALVAR PEDIDO (SEM order_number AINDA)
    const order = this.orderRepo.create(fixedOrderData as Partial<Order>);
    const savedOrder = await this.orderRepo.save(order);

    // ============================================
    // GERAR order_number AUTOMATICAMENTE
    // ============================================
    // Formato: ORD-YYYYMMDD-XXXXXX
    // Exemplo: ORD-20251130-000045
    const orderNumber = generateOrderNumber(savedOrder.id);
    savedOrder.order_number = orderNumber;

    // Salvar novamente com o order_number preenchido
    await this.orderRepo.save(savedOrder);

    // ============================================
    // SALVAR ITENS DO PEDIDO
    // ============================================
    const itemsToSave = orderItems.map((item) => ({
      order_id: savedOrder.id,
      ...item,
    }));

    await this.orderItemRepo.insert(itemsToSave);

    // ============================================
    // REGISTRAR NO HISTÓRICO
    // ============================================
    await this.historyRepo.save({
      order_id: savedOrder.id,
      status: 'pending',
      notes: `Pedido criado pelo cliente - #${orderNumber}`,
    } as OrderStatusHistory);

    // Retornar pedido completo com todos os relacionamentos
    return this.findOne(savedOrder.id);
  }

  /**
   * ============================================
   * BUSCAR PEDIDO POR ID (COM TODOS OS DADOS)
   * ============================================
   * Carrega pedido com cliente, endereço e itens
   * ============================================
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id, deleted_at: null },
      relations: [
        'user', // Cliente (CommonUser)
        'address', // Endereço de entrega
        'items', // Itens do pedido
        'items.product', // Produto de cada item
        'items.variant', // Variação (tamanho/preço)
        'items.crust', // Borda (se pizza)
        'items.filling', // Recheio da borda (se pizza)
      ],
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }

    return order;
  }

  /**
   * ============================================
   * LISTAR PEDIDOS DO CLIENTE
   * ============================================
   * Retorna todos os pedidos de um cliente específico
   * Ordenado por mais recente primeiro
   * ============================================
   */
  async findByUser(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { common_user_id: userId, deleted_at: null },
      relations: ['address', 'items'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * ============================================
   * LISTAR TODOS OS PEDIDOS (ADMIN)
   * ============================================
   * Retorna todos os pedidos do sistema
   * Apenas para administradores
   * ============================================
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      where: { deleted_at: null },
      relations: ['user', 'address', 'items'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * ============================================
   * ATUALIZAR STATUS DO PEDIDO
   * ============================================
   * Muda o status e registra no histórico
   * Se status = "confirmed", gera comprovante automaticamente
   * ============================================
   */
  async updateStatus(
    id: number,
    dto: UpdateOrderStatusDto,
    adminId?: number,
  ): Promise<Order> {
    // Buscar pedido
    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }

    // Atualizar status no banco
    await this.orderRepo.update(
      { id },
      {
        status: dto.status,
        updated_at: new Date(),
      },
    );

    // Registrar mudança no histórico
    await this.historyRepo.save({
      order_id: id,
      status: dto.status,
      notes: dto.notes || `Status alterado para ${dto.status}`,
      created_by: adminId, // ID do admin que fez a alteração
    });

    // ============================================
    // GERAR COMPROVANTE AUTOMATICAMENTE
    // ============================================
    // Quando pagamento é confirmado, gera o PDF do comprovante
    if (dto.status === 'confirmed') {
      try {
        console.log(`[OrderService] Gerando comprovante para pedido #${id}...`);
        const receipt = await this.receiptService.generateReceipt(id);
        console.log(`[OrderService] Comprovante gerado com sucesso!`);
        console.log(`[OrderService] Número: ${receipt.receipt_number}`);
        console.log(`[OrderService] PDF URL: ${receipt.pdf_url}`);
      } catch (error) {
        console.error(
          `[OrderService] Erro ao gerar comprovante para pedido #${id}:`,
        );
        console.error(error);
        // Continua mesmo se falhar (não bloqueia o fluxo)
      }
    }

    // Retornar pedido atualizado
    return this.findOne(id);
  }

  /**
   * ============================================
   * VALIDAR TOKEN DE ENTREGA
   * ============================================
   * Motoboy escaneia o código e este método valida
   * Se válido, muda status para "delivered"
   * ============================================
   */
  async validateDeliveryToken(
    orderId: number,
    token: string,
  ): Promise<boolean> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} não encontrado`);
    }

    // Validar se o token fornecido bate com o do pedido
    if (order.delivery_token !== token) {
      return false;
    }

    // Se válido, marcar como entregue
    await this.updateStatus(orderId, {
      status: 'delivered',
      notes: 'Entrega confirmada com token pelo motoboy',
    });

    return true;
  }

  /**
   * ============================================
   * CANCELAR PEDIDO
   * ============================================
   * Cancela um pedido com motivo
   * Apenas funciona se ainda está em status permitido
   * ============================================
   */
  async cancel(id: number, reason?: string): Promise<Order> {
    return this.updateStatus(id, {
      status: 'cancelled',
      notes: reason || 'Pedido cancelado pelo cliente',
    });
  }
}
