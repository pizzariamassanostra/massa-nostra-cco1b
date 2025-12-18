// ============================================
// PÁGINA: RELATÓRIOS (ADMIN)
// ============================================
// Dashboard de relatórios completo
// Gráficos e exportação
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import ReportFilters from "@/components/admin/Reports/ReportFilters";
import ExportButton from "@/components/admin/Reports/ExportButton";
import ChartCard from "@/components/admin/Reports/ChartCard";
import SalesChart from "@/components/admin/Dashboard/SalesChart";
import StatsCard from "@/components/admin/Dashboard/StatsCard";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import {
  useDashboardStats,
  useSalesChart,
  useTopProducts,
} from "@/hooks/admin/useDashboard";
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react";
import { format, subDays } from "date-fns";

// ============================================
// COMPONENTE
// ============================================
export default function AdminRelatoriosPage() {
  // ============================================
  // ESTADOS — FILTRO DE PERÍODO
  // ============================================
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  // ============================================
  // HOOKS — BUSCAR DADOS
  // ============================================
  const { data: stats, isLoading: loadingStats } = useDashboardStats(dateRange);
  const { data: salesData, isLoading: loadingSales } = useSalesChart(dateRange);
  const { data: topProducts, isLoading: loadingProducts } = useTopProducts({
    ...dateRange,
    limit: 10,
  });

  // ============================================
  // CONTROLE DE LOADING
  // ============================================
  const loading = loadingStats || loadingSales || loadingProducts;

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
        <title>Relatórios - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Relatórios e Análises">
        {/* ============================================ */}
        {/* FILTROS DE RELATÓRIO */}
        {/* ============================================ */}
        <ReportFilters
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onStartDateChange={(date) =>
            setDateRange({ ...dateRange, startDate: date })
          }
          onEndDateChange={(date) =>
            setDateRange({ ...dateRange, endDate: date })
          }
          onApply={() => {}}
        />

        {/* ============================================ */}
        {/* BOTÕES — EXPORTAÇÃO */}
        {/* ============================================ */}
        <div className="mb-6 flex justify-end">
          <ExportButton filters={dateRange} />
        </div>

        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}
        {loading && (
          <LoadingSpinner size="lg" text="Carregando relatórios..." />
        )}

        {/* ============================================ */}
        {/* CONTEÚDO */}
        {/* ============================================ */}
        {!loading && (
          <>
            {/* ============================================ */}
            {/* CARDS — ESTATÍSTICAS */}
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
                title="Ticket Médio"
                value={formatCurrency(stats?.averageTicket || 0)}
                icon={TrendingUp}
                color="purple"
              />
              <StatsCard
                title="Produtos Vendidos"
                value={stats?.totalProducts || 0}
                icon={Package}
                color="orange"
              />
            </div>

            {/* ============================================ */}
            {/* GRÁFICO — VENDAS */}
            {/* ============================================ */}
            <div className="mb-8">
              <SalesChart data={salesData || []} />
            </div>

            {/* ============================================ */}
            {/* RANKING — TOP PRODUTOS */}
            {/* ============================================ */}
            <ChartCard title="Produtos Mais Vendidos">
              <div className="space-y-3">
                {topProducts?.map((product: any, index: number) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {product.product_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.total_quantity} unidades vendidas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(product.total_revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </>
        )}
      </AdminLayout>
    </>
  );
}
