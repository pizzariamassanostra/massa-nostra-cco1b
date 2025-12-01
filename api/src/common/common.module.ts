// ============================================
// MÓDULO: COMMON
// ============================================
// Módulo compartilhado que centraliza configurações comuns,
// exportando o TypeOrmModule para uso em outros módulos.
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../modules/rbac/entities/user-role.entity';

@Module({
  // Registra a entidade UserRole para uso com TypeORM
  imports: [TypeOrmModule.forFeature([UserRole])],

  // Exporta TypeOrmModule para que outros módulos possam utilizar
  exports: [TypeOrmModule],
})
export class CommonModule {}
