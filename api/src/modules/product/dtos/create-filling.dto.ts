// ============================================
// DTO: CRIAR RECHEIO DE BORDA
// ============================================
// Representa os dados necessários para criar um novo recheio
// de borda especial (ex.: Catupiry, Cheddar).
// ============================================

import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateFillingDto {
  // Nome do recheio (ex.: "Catupiry", "Cheddar")
  @IsString()
  name: string;

  // Slug único para identificação (ex.: catupiry, cheddar)
  @IsString()
  slug: string;

  // Descrição detalhada do recheio (opcional)
  @IsOptional()
  @IsString()
  description?: string;

  // Preço adicional em centavos (ex.: 500 = R$ 5,00)
  @IsInt()
  price: number;

  // Status do recheio (active, inactive) - opcional
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  // Ordem de exibição no cardápio (opcional)
  @IsOptional()
  @IsInt()
  sort_order?: number;
}
