// ============================================
// DTO: AJUSTE DE ESTOQUE
// ============================================
// Corrige divergências de estoque (inventário)
// ============================================

import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class StockAdjustmentDto {
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
  new_quantity: number; // Nova quantidade correta

  // ============================================
  // JUSTIFICATIVA
  // ============================================
  @IsString()
  reason: string; // Motivo do ajuste (obrigatório)

  @IsString()
  @IsOptional()
  notes?: string;
}
