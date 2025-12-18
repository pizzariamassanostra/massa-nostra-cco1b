// ============================================
// COMPONENT: RECENT ORDERS
// ============================================

import React from "react";
import Link from "next/link";
import { RecentOrder } from "@/services/admin/dashboard.service";
import { ArrowRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// ============================================
// INTERFACE: Propriedades do componente
// ============================================
interface RecentOrdersProps {
  orders: RecentOrder[]; // Lista de pedidos recentes
}

// ============================================
// COMPONENTE
// ============================================
export default function RecentOrders({ orders }: RecentOrdersProps) {
  // ============================================
  // MAPA: Cores por status do pedido
  // ============================================
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-purple-100 text-purple-800",
    out_for_delivery: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // ============================================
  // MAPA: Labels por status do pedido
  // ============================================
  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    out_for_delivery: "Saiu para Entrega",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ============================================ */}
      {/* CABEÇALHO DA SEÇÃO */}
      {/* ============================================ */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Pedidos Recentes</h3>
        <Link
          href="/admin/pedidos"
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ============================================ */}
      {/* LISTA DE PEDIDOS */}
      {/* ============================================ */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum pedido recente
          </p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              {/* ============================================ */}
              {/* NÚMERO DO PEDIDO E STATUS */}
              {/* ============================================ */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {order.order_number}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    statusColors[order.status]
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              {/* ============================================ */}
              {/* NOME DO CLIENTE */}
              {/* ============================================ */}
              <p className="text-sm text-gray-600 mb-1">
                {order.customer_name}
              </p>

              {/* ============================================ */}
              {/* TOTAL DO PEDIDO E TEMPO RELATIVO */}
              {/* ============================================ */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-red-600">
                  R$ {order.total.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(order.created_at), {
                    addSuffix: true, // Exibe "há X minutos"
                    locale: ptBR, // Localização PT-BR
                  })}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
