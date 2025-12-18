// ============================================
// GUARD: JWT CUSTOMER AUTH
// ============================================
// Autenticação exclusiva para clientes
// Diferente do JwtAuthGuard (admins)
// ============================================

// ============================================
// IMPORTS
// ============================================
import ApiError from '@/common/error/entities/api-error.entity';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ============================================
// CLASSE: JwtCustomerAuthGuard
// ============================================
@Injectable()
class JwtCustomerAuthGuard extends AuthGuard('jwt-customer') {
  // ============================================
  // MÉTODO: handleRequest
  // ============================================
  // - Trata erros de autenticação do Passport
  // - Personaliza mensagens para o cliente final
  // ============================================
  handleRequest(err: any, user: any, info: any) {
    // ============================================
    // TOKEN EXPIRADO
    // ============================================
    if (info?.message === 'jwt expired') {
      throw new ApiError(
        'token-expired',
        'Seu token expirou. Faça login novamente.',
        401,
      );
    }

    // ============================================
    // TOKEN AUSENTE
    // ============================================
    if (info?.message === 'No auth token') {
      throw new ApiError(
        'missing-token',
        'Você precisa estar logado para acessar esta funcionalidade.',
        401,
      );
    }

    // ============================================
    // TOKEN INVÁLIDO OU USUÁRIO NÃO AUTENTICADO
    // ============================================
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

    // ============================================
    // AUTENTICAÇÃO OK
    // ============================================
    return user;
  }
}

// ============================================
// EXPORTAÇÃO
// ============================================
export { JwtCustomerAuthGuard };
