// ============================================
// INTERFACE: REQUEST PIX MERCADO PAGO
// ============================================
// Dados necessários para criar pagamento PIX
// ============================================

export interface MercadoPagoPixRequest {
  payment_id: string; // ID do pagamento no nosso sistema
  order_id: number; // ID do pedido
  user_id: string; // ID do cliente
  user_phone: string; // Telefone do cliente
  internal_payment_id: string; // UUID para idempotência
  transaction_amount: number; // Valor em centavos
  date_of_expiration: string; // Data de expiração ISO
}
