// ============================================
// ENUM: MÉTODOS DE PAGAMENTO
// ============================================
// Define todas as formas de pagamento aceitas
// Sincronizado com a API NestJS
// ============================================

export enum PaymentMethod {
  PIX = "pix",
  DINHEIRO = "dinheiro",
  CARTAO_DEBITO = "cartao_debito",
  CARTAO_CREDITO = "cartao_credito",
}
