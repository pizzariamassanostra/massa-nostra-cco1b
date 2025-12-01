// ============================================
// REPOSITORY: PAGAMENTOS
// ============================================
// Acesso ao banco de dados para pagamentos
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { DeepPartial, Repository } from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';
import ApiError from '@/common/error/entities/api-error.entity';
import { FindOneOptions } from '@/common/types/find-one-options.type';
import { ListOptions } from '@/common/types/list-options.type';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // ============================================
  // LISTAR PAGAMENTOS COM FILTROS E PAGINAÇÃO
  // ============================================
  async list(
    options: ListOptions<Payment>,
  ): Promise<{ payments: Payment[]; count: number }> {
    const qb = this.paymentRepository.createQueryBuilder('payments');
    const { page = 1, per_page = 10 } = options;

    // Filtro por nome/ID/telefone do usuário
    if (options.name) {
      if (options.relations.includes('commonUser')) {
        qb.where(
          'payments.id::VARCHAR ILIKE :name OR commonUser.name::VARCHAR ILIKE :name or commonuser.phone::VARCHAR ILIKE :name',
          { name: `%${options.name}%` },
        );
      } else {
        qb.where('payments.id::VARCHAR ILIKE :id', { id: `%${options.name}%` });
      }
    }

    // Filtros adicionais (status, data...)
    if (options.where) {
      for (const where of options.where) {
        for (const [key, value] of Object.entries(where)) {
          qb.andWhere(`payments.${key} = :${key}`, { [key]: value });
        }
      }
    }

    // Filtro por IDs específicos
    if (options.ids) {
      qb.andWhereInIds(options.ids);
    }

    // Selects adicionais (ex: campos que normalmente não aparecem)
    if (options.additionalSelects) {
      for (const additionalSelect of options.additionalSelects) {
        qb.addSelect(`payments.${additionalSelect}`);
      }
    }

    // Relacionamentos (join com outras tabelas)
    if (options.relations) {
      options.relations.forEach((relation) =>
        qb.leftJoinAndSelect(`payments.${relation}`, relation.toLowerCase()),
      );
    }

    // Ordenação e paginação
    qb.orderBy('payments.created_at', 'DESC');
    qb.skip((page - 1) * per_page);
    qb.take(per_page);

    const [payments, count] = await qb.getManyAndCount();
    return { payments, count };
  }

  // ============================================
  // CRIAR PAGAMENTO
  // ============================================
  async createPayment(payment: Payment): Promise<Payment> {
    const paymentDb = await this.paymentRepository.save(payment);
    return paymentDb;
  }

  // ============================================
  // BUSCAR UM PAGAMENTO
  // ============================================
  async findOne(options: FindOneOptions<Payment>): Promise<Payment> {
    const qb = this.paymentRepository.createQueryBuilder('payments');

    // Relacionamentos
    if (options.relations) {
      options.relations.forEach((relation) =>
        qb.leftJoinAndSelect(`payments.${relation}`, relation),
      );
    }

    // Condições WHERE
    if (options.where) {
      for (const where of options.where) {
        for (const [key, value] of Object.entries(where)) {
          qb.andWhere(`payments.${key} = :${key}`, { [key]: value });
        }
      }
    }

    // Selects adicionais
    if (options.additionalSelects) {
      options.additionalSelects.forEach((select) => {
        qb.addSelect(`payments.${select}`);
      });
    }

    return qb.getOne();
  }

  // ============================================
  // BUSCAR PAGAMENTOS EXPIRADOS E PENDENTES
  // ============================================
  async getUnvalidatedPayments(): Promise<Payment[]> {
    const qb = this.paymentRepository.createQueryBuilder('payments');
    qb.where('payments.expires_at < :now', { now: new Date() });
    qb.andWhere('payments.status = :status', { status: PaymentStatus.PENDING });

    return qb.getMany();
  }

  // ============================================
  // ATUALIZAR STATUS DO PAGAMENTO
  // ============================================
  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<Payment> {
    const payment = await this.findOne({ where: [{ id }] });
    if (!payment) {
      throw new ApiError('payment-not-found', 'Pagamento não encontrado', 404);
    }

    payment.status = status;

    // Se aprovado, registra data de pagamento
    if (status === PaymentStatus.SUCCESS) {
      payment.paid_at = new Date();
    }

    const paymentDb = await this.paymentRepository.save(payment);
    return paymentDb;
  }

  // ============================================
  // ATUALIZAR DADOS DO PAGAMENTO
  // ============================================
  async updatePaymentData(
    id: string,
    data: DeepPartial<Payment>,
  ): Promise<Payment> {
    const payment = await this.findOne({ where: [{ id }] });
    if (!payment) {
      throw new ApiError('payment-not-found', 'Pagamento não encontrado', 404);
    }

    Object.assign(payment, data);
    const paymentDb = await this.paymentRepository.save(payment);
    return paymentDb;
  }

  // ============================================
  // REMOVER PAGAMENTOS (BULK DELETE)
  // ============================================
  async removePayments(payments: Payment[]) {
    return this.paymentRepository.remove(payments);
  }
}
