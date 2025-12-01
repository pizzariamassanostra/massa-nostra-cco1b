// ============================================
// DTO: GERAR PAGAMENTO
// ============================================
// Dados necessários para criar um pagamento de pedido
// ============================================

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GeneratePaymentDto {
  // ============================================
  // ID DO PEDIDO
  // ============================================
  @IsNotEmpty({
    context: {
      userMessage: 'missing-order-id',
      message: 'ID do pedido não informado',
    },
  })
  @IsNumber(
    {},
    {
      context: {
        userMessage: 'invalid-order-id',
        message: 'ID do pedido inválido',
      },
    },
  )
  order_id: number;

  // ============================================
  // VALOR DO PAGAMENTO
  // ============================================
  @IsNotEmpty({
    context: {
      userMessage: 'missing-amount',
      message: 'Valor não informado',
    },
  })
  @IsNumber(
    {},
    {
      context: {
        userMessage: 'invalid-amount',
        message: 'Valor inválido',
      },
    },
  )
  amount: number;

  // ============================================
  // MÉTODO DE PAGAMENTO
  // ============================================
  // pix, dinheiro, cartao_debito, cartao_credito
  @IsNotEmpty({
    context: {
      userMessage: 'missing-payment-method',
      message: 'Método de pagamento não informado',
    },
  })
  @IsString({
    context: {
      userMessage: 'invalid-payment-method',
      message: 'Método de pagamento inválido',
    },
  })
  payment_method: string;
}
