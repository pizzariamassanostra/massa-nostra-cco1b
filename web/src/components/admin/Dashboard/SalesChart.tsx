// ============================================
// COMPONENT: SALES CHART
// ============================================

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SalesChartData } from "@/services/admin/dashboard.service";

// ============================================
// INTERFACE: Propriedades do gráfico de vendas
// ============================================
interface SalesChartProps {
  data: SalesChartData[]; // Lista de dados de vendas (últimos 7 dias)
}

// ============================================
// COMPONENTE
// ============================================
export default function SalesChart({ data }: SalesChartProps) {
  // ============================================
  // FORMATAÇÃO DOS DADOS PARA O GRÁFICO
  // Converte datas para exibição amigável no eixo X
  // ============================================
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }),
  }));

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ============================================ */}
      {/* TÍTULO DO GRÁFICO */}
      {/* ============================================ */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Vendas nos Últimos 7 Dias
      </h3>

      {/* ============================================ */}
      {/* CONTAINER RESPONSIVO DO GRÁFICO */}
      {/* ============================================ */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          {/* Grade de fundo do gráfico */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Eixo X com datas */}
          <XAxis dataKey="date" />

          {/* Eixo Y com valores */}
          <YAxis />

          {/* Tooltip customizado */}
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [`R$ ${value.toFixed(2)}`, "Faturamento"]; // Tooltip de faturamento
              }
              return [value, "Pedidos"]; // Tooltip de pedidos
            }}
          />

          {/* Legenda do gráfico */}
          <Legend />

          {/* ============================================ */}
          {/* LINHA: FATURAMENTO */}
          {/* ============================================ */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#dc2626"
            strokeWidth={2}
            name="Faturamento (R$)"
          />

          {/* ============================================ */}
          {/* LINHA: QUANTIDADE DE PEDIDOS */}
          {/* ============================================ */}
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#16a34a"
            strokeWidth={2}
            name="Pedidos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
