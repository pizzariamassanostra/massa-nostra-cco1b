// ===========================================
// SERVIÇO: PERMISSION
// Gerencia operações relacionadas a permissões
// ===========================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Listar todas as permissões
   */
  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find({
      order: { resource: 'ASC', action: 'ASC' },
    });
  }

  /**
   * Buscar permissão por ID
   */
  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permissão não encontrada');
    }

    return permission;
  }

  /**
   * Buscar permissões por recurso
   */
  async findByResource(resource: string): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: { resource },
      order: { action: 'ASC' },
    });
  }

  /**
   * Agrupar permissões por recurso
   */
  async findGrouped(): Promise<Record<string, Permission[]>> {
    const permissions = await this.findAll();

    const grouped: Record<string, Permission[]> = {};

    permissions.forEach((permission) => {
      if (!grouped[permission.resource]) {
        grouped[permission.resource] = [];
      }
      grouped[permission.resource].push(permission);
    });

    return grouped;
  }
}
