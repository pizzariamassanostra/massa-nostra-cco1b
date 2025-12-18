// ============================================
// DTO: VALOR GENÉRICO
// ============================================
// DTO utilizado em operações que recebem
// apenas um valor numérico simples
// (ex.: atualização de preço, taxa, quantidade)
// ============================================

// ============================================
// IMPORTS
// ============================================
import { IsNotEmpty, IsNumber } from 'class-validator';

// ============================================
// DTO: ValueDto
// ============================================
export class ValueDto {
  // ============================================
  // CAMPO: Valor numérico obrigatório
  // ============================================
  @IsNotEmpty({
    context: {
      message: 'missing-value',
      userMessage: 'Valor obrigatório',
    },
  })
  @IsNumber(
    {},
    {
      context: {
        message: 'invalid-value',
        userMessage: 'Valor inválido',
      },
    },
  )
  value: number; // Valor numérico recebido pela operação
}
