// ============================================
// FUNÇÕES: TRADUÇÃO DE STATUS DO PEDIDO
// ============================================
// Fornece utilitários para:
// - Traduzir status de pedido (enum) para texto em português.
// - Definir classes de cor (Tailwind) para badges de status.
// ============================================

import { OrderStatus } from "../enum/order-status.enum";

// Retorna o texto em português correspondente ao status do pedido
export function translateOrderStatus(status: OrderStatus): string {
  const translations: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Aguardando Confirmação", // Pedido criado, aguardando confirmação
    [OrderStatus.CONFIRMED]: "Confirmado", // Pedido confirmado
    [OrderStatus.PREPARING]: "Em Preparação", // Pedido em preparo
    [OrderStatus.ON_DELIVERY]: "Saiu para Entrega", // Pedido saiu para entrega
    [OrderStatus.DELIVERED]: "Entregue", // Pedido entregue
    [OrderStatus.CANCELLED]: "Cancelado", // Pedido cancelado
  };

  // Caso não exista tradução, retorna o próprio status
  return translations[status] || status;
}

// Retorna classes de cor para estilização do badge de status
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800", // Em espera
    [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800", // Confirmado
    [OrderStatus.PREPARING]: "bg-purple-100 text-purple-800", // Em preparação
    [OrderStatus.ON_DELIVERY]: "bg-orange-100 text-orange-800", // Em entrega
    [OrderStatus.DELIVERED]: "bg-green-100 text-green-800", // Entregue
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-800", // Cancelado
  };

  // Caso não exista cor definida, usa padrão cinza
  return colors[status] || "bg-gray-100 text-gray-800";
}
