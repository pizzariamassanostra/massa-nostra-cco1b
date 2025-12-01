// ============================================
// SERVIÇO: BORDAS DE PIZZA
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PizzaCrust } from '../entities/pizza-crust.entity';

@Injectable()
export class CrustService {
  constructor(
    @InjectRepository(PizzaCrust)
    private readonly crustRepo: Repository<PizzaCrust>,
  ) {}

  // ============================================
  // LISTAR TODAS AS BORDAS ATIVAS
  // ============================================
  async findAll(): Promise<PizzaCrust[]> {
    return this.crustRepo.find({
      where: { status: 'active', deleted_at: null },
      order: { sort_order: 'ASC' },
    });
  }
}
