// ============================================
// SERVIÇO: MERCADO PAGO PIX (SDK V2.0+)
// ============================================

import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private payment: Payment;

  constructor() {
    // Configurar credenciais (usar .env)
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
      options: {
        timeout: 5000,
      },
    });

    this.payment = new Payment(this.client);
  }

  // ============================================
  // CRIAR PAGAMENTO PIX
  // ============================================
  async createPixPayment(
    orderId: number,
    amount: number,
    customerEmail: string,
  ) {
    try {
      const paymentData = {
        transaction_amount: amount / 100, // Converter centavos para reais
        description: `Pedido #${orderId} - Pizzaria Massa Nostra`,
        payment_method_id: 'pix',
        payer: {
          email: customerEmail,
        },
      };

      const response = await this.payment.create({ body: paymentData });

      return {
        payment_id: response.id,
        status: response.status,
        qr_code: response.point_of_interaction?.transaction_data?.qr_code || '',
        qr_code_base64:
          response.point_of_interaction?.transaction_data?.qr_code_base64 || '',
        ticket_url:
          response.point_of_interaction?.transaction_data?.ticket_url || '',
        expiration_date: response.date_of_expiration,
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw new Error('Falha ao gerar QR Code PIX');
    }
  }

  // ============================================
  // VERIFICAR STATUS DO PAGAMENTO
  // ============================================
  async getPaymentStatus(paymentId: number) {
    try {
      const response = await this.payment.get({ id: paymentId });
      return {
        id: response.id,
        status: response.status, // approved, pending, rejected, cancelled
        status_detail: response.status_detail,
        transaction_amount: response.transaction_amount,
        date_approved: response.date_approved,
      };
    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error);
      throw new Error('Falha ao consultar pagamento');
    }
  }
}
