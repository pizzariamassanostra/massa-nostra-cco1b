// ============================================
// PÁGINA: DETALHES DO FORNECEDOR (ADMIN)
// ============================================
// Visualização completa de fornecedor
// Histórico de pedidos de compra
// ============================================

import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api.service";
import { ArrowLeft, Truck, Mail, Phone, MapPin } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function AdminFornecedorDetalhesPage() {
  const router = useRouter();
  const { id } = router.query;

  // ============================================
  // BUSCAR FORNECEDOR
  // ============================================
  const { data: supplier, isLoading } = useQuery({
    queryKey: ["admin-supplier", id],
    queryFn: async () => {
      const response = await api.get(`/supplier/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Fornecedor">
        <LoadingSpinner size="lg" text="Carregando fornecedor..." />
      </AdminLayout>
    );
  }

  // ============================================
  // ERRO / FORNECEDOR NÃO ENCONTRADO
  // ============================================
  if (!supplier) {
    return (
      <AdminLayout title="Detalhes do Fornecedor">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">
            Fornecedor não encontrado
          </p>
          <Link
            href="/admin/fornecedores"
            className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Voltar para Fornecedores
          </Link>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>{supplier.name} - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title={supplier.name}>
        {/* BOTÃO VOLTAR */}
        <Link
          href="/admin/fornecedores"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Fornecedores
        </Link>

        {/* INFORMAÇÕES DO FORNECEDOR */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {supplier.name}
              </h2>
              <p className="text-gray-600 mb-4">CNPJ: {supplier.cnpj}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplier.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5" />
                    {supplier.email}
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5" />
                    {supplier.phone}
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    {supplier.address}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    supplier.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {supplier.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PEDIDOS DE COMPRA */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Pedidos de Compra
          </h3>
          <p className="text-gray-500 text-center py-8">
            Nenhum pedido de compra registrado
          </p>
        </div>
      </AdminLayout>
    </>
  );
}
