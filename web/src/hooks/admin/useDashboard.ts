// ============================================
// HOOK: USE DASHBOARD
// ============================================
// Hooks para buscar dados do dashboard administrativo
// ============================================

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/admin/dashboard.service";

// ============================================
// HOOK: useDashboardStats
// ============================================
// Busca estatísticas gerais do dashboard
// Filtros opcionais por período
// ============================================
export const useDashboardStats = (filters?: {
  startDate?: string; // Data inicial do filtro
  endDate?: string; // Data final do filtro
}) => {
  return useQuery({
    queryKey: ["dashboard-stats", filters],
    queryFn: () => dashboardService.getStats(filters),
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

// ============================================
// HOOK: useSalesChart
// ============================================
// Busca dados para gráfico de vendas
// ============================================
export const useSalesChart = (filters?: {
  startDate?: string; // Data inicial do filtro
  endDate?: string; // Data final do filtro
}) => {
  return useQuery({
    queryKey: ["sales-chart", filters],
    queryFn: () => dashboardService.getSalesChart(filters),
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

// ============================================
// HOOK: useTopProducts
// ============================================
// Lista produtos mais vendidos
// ============================================
export const useTopProducts = (filters?: {
  startDate?: string; // Data inicial do filtro
  endDate?: string; // Data final do filtro
  limit?: number; // Limite de produtos retornados
}) => {
  return useQuery({
    queryKey: ["top-products", filters],
    queryFn: () => dashboardService.getTopProducts(filters),
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

// ============================================
// HOOK: useRecentOrders
// ============================================
// Lista pedidos mais recentes
// ============================================
export const useRecentOrders = (limit: number = 10) => {
  return useQuery({
    queryKey: ["recent-orders", limit],
    queryFn: () => dashboardService.getRecentOrders(limit),
    staleTime: 1000 * 60 * 2, // Cache por 2 minutos
  });
};
