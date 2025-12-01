// ============================================
// ENUM: FORMAS DE PAGAMENTO (FORNECEDOR)
// ============================================

export enum SupplierPaymentMethod {
  PIX = 'pix',
  CASH = 'dinheiro',
  DEBIT_CARD = 'cartao_debito',
  CREDIT_CARD = 'cartao_credito',
  BANK_SLIP = 'boleto',
  BANK_TRANSFER = 'transferencia',
  CHECK = 'cheque',
}
