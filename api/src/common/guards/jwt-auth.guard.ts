// ===========================================
// GUARD: JWT AUTH (ATUALIZADO COM ROLES)
// Sistema de Autenticação - Pizzaria Massa Nostra
//
// Valida JWT e carrega roles do usuário
// ===========================================

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '@/modules/rbac/entities/user-role.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Validar JWT primeiro
    const isValid = await super.canActivate(context);

    if (!isValid) {
      return false;
    }

    // Obter request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se não há usuário, negar acesso
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    // Buscar roles do usuário
    try {
      const userRoles = await this.userRoleRepository.find({
        where: { user_id: user.id },
        relations: ['role'],
      });

      // Adicionar roles ao user
      user.roles = userRoles.map((ur) => ur.role.name);

      // Se não tem roles, adicionar array vazio
      if (!user.roles || user.roles.length === 0) {
        user.roles = [];
      }
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      user.roles = [];
    }

    return true;
  }
}
