// ============================================
// COMPONENT: STATUS BADGE
// ============================================

import React from "react";

// ============================================
// INTERFACE
// ============================================
interface StatusBadgeProps {
  status: string; // Status atual do pedido
}

// ============================================
// COMPONENTE
// ============================================
export default function StatusBadge({ status }: StatusBadgeProps) {
  // ============================================
  // MAPA DE CORES E LABELS POR STATUS
  // ============================================
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pendente",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    confirmed: {
      label: "Confirmado",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    preparing: {
      label: "Preparando",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
    out_for_delivery: {
      label: "Saiu para Entrega",
      className: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    delivered: {
      label: "Entregue",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelado",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  // ============================================
  // CONFIGURAÇÃO PADRÃO (FALLBACK)
  // ============================================
  const config = statusConfig[status] || {
    label: status, // Exibe o próprio status se não mapeado
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
