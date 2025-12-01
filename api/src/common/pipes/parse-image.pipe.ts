// ============================================
// PIPE: VALIDAÇÃO DE IMAGENS
// ============================================
// Valida tamanho e tipo de arquivo de imagens
// Limite: 10MB | Formatos: jpg, jpeg, png, gif
// ============================================

import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

const ParseImagesPipe = new ParseFilePipe({
  validators: [
    // Tamanho máximo: 10MB
    new MaxFileSizeValidator({
      maxSize: 1000 * 1000 * 10,
      message: 'file-exceeded-10mb-limit',
    }),

    // Formatos aceitos
    new FileTypeValidator({
      fileType: /(jpg|jpeg|png|gif)$/,
    }),
  ],
});

export default ParseImagesPipe;
