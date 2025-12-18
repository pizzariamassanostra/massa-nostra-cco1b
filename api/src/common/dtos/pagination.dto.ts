// ============================================
// DTO: PAGINAÇÃO
// ============================================
// DTO genérico utilizado em listagens paginadas
// Suporta busca, paginação e ordenação
// ============================================

// ============================================
// IMPORTS
// ============================================
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

// ============================================
// DTO: PaginationDto
// ============================================
export class PaginationDto<T = {}> {
  // ============================================
  // FILTRO: Busca por nome ou identificador
  // ============================================
  @IsOptional()
  name?: string;

  // ============================================
  // PAGINAÇÃO: Número da página
  // ============================================
  @IsInt({
    context: {
      message: 'invalid-page',
      userMessage: 'Página inválida',
    },
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value)) // Converte string para número
  page?: number;

  // ============================================
  // PAGINAÇÃO: Resultados por página
  // ============================================
  @IsInt({
    context: {
      message: 'invalid-per_page',
      userMessage: 'Resultados por página inválido',
    },
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value)) // Converte string para número
  per_page?: number;

  // ============================================
  // ORDENAÇÃO: Campo de ordenação
  // ============================================
  @IsOptional()
  orderBy?: keyof T;

  // ============================================
  // ORDENAÇÃO: Direção (ASC | DESC)
  // ============================================
  @IsOptional()
  direction?: 'ASC' | 'DESC';
}
