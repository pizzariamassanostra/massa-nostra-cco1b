// ============================================
// COMPONENT: CUSTOMER STATS
// ============================================

import React from "react";
import { ShoppingBag, DollarSign, TrendingUp, Calendar } from "lucide-react";

// ============================================
// INTERFACE: Propriedades do componente
// ============================================
interface CustomerStatsProps {
  totalOrders: number; // Quantidade total de pedidos do cliente
  totalSpent: number; // Valor total gasto (em centavos)
  averageTicket: number; // Ticket médio (em centavos)
  lastOrderDate?: string; // Data do último pedido (opcional)
}

// ============================================
// COMPONENTE: Estatísticas do cliente
// ============================================
export default function CustomerStats({
  totalOrders,
  totalSpent,
  averageTicket,
  lastOrderDate,
}: CustomerStatsProps) {
  // ============================================
  // FUNÇÃO: Formatar valores monetários (centavos → BRL)
  // ============================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100); // Converte centavos para reais
  };

  // ============================================
  // CONSTANTE: Lista de estatísticas exibidas
  // ============================================
  const stats = [
    {
      label: "Total de Pedidos",
      value: totalOrders,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      label: "Total Gasto",
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Ticket Médio",
      value: formatCurrency(averageTicket),
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Último Pedido",
      value: lastOrderDate
        ? new Date(lastOrderDate).toLocaleDateString("pt-BR") // Data formatada
        : "Nenhum", // Caso não exista pedido
      icon: Calendar,
      color: "orange",
    },
  ];

  // ============================================
  // CONSTANTE: Classes de cores por tipo
  // ============================================
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon; // Ícone correspondente à estatística

        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4"
          >
            {/* Ícone da estatística */}
            <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
              <Icon className="w-6 h-6" />
            </div>

            {/* Texto da estatística */}
            <div>
              <p className="text-sm text-gray-600">
                {stat.label} {/* Nome do indicador */}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {stat.value} {/* Valor exibido */}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
