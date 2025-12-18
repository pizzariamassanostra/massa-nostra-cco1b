// ============================================
// PÁGINA: DETALHES DO PEDIDO (ADMIN)
// ============================================
// Exibe todos os detalhes de um pedido
// Permite atualizar status
// Aceita string | number
// ============================================

// ============================================
// IMPORTAÇÕES
// ============================================
import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

// ============================================
// LAYOUT E COMPONENTES ADMIN
// ============================================
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import StatusBadge from "@/components/admin/Orders/StatusBadge";

// ============================================
// REACT QUERY
// ============================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ============================================
// SERVIÇOS
// ============================================
import { orderService } from "@/services/order.service";
import { adminService } from "@/services/admin/admin.service";

// ============================================
// UTILIDADES
// ============================================
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ============================================
// ÍCONES
// ============================================
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Package,
  Printer,
} from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function AdminPedidoDetalhesPage() {
  // ============================================
  // ROUTER / QUERY CLIENT
  // ============================================
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  // ============================================
  // BUSCAR PEDIDO
  // ============================================
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      const response = await orderService.getById(Number(id));
      return response;
    },
    enabled: !!id,
  });

  // ============================================
  // ATUALIZAR STATUS DO PEDIDO
  // ============================================
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      adminService.updateOrderStatus(Number(id), newStatus),
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar status");
    },
  });

  // ============================================
  // IMPRIMIR COMPROVANTE
  // ============================================
  const handlePrintReceipt = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/receipt/order/${id}/pdf`,
      "_blank"
    );
  };

  // ============================================
  // FORMATADORES
  // ============================================
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? Number(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue / 100);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Pedido">
        <LoadingSpinner size="lg" text="Carregando pedido..." />
      </AdminLayout>
    );
  }

  // ============================================
  // ERRO OU PEDIDO NÃO ENCONTRADO
  // ============================================
  if (error || !order) {
    return (
      <AdminLayout title="Detalhes do Pedido">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">Pedido não encontrado</p>
          <Link
            href="/admin/pedidos"
            className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Voltar para Pedidos
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
        <title>Pedido #{order.id} - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title={`Pedido #${order.id}`}>
        {/* ============================================ */}
        {/* BOTÃO VOLTAR */}
        {/* ============================================ */}
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Pedidos
        </Link>

        {/* ============================================ */}
        {/* HEADER DO PEDIDO */}
        {/* ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Pedido #{order.id}
              </h2>
              <p className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={order.status} />
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* GRID PRINCIPAL */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============================================ */}
          {/* COLUNA ESQUERDA - ITENS DO PEDIDO */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Itens do Pedido
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-4 flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.quantity}x{" "}
                        {item.product_name || item.product?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.variant_label || item.variant?.label}
                        {item.crust_name && ` - Borda: ${item.crust_name}`}
                        {item.filling_name &&
                          ` - Recheio: ${item.filling_name}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(
                          item.total_price || item.unit_price * item.quantity
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.unit_price)} un.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-red-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================ */}
            {/* ATUALIZAR STATUS DO PEDIDO */}
            {/* ============================================ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Atualizar Status
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { value: "confirmed", label: "Confirmar" },
                  { value: "preparing", label: "Em Preparo" },
                  { value: "out_for_delivery", label: "Saiu p/ Entrega" },
                  { value: "delivered", label: "Entregue" },
                  { value: "cancelled", label: "Cancelar" },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => updateStatusMutation.mutate(status.value)}
                    disabled={
                      updateStatusMutation.isPending ||
                      order.status === status.value
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      order.status === status.value
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    }`}
                  >
                    {updateStatusMutation.isPending ? "..." : status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* COLUNA DIREITA - INFORMAÇÕES DO PEDIDO */}
          {/* ============================================ */}
          <div className="space-y-6">
            {/* ============================================ */}
            {/* CLIENTE */}
            {/* ============================================ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800">Cliente</h3>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">
                  {order.user?.name || "Cliente"}
                </p>
                <p className="text-gray-600">{order.user?.email || "—"}</p>
                <p className="text-gray-600">{order.user?.phone || "—"}</p>
              </div>
            </div>

            {/* ============================================ */}
            {/* ENDEREÇO DE ENTREGA */}
            {/* ============================================ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800">Endereço</h3>
              </div>

              {order.delivery_address ? (
                <p className="text-sm text-gray-900">
                  {order.delivery_address.street},{" "}
                  {order.delivery_address.number}
                  {order.delivery_address.complement &&
                    ` - ${order.delivery_address.complement}`}
                  <br />
                  {order.delivery_address.neighborhood},{" "}
                  {order.delivery_address.city}/{order.delivery_address.state}
                  <br />
                  CEP: {order.delivery_address.zip_code}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Endereço não disponível</p>
              )}
            </div>

            {/* ============================================ */}
            {/* PAGAMENTO */}
            {/* ============================================ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800">Pagamento</h3>
              </div>

              <p className="text-sm text-gray-900">
                {order.payment_method?.toUpperCase() || "PIX"}
              </p>
            </div>

            {/* ============================================ */}
            {/* TOKEN DE ENTREGA */}
            {/* ============================================ */}
            {order.delivery_token && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-800 mb-2">
                  Token de Entrega
                </h3>
                <p className="text-3xl font-bold text-yellow-800">
                  {order.delivery_token}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Cliente deve informar este código para receber o pedido
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
