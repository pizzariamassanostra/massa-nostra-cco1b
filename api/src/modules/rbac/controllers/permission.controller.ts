// ===========================================
// CONTROLLER: PERMISSION
// ===========================================
// Endpoints responsáveis pelo gerenciamento de permissões
// ===========================================

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../enums/role.enum';
import { PermissionService } from '../services/permission.service';

@Controller('permissions')
// @UseGuards(JwtAuthGuard, RolesGuard) // Proteção comentada, pode ser ativada conforme regra de negócio
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Listar todas as permissões (SUPER_ADMIN e MANAGER)
  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findAll() {
    const permissions = await this.permissionService.findAll();
    return {
      ok: true,
      data: permissions,
    };
  }

  // Buscar uma permissão específica por ID (SUPER_ADMIN e MANAGER)
  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionService.findOne(+id);
    return {
      ok: true,
      data: permission,
    };
  }

  // Listar permissões agrupadas por recurso (SUPER_ADMIN e MANAGER)
  @Get('grouped/all')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findGrouped() {
    const grouped = await this.permissionService.findGrouped();
    return {
      ok: true,
      data: grouped,
    };
  }

  // Buscar permissões de acordo com o recurso informado (SUPER_ADMIN e MANAGER)
  @Get('resource/:resource')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findByResource(@Param('resource') resource: string) {
    const permissions = await this.permissionService.findByResource(resource);
    return {
      ok: true,
      data: permissions,
    };
  }
}
