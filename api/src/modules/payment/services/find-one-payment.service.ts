// ============================================
// SERVIÇO: CONSULTA DE PAGAMENTOS
// ============================================
// Busca e lista pagamentos
// ============================================

import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { FindOneOptions } from '@/common/types/find-one-options.type';
import { Payment } from '../entities/payment.entity';
import { ListOptions } from '@/common/types/list-options.type';

@Injectable()
export class QueryPaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  // ============================================
  // BUSCAR UM PAGAMENTO
  // ============================================
  async findOne(options: FindOneOptions<Payment>): Promise<Payment> {
    return this.paymentRepository.findOne(options);
  }

  // ============================================
  // BUSCAR PAGAMENTOS NÃO VALIDADOS
  // ============================================
  // Pagamentos pendentes que expiraram
  async getUnvalidatedPayments(): Promise<Payment[]> {
    return await this.paymentRepository.getUnvalidatedPayments();
  }

  // ============================================
  // LISTAR PAGAMENTOS (PAGINADO)
  // ============================================
  async list(
    options: ListOptions<Payment>,
  ): Promise<{ payments: Payment[]; count: number }> {
    return await this.paymentRepository.list(options);
  }
}
