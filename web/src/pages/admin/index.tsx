// ============================================
// PÁGINA: DASHBOARD ADMIN
// ============================================
// Página principal do painel administrativo
// Estatísticas, gráficos e pedidos recentes
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import StatsCard from "@/components/admin/Dashboard/StatsCard";
import SalesChart from "@/components/admin/Dashboard/SalesChart";
import RecentOrders from "@/components/admin/Dashboard/RecentOrders";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import {
  useDashboardStats,
  useSalesChart,
  useRecentOrders,
} from "@/hooks/admin/useDashboard";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format, subDays } from "date-fns";

// ============================================
// COMPONENTE
// ============================================
export default function DashboardPage() {
  // ============================================
  // ESTADOS — FILTROS DE PERÍODO
  // ============================================
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  // ============================================
  // HOOKS — BUSCAR DADOS DO DASHBOARD
  // ============================================
  const {
    data: stats,
    isLoading: loadingStats,
    error: errorStats,
  } = useDashboardStats(dateRange);

  const {
    data: salesData,
    isLoading: loadingSales,
    error: errorSales,
  } = useSalesChart(dateRange);

  const {
    data: recentOrders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useRecentOrders(10);

  // ============================================
  // LOADING GLOBAL
  // ============================================
  if (loadingStats || loadingSales || loadingOrders) {
    return (
      <AdminLayout title="Dashboard">
        <LoadingSpinner size="lg" text="Carregando dashboard..." />
      </AdminLayout>
    );
  }

  // ============================================
  // ESTADO DE ERRO
  // ============================================
  if (errorStats || errorSales || errorOrders) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">
            Erro ao carregar dados do dashboard
          </p>
          <p className="text-sm text-red-500 mt-2">
            {(errorStats as any)?.message ||
              (errorSales as any)?.message ||
              (errorOrders as any)?.message}
          </p>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Dashboard - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Dashboard">
        {/* ============================================ */}
        {/* FILTROS DE PERÍODO */}
        {/* ============================================ */}
        <div className="mb-6 flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* CARDS — ESTATÍSTICAS GERAIS */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Faturamento Total"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Total de Pedidos"
            value={stats?.totalOrders || 0}
            icon={ShoppingBag}
            color="blue"
          />
          <StatsCard
            title="Clientes"
            value={stats?.totalCustomers || 0}
            icon={Users}
            color="yellow"
          />
          <StatsCard
            title="Ticket Médio"
            value={formatCurrency(stats?.averageTicket || 0)}
            icon={TrendingUp}
            color="red"
          />
        </div>

        {/* ============================================ */}
        {/* CARDS — INDICADORES DO DIA */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Pedidos Hoje"
            value={stats?.ordersToday || 0}
            icon={Clock}
            color="blue"
          />
          <StatsCard
            title="Faturamento Hoje"
            value={formatCurrency(stats?.revenueToday || 0)}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Pedidos Concluídos"
            value={stats?.completedOrders || 0}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* ============================================ */}
        {/* GRÁFICO — VENDAS */}
        {/* ============================================ */}
        <div className="mb-8">
          <SalesChart data={salesData || []} />
        </div>

        {/* ============================================ */}
        {/* LISTA — PEDIDOS RECENTES */}
        {/* ============================================ */}
        <RecentOrders orders={recentOrders || []} />
      </AdminLayout>
    </>
  );
}
