// ============================================
// COMPONENT: ORDER FILTERS
// ============================================

import React from "react";
import { Search, Filter } from "lucide-react";

// ============================================
// INTERFACE: Estrutura das propriedades do componente
// ============================================
interface OrderFiltersProps {
  filters: {
    status: string; // Status do pedido selecionado
    search: string; // Texto de pesquisa
    startDate: string; // Data inicial do filtro
    endDate: string; // Data final do filtro
    paymentMethod: string; // Forma de pagamento selecionada
  };
  onFilterChange: (key: string, value: string) => void; // Função que atualiza os filtros
}

// ============================================
// COMPONENT: Filtros da página de pedidos
// ============================================
export default function OrderFilters({
  filters,
  onFilterChange,
}: OrderFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* ============================================ */}
      {/* Título da seção de filtros */}
      {/* ============================================ */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
      </div>

      {/* ============================================ */}
      {/* Campos do formulário de filtros */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pedido..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Seleção de status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="preparing">Preparando</option>
          <option value="out_for_delivery">Saiu para Entrega</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>

        {/* Data de início */}
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        />

        {/* Data de fim */}
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        />

        {/* Forma de pagamento */}
        <select
          value={filters.paymentMethod}
          onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todas as Formas</option>
          <option value="pix">PIX</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao_debito">Cartão Débito</option>
          <option value="cartao_credito">Cartão Crédito</option>
        </select>
      </div>
    </div>
  );
}
