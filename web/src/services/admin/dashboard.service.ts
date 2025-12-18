// ============================================
// SERVIÇO: DASHBOARD
// ============================================
// Responsável por buscar dados do dashboard
// Inclui estatísticas, gráficos e resumos
// CORRIGIDO: Adicionado totalProducts
// ============================================

import api from "../api.service";

// ============================================
// INTERFACES DE TIPOS
// ============================================
// Estruturas de dados utilizadas para exibir informações no dashboard
// ============================================

// Estatísticas gerais do dashboard
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageTicket: number;
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts?: number; // Adicionado (opcional)
}

// Dados para gráfico de vendas
export interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

// Produtos mais vendidos
export interface TopProduct {
  product_id: number;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

// Pedidos recentes
export interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

// ============================================================================
// CLASSE DE SERVIÇO
// Responsável por fazer todas as requisições relacionadas ao dashboard
// ============================================================================
class DashboardService {
  // Buscar estatísticas gerais do dashboard
  async getStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardStats> {
    const response = await api.get("/reports/dashboard", { params });
    return response.data;
  }

  // Buscar dados para gráfico de vendas
  async getSalesChart(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SalesChartData[]> {
    const response = await api.get("/reports/sales", { params });
    return response.data;
  }

  // Buscar produtos mais vendidos
  async getTopProducts(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<TopProduct[]> {
    const response = await api.get("/reports/top-products", { params });
    return response.data;
  }

  // Buscar pedidos recentes
  async getRecentOrders(limit: number = 10): Promise<RecentOrder[]> {
    const response = await api.get("/order", {
      params: { limit, sort: "created_at:desc" },
    });
    return response.data.orders || [];
  }

  // Buscar horários de pico
  async getPeakHours(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const response = await api.get("/reports/peak-hours", { params });
    return response.data;
  }
}

// ============================================
// EXPORTAR INSTÂNCIA ÚNICA
// ============================================
export const dashboardService = new DashboardService();
