// ============================================
// PÁGINA: GESTÃO DE FORNECEDORES (ADMIN)
// ============================================
// Lista de fornecedores
// Pedidos de compra e cotações
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api.service";
import { Truck, Phone, Mail, MapPin, Search } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function AdminFornecedoresPage() {
  // ============================================
  // ESTADO - BUSCA
  // ============================================
  const [searchTerm, setSearchTerm] = useState("");

  // ============================================
  // BUSCAR FORNECEDORES
  // ============================================
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-suppliers", searchTerm],
    queryFn: async () => {
      const response = await api.get("/supplier", {
        params: { search: searchTerm },
      });
      return response.data;
    },
  });

  const suppliers = data?.suppliers || [];

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Fornecedores - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Gerenciar Fornecedores">
        {/* ============================================ */}
        {/* BUSCA DE FORNECEDORES */}
        {/* ============================================ */}
        <div className="mb-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando fornecedores..." />
        )}

        {/* ============================================ */}
        {/* GRID DE FORNECEDORES */}
        {/* ============================================ */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier: any) => (
              <div
                key={supplier.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* HEADER DO CARD */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {supplier.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      CNPJ: {supplier.cnpj}
                    </p>
                  </div>
                </div>

                {/* CONTATOS */}
                <div className="space-y-2 text-sm">
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {supplier.email}
                    </div>
                  )}

                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {supplier.phone}
                    </div>
                  )}

                  {supplier.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {supplier.address}
                    </div>
                  )}
                </div>

                {/* STATUS */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      supplier.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {supplier.is_active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* EMPTY STATE */}
        {/* ============================================ */}
        {!isLoading && suppliers.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum fornecedor encontrado</p>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
