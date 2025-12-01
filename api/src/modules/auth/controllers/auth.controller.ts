// ============================================
// CONTROLLER: AUTENTICAÇÃO
// ============================================
// Endpoints de login e validação de token
// ============================================

import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Request } from 'express';
import { AdminUser } from '@/modules/admin-user/entities/admin-user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============================================
  // LOGIN DE ADMINISTRADOR
  // ============================================
  @Post('authenticate')
  @UseGuards(AuthGuard('local'))
  async authenticate(@Req() req: Request) {
    const user = req.user as AdminUser;
    return this.authService.getLoginResponse(user);
  }

  // ============================================
  // VERIFICAR TOKEN JWT
  // ============================================
  @Post('verify-jwt')
  @UseGuards(JwtAuthGuard)
  async verifyGuard(@Req() req: Request) {
    return { ok: true, user: req.user };
  }
}
