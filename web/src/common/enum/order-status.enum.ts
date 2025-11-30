// ============================================
// ENUM: STATUS DOS PEDIDOS
// ============================================
// Define todos os status possíveis de um pedido
// Sincronizado com a API NestJS
// ============================================

export enum OrderStatus {
  PENDING = "pending", // Aguardando confirmação
  CONFIRMED = "confirmed", // Confirmado
  PREPARING = "preparing", // Em preparação
  ON_DELIVERY = "on_delivery", // Saiu para entrega
  DELIVERED = "delivered", // Entregue
  CANCELLED = "cancelled", // Cancelado
}
