// ============================================
// ENUM: STATUS DOS PEDIDOS
// ============================================

export enum OrderStatus {
  PENDING = "pending", // Aguardando confirmação
  CONFIRMED = "confirmed", // Confirmado
  PREPARING = "preparing", // Em preparação
  ON_DELIVERY = "on_delivery", // Saiu para entrega
  DELIVERED = "delivered", // Entregue
  CANCELLED = "cancelled", // Cancelado
}
