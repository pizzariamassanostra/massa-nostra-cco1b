// ============================================
// DTO: CRIAR ENDEREÇO
// ============================================
// Representa os dados necessários para cadastrar um novo endereço
// de entrega do cliente.
// ============================================

import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  // Nome da rua
  @IsString()
  street: string;

  // Número da residência ou estabelecimento
  @IsString()
  number: string;

  // Complemento (ex.: apartamento, bloco) - opcional
  @IsOptional()
  @IsString()
  complement?: string;

  // Bairro
  @IsString()
  neighborhood: string;

  // Cidade
  @IsString()
  city: string;

  // Estado (UF com 2 caracteres, ex.: SP, MG)
  @IsString()
  @Length(2, 2)
  state: string;

  // CEP (formato válido: xxxxx-xxx ou xxxxxxxx)
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  zip_code: string;

  // Referência adicional para entrega (opcional)
  @IsOptional()
  @IsString()
  reference?: string;

  // Define se este endereço será o padrão do cliente (opcional)
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
