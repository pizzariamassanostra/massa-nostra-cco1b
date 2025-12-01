/**
 * ============================================
 * MÓDULO: PAGAMENTOS
 * ============================================
 * Gerencia pagamentos via Mercado Pago
 * Inclui webhook e notificações
 *
 * Exporta PaymentRepository
 * Exporta ValidateWebhookService
 * ============================================
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ============================================
// ENTITIES
// ============================================
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';

// ============================================
// MODULES
// ============================================
import { CommonUserModule } from '../common-user/common-user.module';
import { ReceiptModule } from '../receipt/receipt.module'; // Gerar comprovantes
import { NotificationModule } from '../notification/notification.module'; // Para enviar e-mails

// ============================================
// CONTROLLERS
// ============================================
import { PaymentController } from './controllers/payment.controller';

// ============================================
// REPOSITORIES
// ============================================
import { PaymentRepository } from './repositories/payment.repository';

// ============================================
// SERVICES
// ============================================
import { QueryPaymentService } from './services/find-one-payment.service';
import { ValidateWebhookService } from './services/validate-payment-webhook.service';

@Module({
  // ============================================
  // CONTROLLERS
  // ============================================
  // Endpoints expostos pelo módulo
  controllers: [
    PaymentController, // Endpoints de consulta e geração de PIX
  ],

  // ============================================
  // IMPORTS
  // ============================================
  // Módulos e entidades necessárias
  imports: [
    // Registrar entidades no TypeORM
    TypeOrmModule.forFeature([Payment, Order]),

    // Módulos externos
    CommonUserModule, // Para acessar dados de usuários
    ReceiptModule, // Para gerar comprovantes
    NotificationModule, // Para enviar e-mails e WebSocket
  ],

  // ============================================
  // PROVIDERS
  // ============================================
  // Serviços e repositórios disponíveis dentro do módulo
  providers: [
    QueryPaymentService, // Serviço de consulta de pagamentos
    PaymentRepository, // Repositório customizado
    ValidateWebhookService, // Validação de assinatura do webhook
  ],

  // ============================================
  // EXPORTS
  // ============================================
  // Torna serviços e repositórios disponíveis para OUTROS módulos
  // Isso permite que WebhookController (em OrderModule) possa usar
  // PaymentRepository e ValidateWebhookService
  exports: [
    QueryPaymentService, // Permite outros módulos consultarem pagamentos
    PaymentRepository, // Exporta repositório para WebhookController
    ValidateWebhookService, // Exporta serviço de validação para WebhookController
    // Também precisa exportar módulos que WebhookController depende
    TypeOrmModule, // Para que OrderModule possa acessar Payment
  ],
})
export class PaymentModule {}
