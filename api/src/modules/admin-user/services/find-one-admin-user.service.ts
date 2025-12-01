// ============================================
// SERVIÇO: BUSCAR ADMINISTRADOR
// ============================================
// Busca administradores do sistema (login, validação, etc)
// ============================================

import { Injectable } from '@nestjs/common';
import { AdminUser } from '../entities/admin-user.entity';
import { AdminUserRepository } from '../repositories/admin-user.repository';
import { FindOneOptions } from '@/common/types/find-one-options.type';

@Injectable()
export class FindOneAdminUserService {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  // ============================================
  // BUSCAR UM ADMINISTRADOR
  // ============================================
  // Usado para login e validação de token JWT
  async findOne(options: FindOneOptions<AdminUser>): Promise<AdminUser> {
    return await this.adminUserRepository.findOne(options);
  }
}
