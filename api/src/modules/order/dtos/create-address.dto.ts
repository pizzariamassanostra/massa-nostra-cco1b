// ============================================
// DTO:  CREATE ADDRESS
// CORREÇÃO: Aceitar string no campo number
// ============================================

import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @MaxLength(20)
  number: string;

  @ApiPropertyOptional({ example: 'Apto 101' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  complement?: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @MaxLength(100)
  neighborhood: string;

  @ApiProperty({ example: 'Montes Claros' })
  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'MG' })
  @IsString()
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @MaxLength(2)
  state: string;

  @ApiProperty({ example: '39400-000' })
  @IsString()
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @MaxLength(10)
  zip_code: string;

  @ApiPropertyOptional({ example: 'Próximo ao mercado' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  reference?: string;

  @ApiPropertyOptional({ example: 'Não tocar a campainha' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  delivery_instructions?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
