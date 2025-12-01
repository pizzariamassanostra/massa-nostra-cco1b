// ============================================
// DTO: PAGINAÇÃO
// ============================================
// DTO para listagens paginadas
// ============================================

import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto<T = {}> {
  // Busca por nome/ID
  @IsOptional()
  name?: string;

  // Número da página
  @IsInt({
    context: {
      message: 'invalid-page',
      userMessage: 'Página inválida',
    },
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  // Resultados por página
  @IsInt({
    context: {
      message: 'invalid-per_page',
      userMessage: 'Resultados por página inválido',
    },
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  per_page?: number;

  // Campo de ordenação
  @IsOptional()
  orderBy?: keyof T;

  // Direção da ordenação
  @IsOptional()
  direction?: 'ASC' | 'DESC';
}
