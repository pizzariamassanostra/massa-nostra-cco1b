// ============================================
// DTO: AVALIAR FORNECEDOR
// ============================================

import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class SupplierEvaluationDto {
  // Identificador único do fornecedor avaliado
  @IsInt()
  supplier_id: number;

  // Nota de qualidade (1 a 5)
  @IsInt()
  @Min(1)
  @Max(5)
  quality_rating: number;

  // Nota de entrega (1 a 5)
  @IsInt()
  @Min(1)
  @Max(5)
  delivery_rating: number;

  // Nota de preço (1 a 5)
  @IsInt()
  @Min(1)
  @Max(5)
  price_rating: number;

  // Nota de atendimento/serviço (1 a 5)
  @IsInt()
  @Min(1)
  @Max(5)
  service_rating: number;

  // Comentários adicionais sobre a avaliação (opcional)
  @IsString()
  @IsOptional()
  comments?: string;
}
