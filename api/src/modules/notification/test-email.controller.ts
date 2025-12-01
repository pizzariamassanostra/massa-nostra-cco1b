// ============================================
// CONTROLLER: TEST EMAIL
// ============================================
// Responsável por testar o envio de e-mails e notificações,
// incluindo boas-vindas, status de pedido e novos pedidos.
// ============================================

import { Controller, Post, Body, Get } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmailService } from './services/email.service';
import { NotificationService } from './services/notification.service';

// DTO para teste de envio de e-mail
class TestEmailDto {
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsOptional()
  @IsString()
  customerName?: string;
}

@Controller('test-email')
export class TestEmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  // Envia e-mail de boas-vindas
  @Post('welcome')
  async testWelcomeEmail(@Body() data: TestEmailDto) {
    console.log('Dados recebidos:', data);
    console.log('E-mail:', data.email);

    const result = await this.emailService.sendWelcomeEmail(
      data.email,
      data.customerName || 'Cliente Teste',
    );

    return {
      ok: result,
      message: result
        ? 'E-mail de boas-vindas enviado com sucesso!'
        : 'Falha ao enviar e-mail',
      sentTo: data.email,
    };
  }

  // Envia e-mail de atualização de status de pedido
  @Post('order-status')
  async testOrderStatusEmail(@Body() data: TestEmailDto) {
    const result = await this.emailService.sendOrderStatusEmail(
      data.email,
      'ORD-20251126-TEST',
      'confirmed',
    );

    return {
      ok: result,
      message: result
        ? 'E-mail de status enviado com sucesso!'
        : 'Falha ao enviar e-mail',
      sentTo: data.email,
    };
  }

  // Envia notificação de novo pedido
  @Post('new-order')
  async testNewOrderNotification() {
    const result = await this.notificationService.notifyNewOrder(
      'ORD-20251126-TEST',
      'João Silva Teste',
      95.5,
    );

    return {
      ok: result,
      message: result
        ? 'Notificação de novo pedido enviada!'
        : 'Falha ao enviar notificação',
      sentTo: process.env.LOG_EMAIL || 'pizzariamassanostra@gmail.com',
    };
  }

  // Verifica configuração de envio de e-mails
  @Get('config')
  async checkConfig() {
    return {
      sendgrid: {
        configured: !!process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL,
        fromName: process.env.SENDGRID_FROM_NAME,
      },
      logEmail: process.env.LOG_EMAIL,
    };
  }
}
