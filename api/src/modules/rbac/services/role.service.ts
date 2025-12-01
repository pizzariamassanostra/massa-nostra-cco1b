// ===========================================
// SERVIÇO: ROLE
// Gerencia operações relacionadas a roles
// ===========================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { AssignRoleDto } from '../dtos/assign-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   * Criar novo role
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificar se role já existe
    const existing = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existing) {
      throw new ConflictException('Role já existe');
    }

    // Buscar permissões se informadas
    let permissions: Permission[] = [];
    if (createRoleDto.permission_ids?.length) {
      permissions = await this.permissionRepository.find({
        where: { id: In(createRoleDto.permission_ids) },
      });
    }

    // Criar role
    const role = this.roleRepository.create({
      ...createRoleDto,
      permissions,
    });

    return await this.roleRepository.save(role);
  }

  /**
   * Listar todos os roles
   */
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['permissions'],
      order: { level: 'ASC' },
    });
  }

  /**
   * Buscar role por ID
   */
  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role não encontrado');
    }

    return role;
  }

  /**
   * Buscar role por nome
   */
  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name: name as any },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role não encontrado');
    }

    return role;
  }

  /**
   * Atualizar role
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Verificar se role é protegido
    if (role.is_protected) {
      throw new BadRequestException('Role protegido não pode ser editado');
    }

    // Atualizar permissões se informadas
    if (updateRoleDto.permission_ids) {
      const permissions = await this.permissionRepository.find({
        where: { id: In(updateRoleDto.permission_ids) },
      });
      role.permissions = permissions;
    }

    // Atualizar outros campos
    Object.assign(role, updateRoleDto);

    return await this.roleRepository.save(role);
  }

  /**
   * Deletar role
   */
  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    // Verificar se role é protegido
    if (role.is_protected) {
      throw new BadRequestException('Role protegido não pode ser deletado');
    }

    // Verificar se role está em uso
    const usageCount = await this.userRoleRepository.count({
      where: { role_id: id },
    });

    if (usageCount > 0) {
      throw new BadRequestException(
        `Role está atribuído a ${usageCount} usuário(s)`,
      );
    }

    await this.roleRepository.softDelete(id);
  }

  /**
   * Atribuir roles a usuário
   */
  async assignRolesToUser(
    assignRoleDto: AssignRoleDto,
    assignedBy: number,
  ): Promise<UserRole[]> {
    const { user_id, role_ids } = assignRoleDto;

    // Remover roles existentes
    await this.userRoleRepository.delete({ user_id });

    // Criar novos vínculos
    const userRoles = role_ids.map((role_id) =>
      this.userRoleRepository.create({
        user_id,
        role_id,
        assigned_by: assignedBy,
      }),
    );

    return await this.userRoleRepository.save(userRoles);
  }

  /**
   * Obter roles de um usuário
   */
  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { user_id: userId },
      relations: ['role', 'role.permissions'],
    });

    return userRoles.map((ur) => ur.role);
  }

  /**
   * Obter permissões de um usuário (através dos roles)
   */
  async getUserPermissions(userId: number): Promise<Permission[]> {
    const roles = await this.getUserRoles(userId);

    const allPermissions: Permission[] = [];
    roles.forEach((role) => {
      if (role.permissions) {
        allPermissions.push(...role.permissions);
      }
    });

    // Remover duplicatas
    return Array.from(new Map(allPermissions.map((p) => [p.id, p])).values());
  }

  /**
   * Verificar se usuário tem role específico
   */
  async userHasRole(userId: number, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some((role) => role.name === roleName);
  }

  /**
   * Verificar se usuário tem permissão específica
   */
  async userHasPermission(
    userId: number,
    permissionName: string,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some((permission) => permission.name === permissionName);
  }
}
