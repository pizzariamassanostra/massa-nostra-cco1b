// ============================================
// Estratégia de validação de token JWT de clientes
// ============================================

import { CommonUser } from '@/modules/common-user/entities/common-user.entity';
import { FindOneCommonUserService } from '@/modules/common-user/services/find-one-common-user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(
  Strategy,
  'jwt-customer',
) {
  constructor(
    private readonly findOneCommonUserService: FindOneCommonUserService,
  ) {
    super({
      // De onde extrair o token (Header: Authorization: Bearer TOKEN)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Chave secreta (mesma usada para assinar o token)
      secretOrKey: process.env.JWT_SECRET,
      // Não ignorar expiração
      ignoreExpiration: false,
    });
  }

  // ============================================
  // VALIDAR PAYLOAD DO TOKEN
  // ============================================
  async validate(payload: any) {
    const { id, type } = payload;

    // Validar se é token de cliente
    if (type !== 'customer') {
      throw new Error('Token de administrador não pode ser usado aqui');
    }

    // Buscar cliente pelo ID do token
    const user: CommonUser = await this.findOneCommonUserService.findOne({
      where: [{ id }],
    });

    // Se não encontrar, token inválido
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Retornar usuário (será anexado ao req.user)
    return user;
  }
}
