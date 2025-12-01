// ===========================================
// DECORATOR: @RequirePermissions
//============================================
// Marca rotas que requerem permissões específicas
// Uso:
// @RequirePermissions(PermissionEnum.ORDERS_CREATE)
// @Post('create')
// create() { ... }
// ===========================================

import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
