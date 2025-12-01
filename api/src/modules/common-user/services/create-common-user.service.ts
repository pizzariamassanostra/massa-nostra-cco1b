// ============================================
// SERVIÇO: CRIAR CLIENTE SIMPLES
// ============================================
// Serviço legado para criação simples de cliente
// ============================================

import { Injectable } from '@nestjs/common';
import { CommonUser } from '../entities/common-user.entity';
import { CommonUserRepository } from '../repositories/common-user.repository';
import { CreateCommonUserDto } from '../dtos/create-common-user.dto';

@Injectable()
export class CreateCommonUserService {
  constructor(private readonly commonUserRepository: CommonUserRepository) {}

  // ============================================
  // CRIAR OU RETORNAR CLIENTE (MÉTODO LEGADO)
  // ============================================
  // Busca por telefone, se não existir cria novo
  // Usado para integrações internas
  async createOrReturn(dto: CreateCommonUserDto): Promise<CommonUser> {
    // Formatar telefone
    const formattedPhone = dto.phone.replace(/\D/g, '');

    // Buscar por telefone
    let commonUser = await this.commonUserRepository.findOne({
      where: [{ phone: formattedPhone }],
    });

    // Se não existir, criar
    if (!commonUser) {
      const newUser = new CommonUser();
      newUser.name = dto.name;
      newUser.phone = formattedPhone;
      commonUser = await this.commonUserRepository.create(newUser);
    }

    return commonUser;
  }
}
