// ============================================
// REPOSITORIO: COMPROVANTES
// ============================================
// Acesso ao banco de dados de comprovantes
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../entities/receipt.entity';

@Injectable()
export class ReceiptRepository {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
  ) {}

  // ============================================
  // CRIAR COMPROVANTE
  // ============================================
  async create(receipt: Receipt): Promise<Receipt> {
    return await this.receiptRepository.save(receipt);
  }

  // ============================================
  // BUSCAR POR ID
  // ============================================
  async findById(id: number): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { id },
      relations: ['order'],
    });
  }

  // ============================================
  // BUSCAR POR NÚMERO DO COMPROVANTE
  // ============================================
  async findByReceiptNumber(receiptNumber: string): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { receipt_number: receiptNumber },
      relations: ['order'],
    });
  }

  // ============================================
  // BUSCAR POR PEDIDO
  // ============================================
  async findByOrderId(orderId: number): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { order_id: orderId },
      relations: ['order'],
    });
  }

  // ============================================
  // LISTAR POR CLIENTE
  // ============================================
  async findByCustomerId(customerId: number): Promise<Receipt[]> {
    return await this.receiptRepository
      .createQueryBuilder('receipt')
      // Join com a tabela orders
      .innerJoin('receipt.order', 'order')
      // Filtrar pelo ID do cliente (que está em order.common_user_id)
      .where('order.common_user_id = :customerId', { customerId })
      // Ordenar do mais recente para o mais antigo
      .orderBy('receipt. created_at', 'DESC')
      // Incluir dados do pedido na resposta
      .leftJoinAndSelect('receipt.order', 'orderData')
      // Executar query e retornar resultados
      .getMany();
  }

  // ============================================
  // ATUALIZAR
  // ============================================
  async update(id: number, data: Partial<Receipt>): Promise<Receipt> {
    await this.receiptRepository.update(id, data);
    return await this.findById(id);
  }
}
