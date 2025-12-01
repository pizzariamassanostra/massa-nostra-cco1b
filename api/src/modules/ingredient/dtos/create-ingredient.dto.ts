// ============================================
// DTO: CRIAR INGREDIENTE
// ============================================
// Validação de dados para cadastro de ingrediente
// ============================================

import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Length,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { IngredientStatus } from '../enums/ingredient-status.enum';
import { IngredientGroup } from '../enums/ingredient-group.enum';
import { UnitMeasure } from '../enums/unit-measure.enum';

export class CreateIngredientDto {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @IsString()
  @Length(3, 200)
  name: string; // Ex: "Farinha de Trigo Tipo 1"

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  brand?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  manufacturer?: string;

  // ============================================
  // CÓDIGOS
  // ============================================
  @IsString()
  @IsOptional()
  @Length(13, 13)
  ean?: string; // Código de barras

  @IsString()
  @IsOptional()
  supplier_code?: string;

  // ============================================
  // UNIDADE DE MEDIDA
  // ============================================
  @IsEnum(UnitMeasure)
  unit_measure: UnitMeasure;

  @IsNumber()
  @IsOptional()
  @Min(0)
  package_quantity?: number;

  // ============================================
  // GRUPO/CATEGORIA
  // ============================================
  @IsEnum(IngredientGroup)
  group: IngredientGroup;

  @IsInt()
  @IsOptional()
  category_id?: number;

  // ============================================
  // VALORES
  // ============================================
  @IsNumber()
  @Min(0)
  cost_price: number; // Preço de custo

  @IsNumber()
  @IsOptional()
  @Min(0)
  sale_price?: number; // Preço de venda

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  profit_margin?: number; // Margem de lucro (%)

  // ============================================
  // CLASSIFICAÇÃO FISCAL
  // ============================================
  @IsString()
  @IsOptional()
  @Length(8, 8)
  ncm?: string;

  @IsString()
  @IsOptional()
  @Length(7, 7)
  cest?: string;

  @IsString()
  @IsOptional()
  @Length(4, 4)
  cfop?: string;

  @IsString()
  @IsOptional()
  @Length(3, 3)
  cst?: string;

  // ============================================
  // STATUS
  // ============================================
  @IsEnum(IngredientStatus)
  @IsOptional()
  status?: IngredientStatus;

  // ============================================
  // OBSERVAÇÕES
  // ============================================
  @IsString()
  @IsOptional()
  notes?: string;
}
