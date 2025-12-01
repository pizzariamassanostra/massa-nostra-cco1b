// ============================================
// DTO: CRIAR PRODUTO
// ============================================
// Representa os dados necessários para criar um novo produto
// do cardápio, incluindo suas variações (tamanhos e preços).
// ============================================

import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para criação de variações de produto
export class CreateVariantDto {
  // Tamanho da variação (ex.: small, medium, large, unique)
  @IsString()
  size: string;

  // Label exibido (ex.: "Pequena - 4 pedaços")
  @IsString()
  label: string;

  // Preço em centavos (ex.: 3500 = R$ 35,00)
  @IsInt()
  price: number;

  // Número de pedaços (aplicável para pizzas)
  @IsOptional()
  @IsInt()
  servings?: number;
}

// DTO para criação de produto
export class CreateProductDto {
  // ID da categoria do produto (obrigatório)
  @IsInt({ message: 'ID da categoria é obrigatório' })
  category_id: number;

  // Nome do produto (obrigatório)
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  // Slug único para URL amigável (obrigatório)
  @IsString({ message: 'Slug é obrigatório' })
  slug: string;

  // Descrição detalhada do produto (opcional)
  @IsOptional()
  @IsString()
  description?: string;

  // URL da imagem do produto (opcional)
  @IsOptional()
  @IsString()
  image_url?: string;

  // Tipo do produto: simple (bebida) ou pizza (com variações)
  @IsIn(['simple', 'pizza'])
  type: string;

  // Status do produto: active, inactive, out_of_stock (opcional)
  @IsOptional()
  @IsIn(['active', 'inactive', 'out_of_stock'])
  status?: string;

  // Ordem de exibição no cardápio (opcional)
  @IsOptional()
  @IsInt()
  sort_order?: number;

  // Variações do produto (tamanhos e preços) - opcional
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}
