// ============================================
// DTO: SAÍDA DE ESTOQUE
// ============================================
// Registra saída de mercadoria (consumo, venda)
// ============================================

import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { MovementType } from '../enums/movement-type.enum';

export class StockExitDto {
  // ============================================
  // INGREDIENTE
  // ============================================
  @IsInt()
  ingredient_id: number;

  @IsInt()
  @IsOptional()
  stock_id?: number; // Lote específico

  // ============================================
  // QUANTIDADE
  // ============================================
  @IsNumber()
  @Min(0.001)
  quantity: number; // Quantidade consumida/vendida

  // ============================================
  // MOTIVO
  // ============================================
  @IsEnum(MovementType)
  type: MovementType;

  @IsString()
  @IsOptional()
  reason?: string; // Motivo da saída

  // ============================================
  // DESTINO
  // ============================================
  @IsInt()
  @IsOptional()
  order_id?: number; // Pedido relacionado (se venda)

  // ============================================
  // OBSERVAÇÕES
  // ============================================
  @IsString()
  @IsOptional()
  notes?: string;
}
