// ============================================
// PÁGINA: GESTÃO DE ESTOQUE (ADMIN)
// ============================================
// Controle de ingredientes e alertas
// Movimentações de entrada e saída
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api.service";
import { Package, AlertTriangle } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function AdminEstoquePage() {
  // ============================================
  // ESTADO - FILTROS
  // ============================================
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  // ============================================
  // BUSCAR INGREDIENTES
  // ============================================
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-ingredients", filter],
    queryFn: async () => {
      const response = await api.get("/ingredient", {
        params: filter !== "all" ? { filter } : {},
      });
      return response.data;
    },
  });

  // ============================================
  // BUSCAR ALERTAS DE ESTOQUE
  // ============================================
  const { data: alertsData } = useQuery({
    queryKey: ["stock-alerts"],
    queryFn: async () => {
      const response = await api.get("/ingredient/alerts");
      return response.data;
    },
  });

  const ingredients = data?.ingredients || [];
  const alerts = alertsData?.alerts || [];

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Gestão de Estoque - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Gestão de Estoque">
        {/* ============================================ */}
        {/* ALERTAS DE ESTOQUE */}
        {/* ============================================ */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800">
                {alerts.length} Alerta{alerts.length > 1 ? "s" : ""} de Estoque
              </h3>
            </div>

            <div className="space-y-2">
              {alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white rounded"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {alert.ingredient_name}
                    </p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.type === "out_of_stock"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {alert.type === "out_of_stock"
                      ? "Sem Estoque"
                      : "Estoque Baixo"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* FILTROS */}
        {/* ============================================ */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setFilter("low")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "low"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Estoque Baixo
          </button>

          <button
            onClick={() => setFilter("out")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "out"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sem Estoque
          </button>
        </div>

        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}
        {isLoading && <LoadingSpinner size="lg" text="Carregando estoque..." />}

        {/* ============================================ */}
        {/* TABELA DE INGREDIENTES */}
        {/* ============================================ */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ingrediente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Unidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mínimo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {ingredients.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">
                        {item.current_quantity}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{item.unit}</td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.minimum_quantity}
                    </td>

                    <td className="px-6 py-4">
                      {item.current_quantity === 0 ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Sem Estoque
                        </span>
                      ) : item.current_quantity <= item.minimum_quantity ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Estoque Baixo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
