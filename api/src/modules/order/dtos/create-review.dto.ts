// ============================================
// DTO: CRIAR AVALIAÇÃO
// ============================================

import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  // ============================================
  // NOTA GERAL (OBRIGATÓRIA)
  // ============================================
  @IsInt({ message: 'Nota geral deve ser um número inteiro' })
  @Min(1, { message: 'Nota geral mínima é 1' })
  @Max(5, { message: 'Nota geral máxima é 5' })
  overall_rating: number;

  // ============================================
  // NOTAS ESPECÍFICAS (OPCIONAIS)
  // ============================================
  @IsOptional()
  @IsInt({ message: 'Qualidade da comida deve ser um número inteiro' })
  @Min(1, { message: 'Nota mínima é 1' })
  @Max(5, { message: 'Nota máxima é 5' })
  food_quality?: number;

  @IsOptional()
  @IsInt({ message: 'Tempo de entrega deve ser um número inteiro' })
  @Min(1, { message: 'Nota mínima é 1' })
  @Max(5, { message: 'Nota máxima é 5' })
  delivery_time?: number;

  @IsOptional()
  @IsInt({ message: 'Embalagem deve ser um número inteiro' })
  @Min(1, { message: 'Nota mínima é 1' })
  @Max(5, { message: 'Nota máxima é 5' })
  packaging?: number;

  // ============================================
  // COMENTÁRIO (OPCIONAL)
  // ============================================
  @IsOptional()
  @IsString({ message: 'Comentário deve ser uma string' })
  @MaxLength(500, { message: 'Comentário muito longo (máximo 500 caracteres)' })
  comment?: string;
}

