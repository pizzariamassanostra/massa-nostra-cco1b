// ============================================
// COMPONENTE: EXPORT BUTTON
// ============================================
// Botão de exportação de relatórios
// Permite exportar vendas em Excel ou CSV
// ============================================

import React, { useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { reportsService } from "@/services/admin/reports.service";
import { toast } from "react-hot-toast";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface ExportButtonProps {
  filters: {
    startDate?: string; // Data inicial do filtro
    endDate?: string; // Data final do filtro
    status?: string; // Status do pedido
    paymentMethod?: string; // Forma de pagamento
  };
}

// ============================================
// COMPONENTE: ExportButton
// ============================================
export default function ExportButton({ filters }: ExportButtonProps) {
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // ============================================
  // EXPORTAR RELATÓRIO
  // ============================================
  const handleExport = async (format: "excel" | "csv") => {
    try {
      setLoading(true); // Ativar loading

      // Buscar arquivo conforme formato selecionado
      const blob =
        format === "excel"
          ? await reportsService.exportSalesExcel(filters)
          : await reportsService.exportSalesCSV(filters);

      // Gerar nome do arquivo com data atual
      const filename = `relatorio-vendas-${
        new Date().toISOString().split("T")[0]
      }.${format === "excel" ? "xlsx" : "csv"}`;

      // Disparar download do arquivo
      reportsService.downloadFile(blob, filename);

      // Feedback de sucesso
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar:", error); // Log de erro
      toast.error("Erro ao exportar relatório"); // Feedback de erro
    } finally {
      setLoading(false); // Finalizar loading
    }
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  return (
    <div className="flex gap-2">
      {/* ============================================ */}
      {/* EXPORTAR EXCEL */}
      {/* ============================================ */}
      <button
        onClick={() => handleExport("excel")}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        <FileSpreadsheet className="w-4 h-4" />
        {loading ? "Exportando..." : "Exportar Excel"}
      </button>

      {/* ============================================ */}
      {/* EXPORTAR CSV */}
      {/* ============================================ */}
      <button
        onClick={() => handleExport("csv")}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        {loading ? "Exportando..." : "Exportar CSV"}
      </button>
    </div>
  );
}
