// ============================================
// PÁGINA: LISTA DE PRODUTOS (ADMIN)
// ============================================
// Lista todos os produtos
// Filtros, busca e ações administrativas
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import ProductTable from "@/components/admin/Products/ProductTable";
import Pagination from "@/components/admin/Common/Pagination";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api.service";
import { toast } from "react-hot-toast";
import { Plus, Search } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function AdminProdutosPage() {
  const queryClient = useQueryClient();

  // ============================================
  // ESTADOS
  // ============================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ============================================
  // BUSCAR PRODUTOS
  // ============================================
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-products", searchTerm, currentPage],
    queryFn: async () => {
      const response = await api.get("/product", {
        params: {
          search: searchTerm,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return response.data;
    },
  });

  // ============================================
  // MUTATION — TOGGLE STATUS
  // ============================================
  const toggleStatusMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.patch(`/product/${productId}/toggle-status`);
    },
    onSuccess: () => {
      toast.success("Status atualizado!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  // ============================================
  // MUTATION — DELETAR PRODUTO
  // ============================================
  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/product/${productId}`);
    },
    onSuccess: () => {
      toast.success("Produto excluído!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error("Erro ao excluir produto");
    },
  });

  // ============================================
  // AÇÕES
  // ============================================
  const handleDelete = (productId: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteMutation.mutate(productId);
    }
  };

  // ============================================
  // DADOS DERIVADOS
  // ============================================
  const products = data?.products || [];
  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Produtos - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Gerenciar Produtos">
        {/* ============================================ */}
        {/* HEADER — BUSCA E AÇÃO */}
        {/* ============================================ */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <Link
            href="/admin/produtos/novo"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </Link>
        </div>

        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando produtos..." />
        )}

        {/* ============================================ */}
        {/* ERRO */}
        {/* ============================================ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">
              Erro ao carregar produtos
            </p>
          </div>
        )}

        {/* ============================================ */}
        {/* TABELA DE PRODUTOS */}
        {/* ============================================ */}
        {!isLoading && !error && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Mostrando {products.length} de {data?.total || 0} produtos
              </p>
            </div>

            <ProductTable
              products={products}
              onToggleStatus={(id) => toggleStatusMutation.mutate(id)}
              onDelete={handleDelete}
            />

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
