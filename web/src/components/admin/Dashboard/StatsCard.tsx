// ============================================
// COMPONENT: STATS CARD
// ============================================

import React from "react";
import { LucideIcon } from "lucide-react";

// ============================================
// INTERFACE: Propriedades do componente StatsCard
// ============================================
interface StatsCardProps {
  title: string; // Título do indicador
  value: string | number; // Valor exibido no card
  icon: LucideIcon; // Ícone exibido ao lado do valor
  color?: "red" | "green" | "blue" | "yellow" | "purple" | "orange"; // Cor do ícone
  trend?: {
    value: number; // Percentual de variação
    isPositive: boolean; // Indica se a tendência é positiva ou negativa
  };
}

// ============================================
// COMPONENTE
// ============================================
export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "red",
  trend,
}: StatsCardProps) {
  // ============================================
  // CONFIGURAÇÃO DE CORES DO ÍCONE
  // ============================================
  const colorClasses = {
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        {/* ============================================ */}
        {/* SEÇÃO: Texto principal */}
        {/* ============================================ */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          {/* ============================================ */}
          {/* SEÇÃO: Tendência mensal */}
          {/* ============================================ */}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs. mês anterior</span>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* SEÇÃO: Ícone do indicador */}
        {/* ============================================ */}
        <div className={`p-4 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
