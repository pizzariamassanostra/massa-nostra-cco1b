// ============================================
// CONTROLLER: RELATÓRIOS
// ============================================
// Endpoints de relatórios gerenciais
// ============================================

import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from '../services/reports.service';
import {
  ReportFilterDto,
  TopProductsFilterDto,
} from '../dtos/report-filter.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard) // Apenas administradores autenticados
export class ReportsController {
  // ============================================
  // CONSTRUCTOR
  // ============================================
  // Injeta o serviço de relatórios
  // ============================================
  constructor(private readonly reportsService: ReportsService) {}

  // ============================================
  // DASHBOARD - MÉTRICAS GERAIS
  // ============================================
  // GET /reports/dashboard
  //
  // Retorna métricas consolidadas do negócio:
  // - Vendas de hoje, semana e mês
  // - Ticket médio
  // - Top 5 produtos da semana
  // - Últimos 10 pedidos
  // ============================================
  @Get('dashboard')
  async getDashboard() {
    const stats = await this.reportsService.getDashboardStats();

    return {
      ok: true,
      data: stats,
    };
  }

  // ============================================
  // RELATÓRIO DE VENDAS
  // ============================================
  // GET /reports/sales? start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
  //
  // Retorna relatório completo de vendas do período
  // Inclui: resumo, breakdown por pagamento/status, vendas diárias
  //
  // Aceita apenas 2 parâmetros de query
  // ============================================
  @Get('sales')
  async getSalesReport(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    // Passar apenas 2 parâmetros
    const report = await this.reportsService.getSalesReport(startDate, endDate);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // PRODUTOS MAIS VENDIDOS
  // ============================================
  // GET /reports/top-products? period=week&limit=10
  //
  // Lista os produtos mais vendidos do período
  // Ordenado por quantidade vendida (maior para menor)
  // ============================================
  @Get('top-products')
  async getTopProducts(@Query() filter: TopProductsFilterDto) {
    const report = await this.reportsService.getTopProducts(filter);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // RELATÓRIO DE CLIENTES
  // ============================================
  // GET /reports/customers? period=month
  //
  // Analisa comportamento de compra dos clientes
  // - Total de clientes (ativos, novos)
  // - Top 20 clientes por valor gasto
  // - Ticket médio por cliente
  // ============================================
  @Get('customers')
  async getCustomerReport(@Query() filter: ReportFilterDto) {
    const report = await this.reportsService.getCustomerReport(filter);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // HORÁRIOS DE PICO
  // ============================================
  // GET /reports/peak-hours?period=week
  //
  // Identifica horários e dias com mais movimento
  // - Pedidos por hora do dia (0-23h)
  // - Pedidos por dia da semana
  //
  // Útil para: planejamento de equipe, promoções
  // ============================================
  @Get('peak-hours')
  async getPeakHours(@Query() filter: ReportFilterDto) {
    const report = await this.reportsService.getPeakHoursReport(filter);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // EXPORTAR VENDAS PARA EXCEL
  // ============================================
  // GET /reports/export/sales/excel?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
  //
  // Gera e baixa arquivo Excel (. xlsx) com relatório de vendas
  // Formatação com:
  // - Cabeçalho colorido
  // - Tabela de vendas completa
  // - Totalizações
  // - Filtros automáticos
  // - Células mescladas
  // - Arquivo Excel para download
  // ============================================
  @Get('export/sales/excel')
  async exportSalesToExcel(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Res() res?: Response,
  ) {
    // Gerar Excel
    const buffer = await this.reportsService.exportSalesToExcel(
      startDate,
      endDate,
    );

    // Nome do arquivo
    const filename = `vendas_${startDate || 'inicio'}_${endDate || 'hoje'}.xlsx`;

    // Headers para download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    // Enviar buffer
    res.send(buffer);
  }

  // ============================================
  // EXPORTAR RELATÓRIO CSV
  // ============================================
  // GET /reports/export/sales? period=month
  //
  // Exporta vendas em formato CSV (simples)
  // Compatível com Excel, Google Sheets
  // ============================================
  @Get('export/sales')
  async exportSalesCSV(@Query() filter: ReportFilterDto) {
    const csv = await this.reportsService.exportSalesCSV(filter);

    return {
      ok: true,
      filename: `vendas_${new Date().toISOString().split('T')[0]}.csv`,
      data: csv,
    };
  }
}
