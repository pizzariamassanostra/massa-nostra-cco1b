// ============================================
// COMPONENTE: CHART CARD
// ============================================
// Card genérico para exibição de gráficos
// Possui título, conteúdo principal e ações opcionais
// ============================================

import React, { ReactNode } from "react";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface ChartCardProps {
  title: string; // Título exibido no topo do card
  children: ReactNode; // Conteúdo principal (gráfico ou componente)
  actions?: ReactNode; // Ações opcionais (botões, filtros, etc.)
}

// ============================================
// COMPONENTE: ChartCard
// ============================================
export default function ChartCard({
  title,
  children,
  actions,
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ============================================ */}
      {/* CABEÇALHO DO CARD */}
      {/* ============================================ */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>

        {/* Ações opcionais */}
        {actions && <div>{actions}</div>}
      </div>

      {/* ============================================ */}
      {/* CONTEÚDO DO CARD */}
      {/* ============================================ */}
      <div>{children}</div>
    </div>
  );
}
