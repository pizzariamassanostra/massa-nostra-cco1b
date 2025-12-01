// ============================================
// DTO: CRIAR BORDA
// ============================================
// Representa os dados necessários para criar uma nova borda de pizza,
// incluindo nome, slug, descrição e valor adicional.
// ============================================

import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateCrustDto {
  // Nome da borda (ex.: "Tradicional", "Vulcão", "Trançada")
  @IsString()
  name: string;

  // Slug único para identificação (ex.: tradicional, vulcao, trancada)
  @IsString()
  slug: string;

  // Descrição detalhada da borda (opcional)
  @IsOptional()
  @IsString()
  description?: string;

  // Valor adicional em centavos (ex.: 500 = R$ 5,00)
  @IsInt()
  price_modifier: number;

  // Status da borda (active, inactive) - opcional
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  // Ordem de exibição no cardápio (opcional)
  @IsOptional()
  @IsInt()
  sort_order?: number;
}
