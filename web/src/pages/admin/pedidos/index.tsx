// ============================================
// PÁGINA ADMIN: PEDIDOS
// ============================================
// Lista todos os pedidos (admin)
// Filtros, busca, atualização de status
// ============================================

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Order } from "@/services/order.service";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { Loader, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminPedidosPage() {
  const [orders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      // TODO: Criar endpoint admin para listar todos os pedidos
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // CORRIGIDO: FORMATADOR DE PREÇO
  // Aceita string | number
  // Sempre retorna valor válido
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

  return (
    <>
      <Head>
        <title>Pedidos - Admin</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Pedidos</h1>

        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user?.name ?? "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatPrice(order.total)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created_at
                        ? format(
                            new Date(order.created_at),
                            "dd/MM/yyyy HH:mm",
                            { locale: ptBR }
                          )
                        : "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-red-600 hover:text-red-700">
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
