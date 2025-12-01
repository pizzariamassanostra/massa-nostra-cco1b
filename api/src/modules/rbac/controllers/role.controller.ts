// ===========================================
// CONTROLLER: ROLE
// ===========================================
// Endpoints responsáveis pelo gerenciamento de roles (papéis/funções)
// ===========================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../enums/role.enum';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { AssignRoleDto } from '../dtos/assign-role.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // Criar um novo role (apenas SUPER_ADMIN)
  @Post()
  @Roles(RoleEnum.SUPER_ADMIN)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return {
      ok: true,
      message: 'Role criado com sucesso',
      data: role,
    };
  }

  // Listar todos os roles (SUPER_ADMIN e MANAGER)
  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findAll() {
    const roles = await this.roleService.findAll();
    return {
      ok: true,
      data: roles,
    };
  }

  // Buscar um role específico por ID (SUPER_ADMIN e MANAGER)
  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(+id);
    return {
      ok: true,
      data: role,
    };
  }

  // Atualizar um role existente (apenas SUPER_ADMIN)
  @Put(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(+id, updateRoleDto);
    return {
      ok: true,
      message: 'Role atualizado com sucesso',
      data: role,
    };
  }

  // Deletar um role (apenas SUPER_ADMIN)
  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.roleService.remove(+id);
    return {
      ok: true,
      message: 'Role deletado com sucesso',
    };
  }

  // Atribuir roles a um usuário (endpoint protegido, mas sem decorator ativo)
  @Post('assign')
  // @Roles(RoleEnum.ADMIN) // Comentado: pode ser ativado conforme regra de negócio
  async assignRoles(@Body() assignRoleDto: AssignRoleDto, @Request() req) {
    const userRoles = await this.roleService.assignRolesToUser(
      assignRoleDto,
      req.user.id,
    );

    return {
      ok: true,
      message: 'Roles atribuídos com sucesso',
      data: userRoles,
    };
  }

  // Obter todos os roles de um usuário (SUPER_ADMIN e MANAGER)
  @Get('user/:userId')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async getUserRoles(@Param('userId') userId: string) {
    const roles = await this.roleService.getUserRoles(+userId);
    return {
      ok: true,
      data: roles,
    };
  }

  // Obter todas as permissões de um usuário (SUPER_ADMIN e MANAGER)
  @Get('user/:userId/permissions')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async getUserPermissions(@Param('userId') userId: string) {
    const permissions = await this.roleService.getUserPermissions(+userId);
    return {
      ok: true,
      data: permissions,
    };
  }
}
