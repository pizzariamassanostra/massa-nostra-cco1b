/**
 * ============================================
 * MÓDULO: PEDIDOS E ENDEREÇOS (COMPLETO)
 * ============================================
 * Gestão de pedidos
 * Inclui integração com comprovantes PDF
 * Inclui webhook do Mercado Pago
 * WebSocket em tempo real
 *
 * Importar PaymentModule
 * Importar NotificationModule
 * mportar NotificationGateway
 * ============================================
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ============================================
// ENTIDADES
// ============================================
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Address } from './entities/address.entity';
import { OrderReview } from './entities/review.entity';

// ============================================
// ENTIDADES DE PRODUTOS (RELACIONAMENTO)
// ============================================
import { ProductVariant } from '../product/entities/product-variant.entity';
import { PizzaCrust } from '../product/entities/pizza-crust.entity';
import { CrustFilling } from '../product/entities/crust-filling.entity';

// ============================================
// CONTROLLERS
// ============================================
import { OrderController } from './controllers/order.controller';
import { WebhookController } from './controllers/webhook.controller';
import { ReviewController } from './controllers/review.controller';

// ============================================
// SERVIÇOS
// ============================================
import { OrderService } from './services/order.service';
import { AddressService } from './services/address.service';
import { MercadoPagoService } from './services/mercadopago.service';
import { ReviewService } from './services/review.service';

// ============================================
// MÓDULOS EXTERNOS
// ============================================
import { ReceiptModule } from '../receipt/receipt.module'; // Comprovantes
import { PaymentModule } from '../payment/payment.module'; // Pagamentos
import { NotificationModule } from '../notification/notification.module'; // Notificações e WebSocket

// ============================================
// GATEWAY WEBSOCKET
// ============================================
import { NotificationGateway } from '../notification/notification.gateway'; // WebSocket em tempo real

@Module({
  // ============================================
  // IMPORTS (IMPORTAÇÕES)
  // ============================================
  imports: [
    // ============================================
    // ENTIDADES (Registrar no TypeORM)
    // ============================================
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderStatusHistory,
      OrderReview,
      Address,
      ProductVariant,
      PizzaCrust,
      CrustFilling,
    ]),

    // ============================================
    // MÓDULOS EXTERNOS
    // ============================================
    // Permite usar ReceiptService em OrderService
    ReceiptModule,

    // Expõe PaymentRepository para WebhookController
    PaymentModule,

    // Expõe NotificationService e NotificationGateway
    NotificationModule,
  ],

  // ============================================
  // CONTROLLERS (ROTAS)
  // ============================================
  controllers: [
    OrderController, // Rotas de pedidos
    ReviewController, // Rotas de avaliações
    WebhookController, // Webhook MercadoPago (agora com WebSocket)
  ],

  // ============================================
  // PROVIDERS (SERVIÇOS E GATEWAYS)
  // ============================================
  providers: [
    OrderService, // Lógica de pedidos
    ReviewService, // Lógica de avaliações
    AddressService, // Lógica de endereços
    MercadoPagoService, // Integração pagamentos

    // Injetar NotificationGateway aqui
    // Assim fica disponível para WebhookController injetar
    NotificationGateway,
  ],

  // ============================================
  // EXPORTS (EXPORTAÇÕES)
  // ============================================
  exports: [
    OrderService, // Permite outros módulos usarem
    AddressService,
    MercadoPagoService,
    NotificationGateway, // Exportar gateway para outros módulos
  ],
})
export class OrderModule {}
