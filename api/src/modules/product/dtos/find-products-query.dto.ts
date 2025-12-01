// ============================================
// DTO: QUERY PARAMS PARA BUSCAR PRODUTOS
// ============================================
// Representa os filtros opcionais utilizados na rota GET /product
// ============================================

import { IsOptional, IsString } from 'class-validator';

export class FindProductsQueryDto {
  // ID da categoria do produto (opcional)
  @IsOptional()
  @IsString()
  category_id?: string;

  // Status do produto (ex.: active, inactive, out_of_stock) - opcional
  @IsOptional()
  @IsString()
  status?: string;

  // Tipo do produto (ex.: simple, pizza) - opcional
  @IsOptional()
  @IsString()
  type?: string;
}
