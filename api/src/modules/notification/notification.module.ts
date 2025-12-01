// ===========================================
// NOTIFICATION MODULO
// Módulo de notificações (E-mail, SMS, Push, WebSocket)
// ===========================================

import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { NotificationService } from './services/notification.service';
import { NotificationGateway } from './notification.gateway';
import { TestEmailController } from './test-email.controller';

@Module({
  controllers: [TestEmailController],
  providers: [EmailService, NotificationService, NotificationGateway],
  exports: [EmailService, NotificationService, NotificationGateway],
})
export class NotificationModule {}
