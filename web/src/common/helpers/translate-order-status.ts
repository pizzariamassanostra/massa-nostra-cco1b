// ============================================
// FUNÇÕES UTILITÁRIAS: STATUS DO PEDIDO
// ============================================

import { OrderStatus } from "../enum/order-status.enum";

// ============================================
// FUNÇÃO: translateOrderStatus
// ============================================
// Retorna a descrição em português do status do pedido
// ============================================
export function translateOrderStatus(status: OrderStatus): string {
  const translations: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Aguardando Confirmação", // Pedido criado, aguardando confirmação
    [OrderStatus.CONFIRMED]: "Confirmado", // Pedido confirmado
    [OrderStatus.PREPARING]: "Em Preparação", // Pedido em preparo
    [OrderStatus.ON_DELIVERY]: "Saiu para Entrega", // Pedido saiu para entrega
    [OrderStatus.DELIVERED]: "Entregue", // Pedido entregue
    [OrderStatus.CANCELLED]: "Cancelado", // Pedido cancelado
  };

  // Retorna a tradução correspondente ou o próprio status como fallback
  return translations[status] || status;
}

// ============================================
// FUNÇÃO: getOrderStatusColor
// ============================================
// Retorna classes CSS de cor conforme o status do pedido
// ============================================
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800", // Em espera
    [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800", // Confirmado
    [OrderStatus.PREPARING]: "bg-purple-100 text-purple-800", // Em preparação
    [OrderStatus.ON_DELIVERY]: "bg-orange-100 text-orange-800", // Em entrega
    [OrderStatus.DELIVERED]: "bg-green-100 text-green-800", // Entregue
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-800", // Cancelado
  };

  // Retorna a cor correspondente ou uma cor padrão
  return colors[status] || "bg-gray-100 text-gray-800";
}
