// ============================================
// CONTROLLER: UPLOAD DE IMAGENS
// ============================================

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CloudinaryService } from '../../../common/libs/cloudinary/cloudinary.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // ============================================
  // UPLOAD DE IMAGEM DO PRODUTO
  // ============================================
  @Post('product-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Validar tipo de arquivo
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Apenas imagens JPG, PNG ou WebP são permitidas',
      );
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('Imagem muito grande. Máximo 5MB');
    }

    // Upload para Cloudinary
    const imageUrl = await this.cloudinaryService.uploadImage(file);

    return {
      ok: true,
      message: 'Imagem enviada com sucesso',
      imageUrl,
    };
  }
}
