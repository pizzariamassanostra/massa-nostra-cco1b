// ============================================
// DTO: UPDATE CUSTOMER
// ============================================
// Responsável por atualizar dados do perfil do cliente.
// Todos os campos são opcionais, exceto telefone, senha e aceite de termos.
// Inclui validações de CPF, telefone, email, senha e data de nascimento.
// ============================================

import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { validateCPF } from '../../../common/functions/validate-cpf';
import { Transform } from 'class-transformer';

// ========== VALIDADOR CUSTOMIZADO CPF ==========
@ValidatorConstraint({ name: 'cpf', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string) {
    if (!cpf) return true;
    return validateCPF(cpf);
  }

  defaultMessage() {
    return 'CPF inválido';
  }
}

// ========== FUNÇÃO DE TRANSFORMAÇÃO DE DATA ==========
function transformDate(value: any): string | null {
  if (!value) return null;

  // Se já está em ISO, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // Converte DD/MM/YYYY para ISO (YYYY-MM-DD)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/');
    return `${year}-${month}-${day}`;
  }

  // Tenta converter string de data genérica
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return null;
}

// ========== DTO ==========
export class UpdateCustomerDto {
  // Nome completo
  @ApiPropertyOptional({
    description: 'Nome completo',
    example: 'João Silva Santos',
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser um texto' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome muito longo' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  // CPF (com ou sem máscara)
  @ApiPropertyOptional({
    description: 'CPF do cliente',
    example: '123.456.789-09 ou 12345678909',
  })
  @IsOptional()
  @IsString({ message: 'CPF deve ser um texto' })
  @Validate(IsCPFConstraint)
  @Transform(({ value }) => value?.trim())
  cpf?: string;

  // Data de nascimento (DD/MM/YYYY ou YYYY-MM-DD)
  @ApiPropertyOptional({
    description: 'Data de nascimento',
    example: '20/05/1990',
  })
  @IsOptional()
  @Transform(({ value }) => transformDate(value))
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato DD/MM/YYYY ou YYYY-MM-DD',
  })
  birth_date?: string;

  // Telefone principal (10 ou 11 dígitos)
  @ApiProperty({ description: 'Telefone principal', example: '38999999999' })
  @IsString({ message: 'Telefone deve ser um texto' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone inválido (somente números, 10 ou 11 dígitos)',
  })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  phone: string;

  // Telefone alternativo (opcional)
  @ApiPropertyOptional({
    description: 'Telefone alternativo',
    example: '38988887777',
  })
  @IsOptional()
  @IsString({ message: 'Telefone alternativo deve ser um texto' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone alternativo inválido (10 ou 11 dígitos)',
  })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  phone_alternative?: string;

  // Email (opcional)
  @ApiPropertyOptional({
    description: 'Email do cliente',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  // Senha obrigatória (mín. 8 caracteres, maiúscula, minúscula e número)
  @ApiProperty({ description: 'Senha', example: 'SenhaForte123' })
  @IsString({ message: 'Senha deve ser um texto' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100, { message: 'Senha muito longa (máximo 100 caracteres)' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Senha deve conter letras maiúsculas, minúsculas e números',
  })
  password: string;

  // Aceite dos termos (obrigatório)
  @ApiProperty({ description: 'Aceite dos termos', example: true })
  @IsBoolean({ message: 'Aceite dos termos deve ser sim ou não' })
  @IsNotEmpty({ message: 'Aceite dos termos é obrigatório' })
  accept_terms: boolean;

  // Aceite de promoções (opcional)
  @ApiPropertyOptional({
    description: 'Aceite para receber promoções',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Aceite de promoções deve ser sim ou não' })
  accept_promotions?: boolean;
}
