// ============================================
// PÁGINA ADMIN: PEDIDOS
// ============================================
// Lista todos os pedidos (admin)
// Filtros, busca, atualização de status
// INTEGRADO COM PAINEL ADMIN
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import OrderTable from "@/components/admin/Orders/OrderTable";
import OrderFilters from "@/components/admin/Orders/OrderFilters";
import Pagination from "@/components/admin/Common/Pagination";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { orderService, Order } from "@/services/order.service";
import { toast } from "react-hot-toast";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader, Search } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function AdminPedidosPage() {
  // ============================================
  // ESTADOS - FILTROS
  // ============================================
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    paymentMethod: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // ============================================
  // BUSCAR PEDIDOS
  // ============================================
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders", filters, currentPage, searchTerm],
    queryFn: async () => {
      const response = await orderService.getAll({
        ...filters,
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      });
      return response;
    },
  });

  // ============================================
  // ATUALIZAR FILTRO
  // ============================================
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1); // Voltar para primeira página
  };

  // ============================================
  // IMPRIMIR COMPROVANTE
  // ============================================
  const handlePrintReceipt = async (orderId: number) => {
    try {
      // Abrir PDF em nova aba
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/receipt/order/${orderId}/pdf`,
        "_blank"
      );
      toast.success("Abrindo comprovante...");
    } catch (error) {
      console.error("Erro ao abrir comprovante:", error);
      toast.error("Erro ao abrir comprovante");
    }
  };

  // ================================
  // FORMATADOR DE PREÇO
  // Aceita string | number
  // Sempre retorna valor válido
  // MANTIDO DO CÓDIGO ORIGINAL
  // ================================
  const formatPrice = (priceInCents: string | number): string => {
    const value = Number(priceInCents);

    if (Number.isNaN(value)) {
      return "R$ 0,00";
    }

    const price = value / 100;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // PREPARAR DADOS PARA TABELA
  // ============================================
  const orders = (data?.orders || []).map((order: Order) => ({
    id: order.id,
    order_number: `ORD-${order.id}`,
    customer_name: order.user?.name ?? "Cliente",
    total: Number(order.total) / 100, // Converter centavos para reais
    status: order.status,
    payment_method: order.payment_method || "pix",
    created_at: order.created_at,
    delivery_address: order.delivery_address
      ? `${order.delivery_address.street}, ${order.delivery_address.number}`
      : undefined,
  }));

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  // ============================================
  // RENDER - COM ADMINLAYOUT
  // ============================================
  return (
    <>
      <Head>
        <title>Pedidos - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Gerenciar Pedidos">
        {/* ============================================ */}
        {/* BUSCA RÁPIDA (MANTIDA DO CÓDIGO ORIGINAL) */}
        {/* ============================================ */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* FILTROS AVANÇADOS */}
        {/* ============================================ */}
        <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        )}

        {/* ============================================ */}
        {/* ERRO */}
        {/* ============================================ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
            <p className="text-red-600 font-semibold">
              Erro ao carregar pedidos
            </p>
            <p className="text-sm text-red-500 mt-2">
              {(error as any)?.message}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* TABELA DE PEDIDOS */}
        {/* ============================================ */}
        {!loading && !error && (
          <>
            {/* Informações */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {orders.length} de {data?.total || 0} pedidos
              </p>
            </div>

            {/* Tabela */}
            <OrderTable orders={orders} onPrintReceipt={handlePrintReceipt} />

            {/* Paginação */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </AdminLayout>
    </>
  );
}
