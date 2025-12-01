// ============================================
// API: MERCADO PAGO
// ============================================
// Integração com Mercado Pago para pagamentos PIX
// ============================================
import axios from 'axios';
import { MercadoPagoPixRequest } from './interfaces/pix-request.interface';
import { MercadoPagoPixResponse } from './interfaces/pix-response.interface';

// Cria instância do Axios com configurações da API Mercado Pago
// Inclui token de autenticação em todas as requisições
const MercadoPagoApi = axios.create({
  // URL base da API Mercado Pago
  baseURL: 'https://api.mercadopago.com',

  // Headers padrão incluindo token de acesso do .env
  headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
});

// Cria pagamento PIX através da API Mercado Pago
// Retorna dados necessários para gerar QR code e cobrar do cliente
const createPixPayment = async (
  pixPaymentData: MercadoPagoPixRequest,
): Promise<MercadoPagoPixResponse> => {
  const { payment_id, order_id, user_id, user_phone, transaction_amount } =
    pixPaymentData;

  // Faz requisição POST para criar pagamento PIX
  const { data } = await MercadoPagoApi.post(
    '/v1/payments',
    {
      // Valor da transação em reais
      transaction_amount: transaction_amount,

      // Método de pagamento (PIX)
      payment_method_id: 'pix',

      // Dados do pagador (usar email do sistema)
      payer: {
        email: process.env.LOG_EMAIL,
      },

      // Data de expiração do PIX
      date_of_expiration: pixPaymentData.date_of_expiration,

      // URL para receber notificações de webhook
      notification_url: `${process.env.MERCADOPAGO_WEBHOOK_URL}/webhook/mercadopago`,

      // Descrição do pedido com informações do cliente
      description: `Pedido #${order_id} - Cliente ID: ${user_id} - Tel: ${user_phone} - Payment: ${payment_id}`,
    },
    {
      // Header para garantir idempotência (requisições duplicadas não criam pagamentos duplicados)
      headers: { 'X-Idempotency-Key': pixPaymentData.internal_payment_id },
    },
  );

  return data as MercadoPagoPixResponse;
};

// Exporta a instância da API e a função de criação de PIX
export { MercadoPagoApi, createPixPayment };
