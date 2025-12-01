// ============================================
// MODULO: COMPROVANTES
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ENTIDADES
import { Receipt } from './entities/receipt.entity';
import { Order } from '../order/entities/order.entity';

// REPOSITORY + SERVICES
import { ReceiptRepository } from './repositories/receipt.repository';
import { ReceiptService } from './services/receipt.service';
import { PdfGeneratorService } from './services/pdf-generator.service';

// CONTROLLER
import { ReceiptController } from './controllers/receipt.controller';

// CLOUDINARY (upload)
import { CloudinaryService } from '../../common/libs/cloudinary/cloudinary.service';

// Módulo de notificações para envio de emails
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    // Registra entidades
    TypeOrmModule.forFeature([Receipt, Order]),

    // Importa módulo de notificações (EmailService)
    NotificationModule,
  ],

  controllers: [ReceiptController],

  providers: [
    ReceiptRepository,
    ReceiptService,
    PdfGeneratorService,
    CloudinaryService,
  ],

  exports: [ReceiptService],
})
export class ReceiptModule {}
