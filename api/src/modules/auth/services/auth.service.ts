// ============================================
// Serviço de autenticação de administradores
// ============================================

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminUser } from '@/modules/admin-user/entities/admin-user.entity';
import * as bcrypt from 'bcrypt';
import { FindOneAdminUserService } from '@/modules/admin-user/services/find-one-admin-user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly findOneAdminUserService: FindOneAdminUserService,
    private jwtService: JwtService,
  ) {}

  // ============================================
  // VALIDAR USUÁRIO E SENHA
  // ============================================
  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<AdminUser>> {
    // Buscar administrador por email
    const user = await this.findOneAdminUserService.findOne({
      where: [{ email: username }],
      with_password_hash: true,
    });

    // Validar senha com bcrypt
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }

    return null;
  }

  // ============================================
  // GERAR RESPOSTA DE LOGIN
  // ============================================
  async getLoginResponse(user: AdminUser) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
