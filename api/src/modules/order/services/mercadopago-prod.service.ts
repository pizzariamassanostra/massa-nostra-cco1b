// ============================================
// SERVIÇO: MERCADO PAGO (PRODUÇÃO)
// ============================================
// Serviço responsável pela integração com o Mercado Pago em ambiente
// de produção, incluindo geração de QR Code PIX para pagamentos.
// ============================================

import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoProdService {
  private client: MercadoPagoConfig;
  private payment: Payment;
  private preference: Preference;

  constructor() {
    // Seleciona o token de acesso conforme o modo (prod ou sandbox)
    const accessToken =
      process.env.MP_MODE === 'prod'
        ? process.env.MP_ACCESS_TOKEN_PROD
        : process.env.MP_ACCESS_TOKEN;

    // Configuração do cliente Mercado Pago
    this.client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
      },
    });

    // Inicializa os serviços de pagamento e preferências
    this.payment = new Payment(this.client);
    this.preference = new Preference(this.client);
  }

  // Gera QR Code PIX para um pedido específico
  async generatePixQRCode(orderId: number, amount: number) {
    const body = {
      transaction_amount: amount,
      description: `Pedido #${orderId} - Pizzaria Massa Nostra`,
      payment_method_id: 'pix',
      payer: {
        email: 'cliente@pizzariamassanostra.com',
      },
    };

    // Cria o pagamento via Mercado Pago
    const payment = await this.payment.create({ body });

    // Retorna os dados necessários para o cliente efetuar o pagamento
    return {
      qr_code: payment.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        payment.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: payment.id,
    };
  }
}
