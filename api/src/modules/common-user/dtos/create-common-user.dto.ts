// ============================================
// DTO: CREATE COMMON USER (LEGACY)
// ============================================
// DTO legado para criação de usuário comum com campos mínimos.
// Inclui validações básicas para nome e telefone.
// ============================================

import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCommonUserDto {
  // Nome completo obrigatório (mínimo 3 caracteres, máximo 255)
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva',
  })
  @IsNotEmpty({
    context: {
      message: 'missing-name',
      userMessage: 'Nome obrigatório',
    },
  })
  @IsString({
    context: {
      message: 'invalid-name',
      userMessage: 'Nome inválido',
    },
  })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome muito longo' })
  @Transform(({ value }) => value?.trim())
  name: string;

  // Telefone obrigatório (10 ou 11 dígitos, somente números)
  @ApiProperty({
    description: 'Telefone (10 ou 11 dígitos)',
    example: '38999999999',
  })
  @IsNotEmpty({
    context: {
      message: 'missing-phone',
      userMessage: 'Telefone obrigatório',
    },
  })
  @IsString({
    context: {
      message: 'invalid-phone',
      userMessage: 'Telefone inválido',
    },
  })
  @Matches(/^\d{10,11}$/, {
    context: {
      message: 'invalid-phone-format',
      userMessage: 'Telefone deve ter 10 ou 11 dígitos',
    },
  })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  phone: string;
}
