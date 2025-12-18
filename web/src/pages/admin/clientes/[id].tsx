// ============================================
// PÁGINA: DETALHES DO CLIENTE (ADMIN)
// ============================================
// Visualização completa de cliente
// Histórico de pedidos
// ============================================

import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import CustomerStats from "@/components/admin/Customers/CustomerStats";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import StatusBadge from "@/components/admin/Orders/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api.service";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ============================================
// COMPONENTE
// ============================================
export default function AdminClienteDetalhesPage() {
  // ============================================
  // ROTEAMENTO
  // ============================================
  const router = useRouter();
  const { id } = router.query;

  // ============================================
  // BUSCAR CLIENTE
  // ============================================
  const { data: customer, isLoading } = useQuery({
    queryKey: ["admin-customer", id],
    queryFn: async () => {
      const response = await api.get(`/common-user/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // ============================================
  // BUSCAR PEDIDOS DO CLIENTE
  // ============================================
  const { data: ordersData } = useQuery({
    queryKey: ["customer-orders", id],
    queryFn: async () => {
      const response = await api.get(`/order/user/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // ============================================
  // HELPERS
  // ============================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  // ============================================
  // ESTADOS DE LOADING / ERRO
  // ============================================
  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Cliente">
        <LoadingSpinner size="lg" text="Carregando cliente..." />
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout title="Detalhes do Cliente">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">Cliente não encontrado</p>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // DADOS DERIVADOS
  // ============================================
  const orders = ordersData?.orders || [];
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum: number, order: any) => sum + order.total,
    0
  );
  const averageTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastOrderDate = orders[0]?.created_at;

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>{customer.name} - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title={customer.name}>
        {/* ============================================ */}
        {/* VOLTAR */}
        {/* ============================================ */}
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Clientes
        </Link>

        {/* ============================================ */}
        {/* INFORMAÇÕES DO CLIENTE */}
        {/* ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl text-red-600 font-bold">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {customer.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5" />
                  {customer.email}
                </div>

                {customer.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5" />
                    {customer.phone}
                  </div>
                )}

                {customer.cpf && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-5 h-5" />
                    CPF: {customer.cpf}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* ESTATÍSTICAS */}
        {/* ============================================ */}
        <div className="mb-6">
          <CustomerStats
            totalOrders={totalOrders}
            totalSpent={totalSpent}
            averageTicket={averageTicket}
            lastOrderDate={lastOrderDate}
          />
        </div>

        {/* ============================================ */}
        {/* HISTÓRICO DE PEDIDOS */}
        {/* ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Histórico de Pedidos
          </h3>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Cliente ainda não fez pedidos
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/pedidos/${order.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      Pedido #{order.id}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
