// ===========================================
// GUARD: ROLES
// Verifica se o usuário possui os roles necessários
// Uso:
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
// ===========================================

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obter roles requeridos do decorator
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não há roles requeridos, permite acesso
    if (!requiredRoles) {
      return true;
    }

    // Obter usuário da request
    const { user } = context.switchToHttp().getRequest();

    // Se não há usuário, nega acesso
    if (!user) {
      return false;
    }

    // Verificar se usuário possui algum dos roles requeridos
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
