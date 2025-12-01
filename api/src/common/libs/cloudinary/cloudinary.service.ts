// ============================================
// SERVIÇO: CLOUDINARY
// ============================================
// Upload de imagens e PDFs para Cloudinary
// Usado para imagens de produtos, categorias e comprovantes PDF
// ============================================

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // ============================================
  // UPLOAD DE IMAGEM
  // ============================================
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'pizzaria-massa-nostra' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  }

  // ============================================
  // UPLOAD DE PDF
  // ============================================
  async uploadPdf(
    buffer: Buffer,
    filename: string,
  ): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'pizzaria-massa-nostra',
            resource_type: 'raw',
            public_id: `receipts/${filename}`,
            format: 'pdf',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({ secure_url: result.secure_url });
          },
        )
        .end(buffer);
    });
  }
}
