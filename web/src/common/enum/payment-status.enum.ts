// ============================================
// ENUM: STATUS DE PAGAMENTO
// ============================================

export enum PaymentStatus {
  PENDING = "pending", // Aguardando pagamento
  APPROVED = "approved", // Aprovado
  REJECTED = "rejected", // Rejeitado
  CANCELLED = "cancelled", // Cancelado
  REFUNDED = "refunded", // Reembolsado
}
