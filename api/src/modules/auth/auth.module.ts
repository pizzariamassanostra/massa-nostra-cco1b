// ============================================
// MODULO: AUTENTICAÇÃO
// ============================================
// Autenticação (Admin + Cliente)
// ============================================

import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtCustomerStrategy } from './strategies/jwt-customer.strategy';
import { AdminUserModule } from '../admin-user/admin-user.module';
import { UserRole } from '../rbac/entities/user-role.entity';
import { CommonUserModule } from '../common-user/common-user.module';

@Module({
  controllers: [AuthController],
  imports: [
    AdminUserModule,
    CommonUserModule,
    UserRole,
    ConfigModule,
    // ============================================
    // CONFIGURAÇÃO DO JWT
    // ============================================
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' }, // Token expira em 7 dias
      }),
    }),
    PassportModule,
  ],
  providers: [
    AuthService,
    LocalStrategy, // Login de admin
    JwtStrategy, // Validação de token admin
    JwtCustomerStrategy, // Validação de token cliente
  ],
})
export class AuthModule {}
