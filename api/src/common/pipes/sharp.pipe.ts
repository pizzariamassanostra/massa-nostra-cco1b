// ============================================
// PIPE: PROCESSAMENTO DE IMAGENS
// ============================================
// Converte imagens recebidas para formato WebP otimizado,
// gerando novo nome de arquivo único e buffer processado.
// ============================================

import { Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';

// Interface para representar imagem processada
export interface ProcessedImage {
  filename: string;
  buffer: Buffer;
}

@Injectable()
export class SharpPipe implements PipeTransform<
  Express.Multer.File[] | Express.Multer.File,
  Promise<ProcessedImage[]>
> {
  async transform(
    images: Express.Multer.File[] | Express.Multer.File,
  ): Promise<ProcessedImage[] | Express.Multer.File[]> {
    const files = [] as ProcessedImage[];

    // Normaliza para array
    if (!Array.isArray(images)) images = [images];

    // Se algum arquivo não for imagem, retorna original
    if (images.some((image) => !image.mimetype.includes('image')))
      return images as Express.Multer.File[];

    // Processa cada imagem
    for (const image of images) {
      const filename = uuid().toString() + '.webp';

      const processedBuffer = await sharp(image.buffer)
        .clone()
        .webp() // conversão para WebP otimizado
        .toBuffer();

      files.push({ filename, buffer: processedBuffer });
    }

    return files;
  }
}
