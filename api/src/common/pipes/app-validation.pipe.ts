// ============================================
// PIPE: VALIDAÇÃO GLOBAL DE DTOs
// ============================================
// Valida todos os DTOs da aplicação
// Formata erros de validação de forma amigável
// ============================================

import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // Remove campos não definidos no DTO
      stopAtFirstError: true, // Para no primeiro erro encontrado
      exceptionFactory: (rawErrors) => {
        console.dir(rawErrors, { depth: null });
        const errors = this.flattenErrors(rawErrors);
        return new BadRequestException({ ok: false, errors });
      },
    });
  }

  // ============================================
  // FORMATAR ERROS DE VALIDAÇÃO
  // ============================================
  private flattenErrors(errors: ValidationError[]): any[] {
    const result = [];

    for (const error of errors) {
      // Campo proibido (não está no DTO)
      if (error.constraints?.whitelistValidation !== undefined) {
        result.push({
          message: 'forbidden-field',
          userMessage: `Sua requisição tem um ou mais campos não permitidos (${error.property})`,
        });
        continue;
      }

      // Enum inválido
      if (error.constraints?.isEnum) {
        result.push({
          message: `invalid-${error.property}`,
          userMessage: `Valor do campo ${error.property} inválido`,
        });
        continue;
      }

      // Erros aninhados (objetos dentro de objetos)
      if (error.children && error.children.length > 0) {
        result.push(...this.flattenErrors(error.children));
        continue;
      }

      // Erros normais de validação
      if (error.constraints) {
        const constraintKeys = Object.keys(error.constraints);

        for (const key of constraintKeys) {
          const message = error.constraints[key];

          result.push({
            message: message,
            userMessage: message,
          });
        }
      }

      // Contexts (formato customizado)
      if (error.contexts) {
        const contextValues = Object.values(error.contexts);
        result.push(...contextValues);
      }
    }

    return result;
  }
}
