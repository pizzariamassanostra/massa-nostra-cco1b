// ============================================
// COMPONENTE: REPORT FILTERS
// ============================================
// Filtros de período para geração de relatórios
// Permite selecionar data inicial, final e aplicar filtro
// ============================================

import React from "react";
import { Calendar } from "lucide-react";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface ReportFiltersProps {
  startDate: string; // Data inicial selecionada
  endDate: string; // Data final selecionada
  onStartDateChange: (date: string) => void; // Callback ao alterar data inicial
  onEndDateChange: (date: string) => void; // Callback ao alterar data final
  onApply: () => void; // Callback ao aplicar filtros
}

// ============================================
// COMPONENTE: ReportFilters
// ============================================
export default function ReportFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: ReportFiltersProps) {
  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* ============================================ */}
      {/* CABEÇALHO */}
      {/* ============================================ */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Período do Relatório
        </h3>
      </div>

      {/* ============================================ */}
      {/* CAMPOS DE FILTRO */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ============================================ */}
        {/* DATA INÍCIO */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Início
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)} // Atualizar data inicial
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* ============================================ */}
        {/* DATA FIM */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Fim
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)} // Atualizar data final
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* ============================================ */}
        {/* BOTÃO APLICAR FILTROS */}
        {/* ============================================ */}
        <div className="flex items-end">
          <button
            onClick={onApply} // Executar aplicação dos filtros
            className="w-full px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
