// ============================================
// SERVIÇO: BUSCAR CLIENTE
// ============================================
// Busca e lista clientes da pizzaria
// ============================================

import { Injectable } from '@nestjs/common';
import { CommonUser } from '../entities/common-user.entity';
import { CommonUserRepository } from '../repositories/common-user.repository';
import { FindOneOptions } from '@/common/types/find-one-options.type';
import { ListOptions } from '@/common/types/list-options.type';

@Injectable()
export class FindOneCommonUserService {
  constructor(private readonly commonUserRepository: CommonUserRepository) {}

  // ============================================
  // BUSCAR UM CLIENTE
  // ============================================
  async findOne(options: FindOneOptions<CommonUser>): Promise<CommonUser> {
    return await this.commonUserRepository.findOne(options);
  }

  // ============================================
  // LISTAR CLIENTES (PAGINADO)
  // ============================================
  async list(options: ListOptions<CommonUser>): Promise<{
    commonUsers: Partial<CommonUser>[];
    count: number;
  }> {
    return await this.commonUserRepository.list(options);
  }
}
