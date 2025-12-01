// ============================================
// DTO: ADICIONAR ITEM AO PEDIDO
// ============================================

import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  product_id: number;

  @IsInt()
  variant_id: number; // ID da variação (P/M/G)

  @IsOptional()
  @IsInt()
  crust_id?: number; // ID da borda (se pizza)

  @IsOptional()
  @IsInt()
  filling_id?: number; // ID do recheio (se pizza)

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string; // Observações do item
}


