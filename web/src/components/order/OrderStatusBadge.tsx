// ============================================
// COMPONENTE: BADGE DE STATUS DO PEDIDO
// ============================================
// Exibe um badge visual indicando o status atual do pedido.
// Traduz o status para PT-BR e aplica cores conforme o estado.
// ============================================

import React from "react";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface OrderStatusBadgeProps {
  status: string; // Status atual do pedido (ex: pendente
  // , entregue, cancelado)
}

// ============================================
// COMPONENTE
// ============================================
const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  // ============================================
  // TRADUZIR STATUS
  // ============================================
  // Converte o status técnico vindo da API
  // para um texto amigável em português
  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      pending: "Aguardando Confirmação", // Pedido criado
      confirmed: "Confirmado", // Pedido confirmado
      preparing: "Em Preparação", // Pedido sendo preparado
      on_delivery: "Saiu para Entrega", // Pedido em rota
      delivered: "Entregue", // Pedido finalizado
      cancelled: "Cancelado", // Pedido cancelado
    };

    return translations[status] || status; // Fallback caso status não mapeado
  };

  // ============================================
  // DEFINIR COR DO BADGE
  // ============================================
  // Define classes de cor conforme o status do pedido
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300", // Aguardando
      confirmed: "bg-blue-100 text-blue-800 border-blue-300", // Confirmado
      preparing: "bg-purple-100 text-purple-800 border-purple-300", // Preparação
      on_delivery: "bg-orange-100 text-orange-800 border-orange-300", // Entrega
      delivered: "bg-green-100 text-green-800 border-green-300", // Concluído
      cancelled: "bg-red-100 text-red-800 border-red-300", // Cancelado
    };

    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300"; // Fallback visual
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
        status // Aplica cor conforme status
      )}`}
    >
      {translateStatus(status) /* Texto traduzido do status */}
    </span>
  );
};

// ============================================
// EXPORTAÇÃO
// ============================================
export default OrderStatusBadge;
