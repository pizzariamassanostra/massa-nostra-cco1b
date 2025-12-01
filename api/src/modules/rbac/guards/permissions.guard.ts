// ===========================================
// GUARD: PERMISSIONS
// Verifica se o usuário possui as permissões necessárias
// Uso:
// @UseGuards(JwtAuthGuard, PermissionsGuard)
// @RequirePermissions(PermissionEnum. ORDERS_CREATE)
// ===========================================

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from '../enums/permission.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obter permissões requeridas do decorator
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // Se não há permissões requeridas, permite acesso
    if (!requiredPermissions) {
      return true;
    }

    // Obter usuário da request
    const { user } = context.switchToHttp().getRequest();

    // Se não há usuário, nega acesso
    if (!user) {
      return false;
    }

    // Verificar se usuário possui todas as permissões requeridas
    return requiredPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
