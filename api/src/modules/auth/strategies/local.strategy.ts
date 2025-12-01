// ============================================
// Estratégia de autenticação com usuário e senha
// ============================================

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@nestjs/common';
import ApiError from '@/common/error/entities/api-error.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // ============================================
  // VALIDAR CREDENCIAIS DO ADMINISTRADOR
  // ============================================
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new ApiError('invalid-credentials', 'Credenciais inválidas', 401);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
