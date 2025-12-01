// ============================================
// SERVIÇO: NOTIFICATION (TIPOS E INTERFACE)
// ============================================
// Define os tipos de notificação suportados e a interface genérica
// para envio de notificações (e-mail, SMS, push).
// ============================================

import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationGateway } from '../notification.gateway';

// Tipos de notificação suportados
export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

// Interface com dados genéricos de notificação
export interface NotificationData {
  // Tipo da notificação (email, sms, push)
  type: NotificationType;

  // Destinatário (ex.: endereço de e-mail, número de telefone, ID de dispositivo)
  recipient: string;

  // Assunto da notificação (aplicável para e-mail)
  subject?: string;

  // Mensagem principal da notificação
  message: string;

  // Dados adicionais (payload extra para customização)
  data?: any;
}

// Serviço central de gerenciamento de notificações
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly gateway: NotificationGateway,
  ) {
    this.logger.log('NotificationService inicializado');
  }

  // Roteia notificações para o canal apropriado (e-mail, SMS, push)
  async send(notificationData: NotificationData): Promise<boolean> {
    try {
      this.logger.log(
        `Enviando notificação ${notificationData.type} para ${notificationData.recipient}`,
      );

      switch (notificationData.type) {
        case NotificationType.EMAIL:
          return await this.sendEmail(notificationData);

        case NotificationType.SMS:
          return await this.sendSMS(notificationData);

        case NotificationType.PUSH:
          return await this.sendPush(notificationData);

        default:
          this.logger.warn(
            `Tipo de notificação desconhecido: ${notificationData.type}`,
          );
          return false;
      }
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação:`, error);
      return false;
    }
  }

  // Envia notificação por e-mail
  private async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      return await this.emailService.sendEmail({
        to: data.recipient,
        subject: data.subject || 'Notificação - Pizzaria Massa Nostra',
        html: data.message,
      });
    } catch (error) {
      this.logger.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }

  // Envia notificação por SMS (TODO: implementar Twilio)
  private async sendSMS(data: NotificationData): Promise<boolean> {
    this.logger.warn('Envio de SMS ainda não implementado');
    this.logger.debug(
      `SMS seria enviado para: ${data.recipient} - Mensagem: ${data.message}`,
    );
    return false;
  }

  // Envia notificação por Push
  private async sendPush(data: NotificationData): Promise<boolean> {
    this.logger.warn('Push notification ainda não implementado');
    this.logger.debug(
      `Push seria enviado para: ${data.recipient} - Mensagem: ${data.message}`,
    );
    return false;
  }

  // Notifica administradores sobre novo pedido
  async notifyNewOrder(
    orderNumber: string,
    customerName: string,
    total: number,
  ): Promise<boolean> {
    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #d32f2f;">Novo Pedido Recebido! </h2>
        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Número do Pedido:</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              #${orderNumber}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Cliente:</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              ${customerName}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Valor Total:</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              R$ ${total.toFixed(2)}
            </td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #666;">
          Acesse o painel administrativo para processar o pedido. 
        </p>
      </div>
    `;

    const adminEmail = process.env.LOG_EMAIL || 'pizzariamassanostra@gmail.com';

    return await this.send({
      type: NotificationType.EMAIL,
      recipient: adminEmail,
      subject: `Novo Pedido #${orderNumber} - R$ ${total.toFixed(2)}`,
      message,
    });
  }

  // Notifica cliente sobre mudança de status do pedido
  async notifyOrderStatus(
    email: string,
    orderNumber: string,
    status: string,
  ): Promise<boolean> {
    if (!email || email.trim() === '') {
      this.logger.warn(
        `Cliente sem e-mail cadastrado - Pedido #${orderNumber}`,
      );
      return false;
    }

    return await this.emailService.sendOrderStatusEmail(
      email,
      orderNumber,
      status,
    );
  }

  // Envia e-mail de boas-vindas para novo cliente
  async sendWelcomeEmail(
    email: string,
    customerName: string,
  ): Promise<boolean> {
    if (!email) {
      return false;
    }

    return await this.emailService.sendWelcomeEmail(email, customerName);
  }

  // Notifica via Socket.io mudança de status do pedido
  notifyOrderStatusChanged(
    orderId: number,
    status: string,
    orderNumber: string,
  ) {
    if (!this.gateway) {
      this.logger.warn('Gateway não configurado para emitir eventos');
      return;
    }

    this.gateway.server.emit('orderStatusChanged', {
      orderId,
      status,
      orderNumber,
      timestamp: new Date(),
    });
  }

  // ========================================================
  // ✔ ADICIONADO: Envio de e-mail de confirmação de pedido
  // ========================================================
  async sendOrderConfirmationEmail(
    email: string,
    orderNumber: string,
    total: number,
  ): Promise<boolean> {
    if (!email) {
      this.logger.warn(
        `Cliente sem e-mail para confirmação - Pedido #${orderNumber}`,
      );
      return false;
    }

    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #388e3c;">Pedido Confirmado!</h2>
        <p>Seu pedido <strong>#${orderNumber}</strong> foi confirmado com sucesso.</p>
        <p><strong>Valor Total:</strong> R$ ${total.toFixed(2)}</p>
        <p>Acompanhe o status pelo aplicativo.</p>
      </div>
    `;

    return await this.emailService.sendEmail({
      to: email,
      subject: `Seu pedido #${orderNumber} foi confirmado!`,
      html: message,
    });
  }
}
