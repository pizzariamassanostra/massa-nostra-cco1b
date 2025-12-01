// ============================================
// ENUM: TIPO DE ALERTA DE ESTOQUE
// ============================================
// Define alertas automáticos baseados
// em regras de estoque
// ============================================

export enum AlertType {
  LOW_STOCK = 'low_stock', // Estoque abaixo do mínimo
  EXPIRED = 'expired', // Produto vencido
  NEAR_EXPIRY = 'near_expiry', // Próximo ao vencimento (7 dias)
  OVERSTOCK = 'overstock', // Estoque acima do máximo
  OUT_OF_STOCK = 'out_of_stock', // Estoque zerado
}
