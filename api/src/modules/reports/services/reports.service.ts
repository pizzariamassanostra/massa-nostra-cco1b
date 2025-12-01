// ============================================
// SERVIÇO: RELATÓRIOS
// ============================================
// Lógica de negócio para geração de relatórios
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';

// Usar paths relativos
import { Order } from '../../order/entities/order.entity';
import { OrderItem } from '../../order/entities/order-item.entity';
import { CommonUser } from '../../common-user/entities/common-user.entity';

import {
  SalesReport,
  TopProductsReport,
  DashboardStats,
  CustomerReport,
  PeakHoursReport,
} from '../interfaces/report-interfaces';
import {
  ReportFilterDto,
  TopProductsFilterDto,
} from '../dtos/report-filter.dto';

@Injectable()
export class ReportsService {
  // ============================================
  // CONSTRUCTOR
  // ============================================
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(CommonUser)
    private readonly userRepo: Repository<CommonUser>,
  ) {}

  // ============================================
  // CALCULAR DATAS DO PERÍODO
  // ============================================
  // Converte filtros de período em datas concretas
  // Suporta: today, week, month, year ou datas customizadas
  // Filtros do relatório
  // Período calculado
  // ============================================
  private getDateRange(filter: ReportFilterDto): {
    start_date: Date;
    end_date: Date;
  } {
    const now = new Date();
    let start_date: Date;
    let end_date: Date = now;

    if (filter.period === 'today') {
      start_date = new Date(now.setHours(0, 0, 0, 0));
      end_date = new Date(now.setHours(23, 59, 59, 999));
    } else if (filter.period === 'week') {
      start_date = new Date(now.setDate(now.getDate() - 7));
    } else if (filter.period === 'month') {
      start_date = new Date(now.setMonth(now.getMonth() - 1));
    } else if (filter.period === 'year') {
      start_date = new Date(now.setFullYear(now.getFullYear() - 1));
    } else if (filter.start_date && filter.end_date) {
      start_date = new Date(filter.start_date);
      end_date = new Date(filter.end_date);
    } else {
      // Padrão: últimos 30 dias
      start_date = new Date(now.setDate(now.getDate() - 30));
      end_date = new Date();
    }

    return { start_date, end_date };
  }

  // ============================================
  // RELATÓRIO DE VENDAS
  // ============================================
  async getSalesReport(
    startDate?: string,
    endDate?: string,
  ): Promise<SalesReport> {
    const filter: ReportFilterDto = {
      start_date: startDate,
      end_date: endDate,
    };

    const { start_date, end_date } = this.getDateRange(filter);

    // Usar alias 'ord' e relations corretas
    const queryBuilder = this.orderRepo
      .createQueryBuilder('ord')
      .leftJoinAndSelect('ord.user', 'user')
      .leftJoinAndSelect('ord.items', 'items')
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('ord.deleted_at IS NULL');

    if (filter.status && filter.status !== 'all') {
      queryBuilder.andWhere('ord.status = :status', {
        status: filter.status,
      });
    }

    const orders = await queryBuilder.getMany();

    // Calcular totais
    const total_orders = orders.length;
    const total_revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0);

    const cancelled_orders = orders.filter(
      (o) => o.status === 'cancelled',
    ).length;
    const cancelled_revenue = orders
      .filter((o) => o.status === 'cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0);

    const average_ticket = total_orders > 0 ? total_revenue / total_orders : 0;

    // Buscar itens vendidos
    const items = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'ord')
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .getMany();

    const total_items_sold = items.reduce((sum, i) => sum + i.quantity, 0);

    // Agrupar por forma de pagamento
    const by_payment_method = orders.reduce((acc, order) => {
      if (order.status === 'cancelled') return acc;

      const existing = acc.find((i) => i.method === order.payment_method);
      const total = parseFloat(order.total.toString());

      if (existing) {
        existing.count++;
        existing.total += total;
      } else {
        acc.push({
          method: order.payment_method,
          count: 1,
          total,
          percentage: 0,
        });
      }

      return acc;
    }, []);

    // Calcular percentuais
    by_payment_method.forEach((item) => {
      item.percentage = (item.total / total_revenue) * 100;
    });

    // Agrupar por status
    const by_status = orders.reduce((acc, order) => {
      const existing = acc.find((i) => i.status === order.status);
      const total = parseFloat(order.total.toString());

      if (existing) {
        existing.count++;
        existing.total += total;
      } else {
        acc.push({
          status: order.status,
          count: 1,
          total,
        });
      }

      return acc;
    }, []);

    const daily_breakdown = [];
    const dateMap = new Map();

    orders.forEach((order) => {
      if (order.status === 'cancelled') return;

      const date = order.created_at.toISOString().split('T')[0];
      const total = parseFloat(order.total.toString());

      if (dateMap.has(date)) {
        const day = dateMap.get(date);
        day.orders++;
        day.revenue += total;
      } else {
        dateMap.set(date, { date, orders: 1, revenue: total });
      }
    });

    dateMap.forEach((value) => daily_breakdown.push(value));
    daily_breakdown.sort((a, b) => a.date.localeCompare(b.date));

    return {
      period: {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      },
      summary: {
        total_orders,
        total_revenue,
        total_items_sold,
        average_ticket,
        cancelled_orders,
        cancelled_revenue,
      },
      by_payment_method,
      by_status,
      daily_breakdown,
      sales: orders.map((order) => ({
        id: order.id,
        order_number: `ORD-${order.id}`, // GERAR A PARTIR DO ID
        customer_name: order.user?.name || 'Cliente',
        items_count: order.items?.length || 0,
        subtotal: parseFloat(order.subtotal.toString()),
        delivery_fee: parseFloat(order.delivery_fee.toString()),
        discount: parseFloat(order.discount.toString()),
        total: parseFloat(order.total.toString()),
        payment_method: order.payment_method,
        status: order.status,
        created_at: order.created_at,
      })),
    };
  }

  // ============================================
  // PRODUTOS MAIS VENDIDOS
  // ============================================
  async getTopProducts(
    filter: TopProductsFilterDto,
  ): Promise<TopProductsReport> {
    const { start_date, end_date } = this.getDateRange(filter);
    const limit = filter.limit || 10;

    const items = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'ord')
      .leftJoin('item.product', 'product')
      .leftJoin('product.category', 'category')
      .select('product.id', 'product_id')
      .addSelect('product. name', 'product_name')
      .addSelect('category. name', 'category')
      .addSelect('SUM(item.quantity)', 'quantity_sold')
      .addSelect('SUM(item.subtotal)', 'total_revenue')
      .addSelect('AVG(item.unit_price)', 'average_price')
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .groupBy('product. id')
      .addGroupBy('product.name')
      .addGroupBy('category. name')
      .orderBy('quantity_sold', 'DESC')
      .limit(limit)
      .getRawMany();

    const total_revenue = items.reduce(
      (sum, i) => sum + parseFloat(i.total_revenue),
      0,
    );

    const products = items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      category: item.category || 'Sem categoria',
      quantity_sold: parseInt(item.quantity_sold),
      total_revenue: parseFloat(item.total_revenue),
      percentage_of_sales:
        (parseFloat(item.total_revenue) / total_revenue) * 100,
      average_price: parseFloat(item.average_price),
    }));

    return {
      period: {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      },
      products,
    };
  }

  // ============================================
  // DASHBOARD - MÉTRICAS GERAIS
  // ============================================
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const today_start = new Date(now.setHours(0, 0, 0, 0));
    const week_start = new Date(now.setDate(now.getDate() - 7));
    const month_start = new Date(now.setMonth(now.getMonth() - 1));

    // Hoje
    const today_orders = await this.orderRepo.count({
      where: {
        created_at: MoreThanOrEqual(today_start),
        deleted_at: null,
      },
    });

    const today_revenue_data = await this.orderRepo
      .createQueryBuilder('ord')
      .select('SUM(ord.total)', 'total')
      .where('ord.created_at >= :start', { start: today_start })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .getRawOne();

    const today_revenue = parseFloat(today_revenue_data?.total || '0');
    const today_average_ticket =
      today_orders > 0 ? today_revenue / today_orders : 0;

    // Semana
    const week_orders = await this.orderRepo.count({
      where: {
        created_at: MoreThanOrEqual(week_start),
        deleted_at: null,
      },
    });

    const week_revenue_data = await this.orderRepo
      .createQueryBuilder('ord')
      .select('SUM(ord.total)', 'total')
      .where('ord.created_at >= :start', { start: week_start })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .getRawOne();

    const week_revenue = parseFloat(week_revenue_data?.total || '0');
    const week_average_ticket =
      week_orders > 0 ? week_revenue / week_orders : 0;

    // Mês
    const month_orders = await this.orderRepo.count({
      where: {
        created_at: MoreThanOrEqual(month_start),
        deleted_at: null,
      },
    });

    const month_revenue_data = await this.orderRepo
      .createQueryBuilder('ord')
      .select('SUM(ord.total)', 'total')
      .where('ord.created_at >= :start', { start: month_start })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .getRawOne();

    const month_revenue = parseFloat(month_revenue_data?.total || '0');
    const month_average_ticket =
      month_orders > 0 ? month_revenue / month_orders : 0;

    // Top produtos (semana)
    const top_products_data = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'ord')
      .leftJoin('item.product', 'product')
      .select('product.name', 'name')
      .addSelect('SUM(item.quantity)', 'quantity')
      .where('ord.created_at >= :start', { start: week_start })
      .groupBy('product.name')
      .orderBy('quantity', 'DESC')
      .limit(5)
      .getRawMany();

    const top_products = top_products_data.map((p) => ({
      name: p.name,
      quantity: parseInt(p.quantity),
    }));

    // Pedidos recentes
    const recent_orders = await this.orderRepo.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      today: {
        orders: today_orders,
        revenue: today_revenue,
        average_ticket: today_average_ticket,
      },
      week: {
        orders: week_orders,
        revenue: week_revenue,
        average_ticket: week_average_ticket,
        growth_percentage: 0,
      },
      month: {
        orders: month_orders,
        revenue: month_revenue,
        average_ticket: month_average_ticket,
        growth_percentage: 0,
      },
      top_products,
      recent_orders: recent_orders.map((o) => ({
        id: o.id,
        customer_name: o.user?.name || 'Cliente',
        total: parseFloat(o.total.toString()),
        status: o.status,
        created_at: o.created_at,
      })),
    };
  }

  // ============================================
  // RELATÓRIO DE CLIENTES
  // ============================================
  async getCustomerReport(filter: ReportFilterDto): Promise<CustomerReport> {
    const { start_date, end_date } = this.getDateRange(filter);

    const total_customers = await this.userRepo.count({
      where: { deleted_at: null },
    });

    const new_customers = await this.userRepo.count({
      where: {
        created_at: Between(start_date, end_date),
        deleted_at: null,
      },
    });

    const active_customers_data = await this.orderRepo
      .createQueryBuilder('ord')
      .select('DISTINCT ord.common_user_id')
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .getRawMany();

    const active_customers = active_customers_data.length;

    const total_orders = await this.orderRepo.count({
      where: {
        created_at: Between(start_date, end_date),
        deleted_at: null,
      },
    });

    const top_customers_data = await this.orderRepo
      .createQueryBuilder('ord')
      .leftJoin('ord.user', 'user')
      .select('user.id', 'customer_id')
      .addSelect('user.name', 'customer_name')
      .addSelect('COUNT(ord.id)', 'total_orders')
      .addSelect('SUM(ord.total)', 'total_spent')
      .addSelect('AVG(ord.total)', 'average_ticket')
      .addSelect('MAX(ord.created_at)', 'last_order_date')
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .groupBy('user.id')
      .addGroupBy('user.name')
      .orderBy('total_spent', 'DESC')
      .limit(20)
      .getRawMany();

    const top_customers = top_customers_data.map((c) => ({
      customer_id: c.customer_id,
      customer_name: c.customer_name,
      total_orders: parseInt(c.total_orders),
      total_spent: parseFloat(c.total_spent),
      average_ticket: parseFloat(c.average_ticket),
      last_order_date: new Date(c.last_order_date),
    }));

    return {
      period: {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      },
      summary: {
        total_customers,
        new_customers,
        active_customers,
        total_orders,
      },
      top_customers,
    };
  }

  // ============================================
  // HORÁRIOS DE PICO
  // ============================================
  async getPeakHoursReport(filter: ReportFilterDto): Promise<PeakHoursReport> {
    const { start_date, end_date } = this.getDateRange(filter);

    const by_hour_data = await this.orderRepo
      .createQueryBuilder('ord')
      .select('EXTRACT(HOUR FROM ord.created_at)', 'hour')
      .addSelect('COUNT(ord.id)', 'orders')
      .addSelect('SUM(ord.total)', 'revenue')
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    const by_hour = by_hour_data.map((h) => ({
      hour: parseInt(h.hour),
      orders: parseInt(h.orders),
      revenue: parseFloat(h.revenue),
    }));

    const by_day_data = await this.orderRepo
      .createQueryBuilder('ord')
      .select("TO_CHAR(ord.created_at, 'Day')", 'day')
      .addSelect('COUNT(ord.id)', 'orders')
      .addSelect('SUM(ord.total)', 'revenue')
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('ord.status != :status', { status: 'cancelled' })
      .groupBy('day')
      .getRawMany();

    const by_day_of_week = by_day_data.map((d) => ({
      day: d.day.trim(),
      orders: parseInt(d.orders),
      revenue: parseFloat(d.revenue),
    }));

    return {
      by_hour,
      by_day_of_week,
    };
  }

  // ============================================
  // EXPORTAR EXCEL
  // ============================================
  async exportSalesToExcel(
    startDate?: string,
    endDate?: string,
  ): Promise<Buffer> {
    const ExcelJS = require('exceljs');
    const salesData = await this.getSalesReport(startDate, endDate);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Pizzaria Massa Nostra';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Vendas', {
      properties: { tabColor: { argb: 'FFd32f2f' } },
      views: [{ state: 'frozen', xSplit: 0, ySplit: 3 }],
    });

    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'PIZZARIA MASSA NOSTRA - RELATÓRIO DE VENDAS';
    titleCell.font = {
      name: 'Arial',
      size: 16,
      bold: true,
      color: { argb: 'FFd32f2f' },
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF5F5F5' },
    };

    worksheet.mergeCells('A2:G2');
    const periodCell = worksheet.getCell('A2');
    periodCell.value = `Período: ${startDate || 'Início'} até ${endDate || 'Hoje'}`;
    periodCell.font = { name: 'Arial', size: 12 };
    periodCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getRow(3).height = 5;

    const headerRow = worksheet.getRow(4);
    headerRow.values = [
      'Data',
      'Nº Pedido',
      'Cliente',
      'Itens',
      'Forma Pagamento',
      'Total',
      'Status',
    ];

    headerRow.font = {
      name: 'Arial',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFd32f2f' },
    };
    headerRow.height = 25;

    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let totalGeral = 0;
    let rowIndex = 5;

    salesData.sales.forEach((sale: any) => {
      const row = worksheet.getRow(rowIndex);

      const statusMap = {
        pending: 'Pendente',
        confirmed: 'Confirmado',
        preparing: 'Preparando',
        ready: 'Pronto',
        out_for_delivery: 'Em Entrega',
        delivered: 'Entregue',
        cancelled: 'Cancelado',
      };

      const paymentMap = {
        pix: 'PIX',
        credit_card: 'Cartão Crédito',
        debit_card: 'Cartão Débito',
        cash: 'Dinheiro',
        voucher: 'Vale Refeição',
      };

      // Garantir que nenhum valor seja undefined
      const orderNumber = sale.order_number || `ORD-${sale.id}`;
      const customerName = sale.customer_name || 'Cliente';
      const itemsCount = sale.items_count || 0;
      const paymentMethod =
        paymentMap[sale.payment_method] || sale.payment_method || 'N/A';
      const total = parseFloat(sale.total) || 0;
      const status = statusMap[sale.status] || sale.status || 'N/A';
      const createdAt = sale.created_at
        ? new Date(sale.created_at).toLocaleDateString('pt-BR')
        : '-';

      row.values = [
        createdAt,
        orderNumber,
        customerName,
        itemsCount,
        paymentMethod,
        total,
        status,
      ];

      row.font = { name: 'Arial', size: 10 };
      row.alignment = { vertical: 'middle' };

      if (rowIndex % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9F9F9' },
        };
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        };
      });

      row.getCell(6).numFmt = 'R$ #,##0.00';

      totalGeral += total;
      rowIndex++;
    });

    const totalRow = worksheet.getRow(rowIndex);
    totalRow.values = ['', '', '', '', 'TOTAL GERAL:', totalGeral, ''];
    totalRow.font = { name: 'Arial', size: 12, bold: true };
    totalRow.alignment = { vertical: 'middle', horizontal: 'right' };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB3B' },
    };

    totalRow.getCell(6).numFmt = 'R$ #,##0.00';

    totalRow.eachCell((cell, colNumber) => {
      if (colNumber >= 5) {
        cell.border = {
          top: { style: 'double' },
          bottom: { style: 'double' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });

    worksheet.columns = [
      { key: 'data', width: 12 },
      { key: 'pedido', width: 20 },
      { key: 'cliente', width: 30 },
      { key: 'itens', width: 8 },
      { key: 'pagamento', width: 18 },
      { key: 'total', width: 15 },
      { key: 'status', width: 15 },
    ];

    worksheet.autoFilter = {
      from: { row: 4, column: 1 },
      to: { row: rowIndex - 1, column: 7 },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // ============================================
  // EXPORTAR CSV
  // ============================================
  async exportSalesCSV(filter: ReportFilterDto): Promise<string> {
    const { start_date, end_date } = this.getDateRange(filter);

    const orders = await this.orderRepo
      .createQueryBuilder('ord')
      .leftJoin('ord.user', 'user')
      .select([
        'ord.id',
        'ord. created_at',
        'user.name',
        'ord. total',
        'ord.status',
        'ord.payment_method',
      ])
      .where('ord.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .orderBy('ord.created_at', 'DESC')
      .getMany();

    let csv = 'ID,Data,Cliente,Total,Status,Pagamento\n';

    orders.forEach((order) => {
      const date = order.created_at.toISOString().split('T')[0];
      const customer = order.user?.name || 'Cliente';
      const total = parseFloat(order.total.toString()).toFixed(2);

      csv += `${order.id},"${date}","${customer}",${total},${order.status},${order.payment_method}\n`;
    });

    return csv;
  }
}
