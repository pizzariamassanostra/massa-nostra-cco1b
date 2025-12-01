// ============================================
// REPOSITORY: ADMINISTRADORES
// ============================================
// Acesso ao banco de dados de administradores
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from '../entities/admin-user.entity';
import { Repository } from 'typeorm';
import { FindOneOptions } from '@/common/types/find-one-options.type';

@Injectable()
export class AdminUserRepository {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
  ) {}

  // ============================================
  // BUSCAR UM ADMINISTRADOR
  // ============================================
  async findOne(options: FindOneOptions<AdminUser>): Promise<AdminUser> {
    const qb = this.adminUserRepository.createQueryBuilder('admin_users');

    // Relacionamentos (se necessário)
    if (options.relations) {
      options.relations.forEach((relation) =>
        qb.leftJoinAndSelect(`admin_users.${relation}`, relation),
      );
    }

    // Incluir hash de senha (usado apenas no login)
    if (options.with_password_hash) {
      qb.addSelect('admin_users.password_hash');
    }

    // Condições WHERE
    if (options.where) {
      for (const where of options.where) {
        for (const [key, value] of Object.entries(where)) {
          qb.andWhere(`admin_users.${key} = :${key}`, { [key]: value });
        }
      }
    }

    const adminUser = await qb.getOne();
    return adminUser;
  }
}
