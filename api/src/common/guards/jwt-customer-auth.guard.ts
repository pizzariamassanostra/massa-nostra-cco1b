// ============================================
// GUARD: AUTENTICAÇÃO JWT PARA CLIENTES
// ============================================
// Protege rotas que exigem autenticação de cliente
// Diferente do JwtAuthGuard (que é para admins)
// ============================================

import ApiError from '@/common/error/entities/api-error.entity';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCustomerAuthGuard extends AuthGuard('jwt-customer') {
  handleRequest(err: any, user: any, info: any) {
    // Token expirado
    if (info?.message === 'jwt expired') {
      throw new ApiError(
        'token-expired',
        'Seu token expirou. Faça login novamente.',
        401,
      );
    }

    // Token ausente
    if (info?.message === 'No auth token') {
      throw new ApiError(
        'missing-token',
        'Você precisa estar logado para acessar esta funcionalidade.',
        401,
      );
    }

    // Erro genérico ou usuário não encontrado
    if (err || !user) {
      throw (
        err ||
        new ApiError(
          'unauthorized',
          'Token inválido. Faça login novamente.',
          401,
        )
      );
    }

    return user;
  }
}
