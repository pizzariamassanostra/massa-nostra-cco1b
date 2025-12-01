// ============================================
// REPOSITORY: CLIENTES
// ============================================
// Acesso ao banco de dados de clientes da pizzaria
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonUser } from '../entities/common-user.entity';
import { Repository } from 'typeorm';
import { FindOneOptions } from '@/common/types/find-one-options.type';
import { ListOptions } from '@/common/types/list-options.type';

@Injectable()
export class CommonUserRepository {
  constructor(
    @InjectRepository(CommonUser)
    private readonly commonUserRepository: Repository<CommonUser>,
  ) {}

  // ============================================
  // LISTAR CLIENTES COM PAGINAÇÃO
  // ============================================
  async list(
    options: ListOptions<CommonUser>,
  ): Promise<{ commonUsers: Partial<CommonUser>[]; count: number }> {
    const qb = this.commonUserRepository.createQueryBuilder('common_users');
    const { page = 1, per_page = 10 } = options;

    // Filtro por nome ou telefone
    if (options.name) {
      qb.where(
        'common_users.name ILIKE :name OR common_users.phone ILIKE :name',
        { name: `%${options.name}%` },
      );
    }

    // Condições WHERE adicionais
    if (options.where) {
      for (const where of options.where) {
        for (const [key, value] of Object.entries(where)) {
          qb.andWhere(`common_users.${key} = :${key}`, { [key]: value });
        }
      }
    }

    // Filtro por IDs específicos
    if (options.ids) {
      qb.andWhereInIds(options.ids);
    }

    // Campos adicionais no SELECT
    if (options.additionalSelects) {
      for (const additionalSelect of options.additionalSelects) {
        qb.addSelect(`common_users.${additionalSelect}`);
      }
    }

    // Relacionamentos
    if (options.relations) {
      options.relations.forEach((relation) =>
        qb.leftJoinAndSelect(
          `common_users.${relation}`,
          relation.toLowerCase(),
        ),
      );
    }

    // Ordenação
    const orderByField = options.orderBy || 'created_at';
    const direction = options.direction || 'DESC';
    qb.orderBy(`common_users.${String(orderByField)}`, direction);

    // Paginação
    qb.skip((page - 1) * per_page);
    qb.take(per_page);

    const [commonUsers, count] = await qb.getManyAndCount();
    return { commonUsers, count };
  }

  // ============================================
  // BUSCAR UM CLIENTE
  // ============================================
  async findOne(options: FindOneOptions<CommonUser>): Promise<CommonUser> {
    const qb = this.commonUserRepository.createQueryBuilder('common_users');

    if (options.relations) {
      options.relations.forEach((relation) =>
        qb.leftJoinAndSelect(`common_users.${relation}`, relation),
      );
    }

    if (options.with_password_hash) {
      qb.addSelect('common_users.password_hash');
    }

    if (options.where && options.where.length > 0) {
      if (options.where.length > 1) {
        const conditions = options.where.map((where, index) => {
          const key = Object.keys(where)[0];
          const value = where[key];
          const paramName = `${key}_${index}`;

          return {
            condition: `common_users.${key} = :${paramName}`,
            param: { [paramName]: value },
          };
        });

        const conditionsString = conditions
          .map((c) => c.condition)
          .join(' OR ');

        const allParams = conditions.reduce(
          (acc, c) => ({ ...acc, ...c.param }),
          {},
        );

        qb.where(`(${conditionsString})`, allParams);
      } else {
        for (const [key, value] of Object.entries(options.where[0])) {
          qb.andWhere(`common_users.${key} = :${key}`, { [key]: value });
        }
      }
    }

    if (options.additionalSelects) {
      options.additionalSelects.forEach((select) => {
        qb.addSelect(`common_users.${select}`);
      });
    }

    return qb.getOne();
  }

  // ============================================
  // CRIAR CLIENTE
  // ============================================
  async create(commonUser: CommonUser): Promise<CommonUser> {
    return await this.commonUserRepository.save(commonUser);
  }

  // ============================================
  // ATUALIZAR CLIENTE (MÉTODO CORRETO PARA customer.service.ts)
  // ============================================
  async update(
    userId: number,
    updateData: Partial<CommonUser>,
  ): Promise<CommonUser> {
    // Atualiza no banco
    await this.commonUserRepository.update(userId, updateData);

    // Retorna usuário atualizado
    return await this.findOne({
      where: [{ id: userId }],
    });
  }

  // ============================================
  // DELETAR CLIENTE
  // ============================================
  async softDelete(id: number): Promise<void> {
    await this.commonUserRepository.softDelete(id);
  }
}
