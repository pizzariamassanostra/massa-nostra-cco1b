// ============================================
// SERVIÇO: RECHEIOS DE BORDA
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrustFilling } from '../entities/crust-filling.entity';

@Injectable()
export class FillingService {
  constructor(
    @InjectRepository(CrustFilling)
    private readonly fillingRepo: Repository<CrustFilling>,
  ) {}

  // ============================================
  // LISTAR TODOS OS RECHEIOS ATIVOS
  // ============================================
  async findAll(): Promise<CrustFilling[]> {
    return this.fillingRepo.find({
      where: { status: 'active', deleted_at: null },
      order: { sort_order: 'ASC' },
    });
  }
}
