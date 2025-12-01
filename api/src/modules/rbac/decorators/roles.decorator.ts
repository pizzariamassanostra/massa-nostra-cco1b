// ===========================================
// DECORATOR: @Roles
//============================================
// Marca rotas que requerem roles específicos
// Uso:
// @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
// @Get('admin-only')
// adminOnly() { ... }
// ===========================================

import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
