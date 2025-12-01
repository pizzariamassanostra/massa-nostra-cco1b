// ============================================
// DTO: CRIAR ENDEREÇO DE CLIENTE
// ============================================
// Define os campos obrigatórios e opcionais para cadastrar
// um novo endereço de cliente com validações.
// ============================================

import {
  IsString,
  IsOptional,
  MinLength,
  Matches,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateCustomerAddressDto {
  // CEP aceito com ou sem hífen (ex.: 39400-001 ou 39400001)
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve estar no formato 12345-678 ou 12345678',
  })
  cep: string;

  // Nome da rua (mínimo 3 caracteres)
  @IsString()
  @MinLength(3)
  street: string;

  // Número do imóvel (pode ser "S/N" para sem número)
  @IsString()
  @MinLength(1)
  number: string;

  // Complemento opcional (apto, bloco, etc.)
  @IsOptional()
  @IsString()
  complement?: string;

  // Nome do bairro (mínimo 2 caracteres)
  @IsString()
  @MinLength(2)
  neighborhood: string;

  // Nome da cidade (mínimo 2 caracteres)
  @IsString()
  @MinLength(2)
  city: string;

  // Sigla do estado (exatamente 2 caracteres - ex.: MG, SP, RJ)
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  state: string;

  // Ponto de referência opcional
  @IsOptional()
  @IsString()
  reference?: string;

  // Instruções especiais de entrega (opcional)
  @IsOptional()
  @IsString()
  delivery_instructions?: string;

  // Define se é o endereço padrão (apenas 1 por cliente)
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
