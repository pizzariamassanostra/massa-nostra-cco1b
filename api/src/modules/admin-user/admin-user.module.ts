// ============================================
// MODULO: USUÁRIOS ADMINISTRADORES
// ============================================
// Gerenciamento de administradores da pizzaria
// (Administrador, Gerente, Analista, Assistente, etc)
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { FindOneAdminUserService } from './services/find-one-admin-user.service';
import { AdminUserRepository } from './repositories/admin-user.repository';
import { AdminPanelController } from './controllers/admin-panel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  controllers: [AdminPanelController],
  providers: [FindOneAdminUserService, AdminUserRepository],
  exports: [FindOneAdminUserService],
})
export class AdminUserModule {}
