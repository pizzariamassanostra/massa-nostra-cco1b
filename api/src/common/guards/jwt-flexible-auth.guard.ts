// ============================================
// GUARD: JWT FLEXIBLE AUTH
// ============================================
// Guard de autenticação que aceita tanto tokens de admin quanto de cliente.
// Trata erros de autenticação e retorna mensagens apropriadas.
// ============================================

import ApiError from '@/common/error/entities/api-error.entity';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtFlexibleAuthGuard extends AuthGuard(['jwt', 'jwt-customer']) {
  // Verifica se o usuário pode acessar o recurso
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Trata erros de autenticação e retorna mensagens apropriadas
  handleRequest(err: any, user: any, info: any) {
    // Valida se token expirou
    if (info?.message === 'jwt expired') {
      throw new ApiError('token-expired', 'Token expirado', 401);
    }

    // Valida se token foi fornecido
    if (info?.message === 'No auth token') {
      throw new ApiError(
        'missing-token',
        'Você precisa estar autenticado',
        401,
      );
    }

    // Valida se token é válido
    if (err || !user) {
      throw err || new ApiError('unauthorized', 'Token inválido', 401);
    }

    // Retorna dados do usuário autenticado
    return user;
  }
}
