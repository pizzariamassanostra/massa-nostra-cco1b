// ===========================================
// MÓDULO: RBAC
// Módulo de controle de acesso baseado em roles
// ===========================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades que representam papéis, permissões e associação usuário ↔ role
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';

// Serviços responsáveis pela lógica de negócio de roles e permissões
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';

// Controladores que expõem endpoints HTTP para gerenciamento de roles e permissões
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';

// Guards que aplicam regras de autorização em rotas
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  // Importa entidades para uso com o TypeORM neste módulo
  imports: [TypeOrmModule.forFeature([Role, Permission, UserRole])],

  // Define os controladores responsáveis por lidar com requisições HTTP
  controllers: [RoleController, PermissionController],

  // Serviços e guards disponíveis dentro do módulo
  providers: [RoleService, PermissionService, RolesGuard, PermissionsGuard],

  // Exporta serviços e guards para que possam ser utilizados em outros módulos
  exports: [RoleService, PermissionService, RolesGuard, PermissionsGuard],
})
export class RbacModule {}
