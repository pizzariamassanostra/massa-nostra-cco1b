// ============================================
// DTO: ENTRADA DE ESTOQUE
// ============================================
// Registra entrada de mercadoria (compra)
// ============================================

import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class StockEntryDto {
  // ============================================
  // INGREDIENTE
  // ============================================
  @IsInt()
  ingredient_id: number;

  // ============================================
  // QUANTIDADE
  // ============================================
  @IsNumber()
  @Min(0.001)
  quantity: number; // Quantidade recebida

  @IsNumber()
  @Min(0)
  unit_cost: number; // Custo unitário

  // ============================================
  // LOTE E VALIDADE
  // ============================================
  @IsString()
  @IsOptional()
  batch_number?: string; // Número do lote

  @IsDateString()
  @IsOptional()
  manufacturing_date?: string; // Data de fabricação

  @IsDateString()
  @IsOptional()
  expiry_date?: string; // Data de validade

  // ============================================
  // ORIGEM
  // ============================================
  @IsInt()
  @IsOptional()
  supplier_id?: number; // Fornecedor

  @IsString()
  @IsOptional()
  invoice_number?: string; // Número da NF

  // ============================================
  // LOCALIZAÇÃO
  // ============================================
  @IsString()
  @IsOptional()
  location?: string; // Ex: "Prateleira A3"

  // ============================================
  // OBSERVAÇÕES
  // ============================================
  @IsString()
  @IsOptional()
  notes?: string;
}
