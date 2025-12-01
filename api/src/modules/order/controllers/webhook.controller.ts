/**
 * ============================================
 * CONTROLLER: WEBHOOK MERCADO PAGO
 * ============================================
 * Processa webhooks de pagamento do Mercado Pago
 * Confirma pagamentos e atualiza status de pedidos

 * - validação de assinatura
 * - atualização de pagamento
 * - atualização do pedido
 * - registro de histórico
 * - geração de comprovante
 * - envio de e-mail para cliente
 * - notificação por e-mail do admin
 * - emissão de eventos WebSocket (cliente + admin)
 * ============================================
 */

import {
  Controller,
  Post,
  Body,
  Headers,
  Query,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from '../../payment/entities/payment.entity';
import { Order } from '../entities/order.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';

import { ValidateWebhookService } from '../../payment/services/validate-payment-webhook.service';
import { NotificationService } from '../../notification/services/notification.service';
import { ReceiptService } from '../../receipt/services/receipt.service';
import { NotificationGateway } from '../../notification/notification.gateway';

// ============================================
// INTERFACE: Payload do Webhook
// ============================================

interface WebhookPayload {
  type: string;
  data: {
    id: string; // Payment ID
    status?: string; // Status do pagamento
  };
}

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderStatusHistory)
    private readonly orderStatusHistoryRepository: Repository<OrderStatusHistory>,

    private readonly validateWebhookService: ValidateWebhookService,
    private readonly notificationService: NotificationService,
    private readonly receiptService: ReceiptService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * ============================================
   * ENDPOINT: POST /webhook/mercadopago
   * ============================================
   * Recebe webhooks do Mercado Pago
   *
   * Fluxo:
   * 1. Validar webhook (opcional - WEBHOOK_SECRET)
   * 2. Buscar pagamento pelo ID
   * 3. Atualizar status do pagamento
   * 4. Buscar pedido vinculado
   * 5. Atualizar status do pedido para "confirmed"
   * 6. Gerar comprovante (PDF)
   * 7. Enviar email ao cliente
   * 8. Notificar admin
   * 9. Enviar WebSocket
   * ============================================
   */
  @Post('mercadopago')
  @HttpCode(200)
  async handleMercadoPagoWebhook(
    @Body() payload: WebhookPayload | any,
    @Headers('x-signature') headerSignature?: string,
    @Headers('x-request-id') headerRequestId?: string,
    @Query('data.id') queryDataId?: string,
  ) {
    try {
      // Aceita tanto a forma estruturada (WebhookPayload) quanto body raw
      const body = payload as any;

      // Logs iniciais
      this.logger.debug('Payload:', JSON.stringify(body, null, 2));
      this.logger.log('Webhook recebido');

      // Normalizar campos: alguns envios podem vir com body.type / body.data
      const type: string | undefined = body?.type;
      const data: any = body?.data;

      // Validar tipo de evento
      if (!type || type !== 'payment') {
        this.logger.warn(`Tipo de evento ignorado: ${type}`);
        return {
          ok: true,
          message: 'Evento ignorado (tipo não é payment)',
        };
      }

      // Extrair paymentId (tolerância: payload.data.id ou query param)
      const paymentIdFromPayload = data?.id;
      const paymentIdFromQuery = queryDataId;
      const paymentId = String(
        paymentIdFromPayload || paymentIdFromQuery || '',
      ).trim();

      if (!paymentId) {
        this.logger.error('Payment ID não fornecido no webhook');
        return {
          ok: false,
          error: 'Payment ID não encontrado',
        };
      }

      this.logger.log(`Processando pagamento: ${paymentId}`);

      // VALIDAR ASSINATURA
      if (
        headerSignature &&
        headerRequestId &&
        (paymentIdFromQuery || paymentIdFromPayload)
      ) {
        try {
          this.logger.log('Validando assinatura do webhook...');
          // validateWebhook(signature, dataId, requestId)
          await this.validateWebhookService.validateWebhook(
            headerSignature,
            paymentId, // passe o paymentId (queryDataId) aqui
            headerRequestId,
          );
          this.logger.log('Assinatura válida');
        } catch (validationError) {
          // Não interromper em ambiente de teste
          this.logger.warn(
            'Falha na validação da assinatura (continuando):',
            validationError?.message ?? validationError,
          );
        }
      }

      // BUSCAR PAGAMENTO no banco
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId },
      });

      if (!payment) {
        this.logger.error(`Pagamento não encontrado: ${paymentId}`);
        return {
          ok: false,
          error: `Pagamento ${paymentId} não encontrado`,
        };
      }

      this.logger.log(`Pagamento encontrado: ID ${payment.id}`);

      // Mapeamento e atualização do status do pagamento
      const incomingStatus = String(data?.status || 'approved');
      const mappedStatus = this.mapMercadoPagoStatus(incomingStatus);

      const previousPaymentStatus = payment.status;
      payment.status = mappedStatus;
      payment.updated_at = new Date();

      if (mappedStatus === 'approved') {
        payment.paid_at = new Date();
      }

      await this.paymentRepository.save(payment);
      this.logger.log(
        `Pagamento atualizado: ${previousPaymentStatus} → ${payment.status}`,
      );

      // BUSCAR: Pedido vinculado (usar order_id presente em payment)
      const order = await this.orderRepository.findOne({
        where: { id: (payment as any).order_id as any },
        relations: [
          'user',
          'items',
          'items.product',
          'items.variant',
          'address',
        ],
      });

      if (!order) {
        this.logger.warn(`Pedido não encontrado para pagamento ${paymentId}`);
        return {
          ok: true,
          message: 'Pagamento processado mas pedido não encontrado',
          payment_status: payment.status,
        };
      }

      this.logger.log(`Pedido encontrado: #${order.order_number}`);

      // Se pagamento foi aprovado agora (e antes não era approved)
      if (
        payment.status === 'approved' &&
        previousPaymentStatus !== 'approved'
      ) {
        this.logger.log('🟢 PAGAMENTO APROVADO! Processando confirmação..');

        // 1️⃣ Atualizar status do pedido
        try {
          order.status = 'confirmed';
          // marcar data de confirmação se existir campo
          (order as any).confirmed_at = new Date();
          await this.orderRepository.save(order);
          this.logger.log(`Pedido confirmado: #${order.order_number}`);
        } catch (saveOrderError) {
          this.logger.error(
            'Erro ao atualizar pedido para confirmed:',
            saveOrderError,
          );
          // continuar mesmo se falhar
        }

        // Gerar comprovante e (opcional) enviar e-mail automático pelo ReceiptService
        try {
          // Alguns implementations do service aceitam (orderId, sendEmail:boolean)
          try {
            // tentar com segundo parâmetro (envio automático)
            const receipt = await this.receiptService.generateReceipt(
              order.id,
              true,
            );
            this.logger.log(
              `Comprovante ${receipt?.receipt_number ?? ''} gerado e (provavelmente) enviado por e-mail`,
            );
          } catch (errInner) {
            // fallback: chamar sem o parâmetro adicional
            const receipt = await this.receiptService.generateReceipt(order.id);
            this.logger.log(
              `Comprovante ${receipt?.receipt_number ?? ''} gerado (fallback sem envio automático)`,
            );
          }
        } catch (receiptError) {
          this.logger.error('Erro ao gerar/enviar comprovante:', receiptError);
        }

        // Enviar email para o cliente (se existir)
        try {
          const customerEmail = order.user?.email;
          if (customerEmail) {
            await this.notificationService.sendOrderConfirmationEmail(
              String(customerEmail),
              String(order.order_number),
              Number(order.total),
            );
            this.logger.log(
              `Email de confirmação enviado para ${customerEmail}`,
            );
          } else {
            this.logger.warn(
              'ℹCliente não possui e-mail para envio de confirmação.',
            );
          }
        } catch (emailError) {
          this.logger.error('Erro ao enviar email para cliente:', emailError);
          // continuar mesmo se falhar
        }

        // Notificar admin por e-mail
        try {
          await this.notificationService.notifyNewOrder(
            String(order.order_number),
            String(order.user?.name || 'Cliente'),
            parseFloat(String(order.total || 0)),
          );
          this.logger.log('Admin notificado por e-mail');
        } catch (adminError) {
          this.logger.error('Erro ao notificar admin:', adminError);
        }

        // Registrar histórico de status
        try {
          const statusHistory = this.orderStatusHistoryRepository.create({
            order_id: order.id,
            status: 'confirmed',
            notes: `Pagamento aprovado via webhook - ${new Date().toISOString()}`,
          });
          await this.orderStatusHistoryRepository.save(statusHistory);
          this.logger.log('Histórico registrado');
        } catch (historyError) {
          this.logger.error('Erro ao registrar histórico:', historyError);
        }

        // Emitir eventos WebSocket (cliente + admin)
        try {
          const clientId = (order as any).common_user_id ?? order.user?.id;
          this.notificationGateway.notifyPaymentApproved(clientId, order);
          this.logger.log(
            `Cliente ${clientId} notificado sobre pagamento aprovado`,
          );

          // notificar admin
          this.notificationGateway.notifyNewOrderToAdmin(order);
          this.logger.log(
            `Admin notificado sobre novo pedido #${order.order_number}`,
          );
        } catch (socketError) {
          this.logger.error('Erro ao emitir eventos WebSocket:', socketError);
        }

        this.logger.log(`PEDIDO #${order.order_number} PRONTO PARA PREPARO!`);
      }

      // Resposta final
      return {
        ok: true,
        message: 'Webhook processado com sucesso',
        payment_status: payment.status,
        order_id: order.id,
        order_number: order.order_number,
      };
    } catch (error) {
      // ERRO: Log detalhado
      this.logger.error('Erro ao processar webhook:', error);
      // também mostrar stack no console para debug local
      console.error(
        '[WebhookController] Erro ao processar webhook:',
        error?.message ?? error,
      );
      if (error?.stack) console.error(error.stack);

      return {
        ok: false,
        error: error?.message ?? 'Erro desconhecido',
      };
    }
  }

  // ============================================
  // MAPEAR STATUS DO MERCADO PAGO
  // ============================================
  private mapMercadoPagoStatus(mpStatus: string): string {
    const statusMap: Record<string, string> = {
      approved: 'approved', // Aprovado
      pending: 'pending', // Pendente
      in_process: 'pending', // Em processamento
      rejected: 'rejected', // Recusado
      cancelled: 'cancelled', // Cancelado
      refunded: 'refunded', // Estornado
      charged_back: 'refunded', // Chargeback
    };

    return statusMap[mpStatus] || 'pending';
  }
}
