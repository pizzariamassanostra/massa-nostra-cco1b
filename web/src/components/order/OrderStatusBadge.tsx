// ============================================
// COMPONENTE: BADGE DE STATUS DO PEDIDO
// ============================================
// Exibe status do pedido
// ============================================

import React from "react";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  // ============================================
  // TRADUZIR STATUS
  // ============================================
  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      pending: "Aguardando Confirmação",
      confirmed: "Confirmado",
      preparing: "Em Preparação",
      on_delivery: "Saiu para Entrega",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return translations[status] || status;
  };

  // ============================================
  // DEFINIR COR DO BADGE
  // ============================================
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      on_delivery: "bg-orange-100 text-orange-800 border-orange-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
        status
      )}`}
    >
      {translateStatus(status)}
    </span>
  );
};

export default OrderStatusBadge;
