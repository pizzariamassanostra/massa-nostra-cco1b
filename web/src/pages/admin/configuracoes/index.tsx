// ============================================
// PÁGINA: CONFIGURAÇÕES (ADMIN)
// ============================================
// Configurações gerais do sistema
// Taxas, horários, etc
// ============================================

import React, { useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import { DollarSign, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

// ============================================
// COMPONENTE
// ============================================
export default function AdminConfiguracoesPage() {
  // ============================================
  // ESTADOS - CONFIGURAÇÕES
  // ============================================
  const [deliveryFee, setDeliveryFee] = useState(5.0);
  const [minOrderValue, setMinOrderValue] = useState(20.0);
  const [deliveryTime, setDeliveryTime] = useState(30);

  // ============================================
  // SALVAR CONFIGURAÇÕES
  // ============================================
  const handleSave = () => {
    // TODO: Implementar salvamento no backend
    toast.success("Configurações salvas com sucesso!");
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Configurações - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Configurações do Sistema">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ============================================ */}
          {/* TAXAS E VALORES */}
          {/* ============================================ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Taxas e Valores
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxa de Entrega (R$)
                </label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  step="0.50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pedido Mínimo (R$)
                </label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  step="1. 00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* TEMPO DE ENTREGA */}
          {/* ============================================ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Tempo de Entrega
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo Médio de Entrega (minutos)
              </label>
              <input
                type="number"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(Number(e.target.value))}
                step="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* ============================================ */}
          {/* AÇÕES */}
          {/* ============================================ */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
