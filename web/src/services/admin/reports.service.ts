// ============================================
// SERVIÇO: RELATÓRIOS
// ============================================
// Responsável por exportar relatórios da aplicação
// Formatos suportados: Excel, CSV, PDF
// ============================================

import api from "../api.service";

// ============================================
// INTERFACES DE TIPOS
// ============================================
// Estruturas de filtros utilizadas para exportação de relatórios
// ============================================
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  paymentMethod?: string;
}

// ============================================================================
// CLASSE DE SERVIÇO
// Responsável por fazer todas as requisições relacionadas a relatórios
// ============================================================================
class ReportsService {
  // Exporta relatório de vendas em Excel
  async exportSalesExcel(filters?: ReportFilters): Promise<Blob> {
    const response = await api.get("/reports/export/sales/excel", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  }

  // Exporta relatório de vendas em CSV
  async exportSalesCSV(filters?: ReportFilters): Promise<Blob> {
    const response = await api.get("/reports/export/sales", {
      params: { ...filters, format: "csv" },
      responseType: "blob",
    });
    return response.data;
  }

  // Realiza download do arquivo exportado
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// ============================================
// EXPORTAR INSTÂNCIA ÚNICA
// ============================================
export const reportsService = new ReportsService();
