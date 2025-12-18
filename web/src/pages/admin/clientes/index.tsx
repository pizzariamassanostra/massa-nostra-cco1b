// ============================================
// PÁGINA: LISTA DE CLIENTES (ADMIN)
// ============================================
// Lista todos os clientes
// Busca e filtros
// CORRIGIDO: Antes tinha código do Dashboard
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import CustomerTable from "@/components/admin/Customers/CustomerTable";
import Pagination from "@/components/admin/Common/Pagination";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin/admin.service";
import { Search, Users } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function AdminClientesPage() {
  // ============================================
  // ESTADOS
  // ============================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ============================================
  // BUSCAR CLIENTES
  // ============================================
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-customers", searchTerm, currentPage],
    queryFn: async () => {
      const response = await adminService.listCustomers({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      });
      return response;
    },
  });

  const customers = data?.users || [];
  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Clientes - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Gerenciar Clientes">
        {/* ============================================ */}
        {/* HEADER COM BUSCA E TOTAL */}
        {/* ============================================ */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{data?.total || 0} clientes</span>
          </div>
        </div>

        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando clientes..." />
        )}

        {/* ============================================ */}
        {/* ERRO */}
        {/* ============================================ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">
              Erro ao carregar clientes
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
        {/* TABELA E PAGINAÇÃO */}
        {/* ============================================ */}
        {!isLoading && !error && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Mostrando {customers.length} de {data?.total || 0} clientes
              </p>
            </div>

            <CustomerTable customers={customers} />

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
