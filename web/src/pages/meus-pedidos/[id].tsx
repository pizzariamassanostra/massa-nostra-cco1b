// ============================================
// PÁGINA: DETALHES DO PEDIDO
// ============================================
// Exibe informações completas de um pedido específico
// Timeline de status
// Token de entrega
// Opção de cancelar pedido
// ============================================

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Head from "next/head";
import { orderService, Order } from "@/services/order.service";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderTimeline from "@/components/order/OrderTimeline";
import { Loader, MapPin, CreditCard, Phone, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function DetalhePedidoPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();

  // ============================================
  // ESTADOS
  // ============================================
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // ============================================
  // CARREGAR PEDIDO
  // ============================================
  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(Number(id));
      setOrder(response.order);
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
      toast.error("Pedido não encontrado");
      router.push("/meus-pedidos");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  // ============================================
  // VERIFICAR AUTENTICAÇÃO
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login? redirect=/meus-pedidos");
      return;
    }

    if (id) {
      loadOrder();
    }
  }, [isAuthenticated, id, router, loadOrder]);

  // ============================================
  // CANCELAR PEDIDO
  // ============================================
  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmCancel = globalThis.confirm(
      "Tem certeza que deseja cancelar este pedido?  Esta ação não pode ser desfeita."
    );

    if (!confirmCancel) return;

    try {
      setCancelling(true);
      await orderService.cancel(order.id);
      toast.success("Pedido cancelado com sucesso");
      loadOrder();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.userMessage ||
        "Erro ao cancelar pedido";
      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  const formatPrice = (priceInCents: string) => {
    const price = Number.parseFloat(priceInCents) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // FORMATAR DATA
  // ============================================
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  // ============================================
  // TRADUZIR MÉTODO DE PAGAMENTO
  // ============================================
  const translatePaymentMethod = (method: string) => {
    const translations: Record<string, string> = {
      pix: "PIX",
      dinheiro: "Dinheiro",
      cartao_debito: "Cartão de Débito",
      cartao_credito: "Cartão de Crédito",
    };
    return translations[method] || method;
  };

  // ============================================
  // VERIFICAR SE PODE CANCELAR
  // ============================================
  const canCancel = order && ["pending", "confirmed"].includes(order.status);

  return (
    <>
      <Head>
        <title>Pedido #{id} - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* BOTÃO VOLTAR */}
        <Link
          href="/meus-pedidos"
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Meus Pedidos
        </Link>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        )}

        {/* CONTEÚDO DO PEDIDO */}
        {!loading && order && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Pedido #{order.id}
                  </h1>
                  <p className="text-gray-600">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Token de Entrega */}
              {order.status === "on_delivery" && order.delivery_token && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-4">
                  <h3 className="font-bold text-yellow-800 mb-2">
                    Token de Entrega:
                  </h3>
                  <p className="text-4xl font-bold text-yellow-900 tracking-widest mb-2">
                    {order.delivery_token}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Informe este código ao entregador ao receber seu pedido
                  </p>
                </div>
              )}

              {/* Botão Cancelar */}
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="mt-4 w-full md:w-auto bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelando..." : "Cancelar Pedido"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* COLUNA ESQUERDA: TIMELINE */}
              <div className="lg:col-span-2">
                <OrderTimeline status={order.status} />
              </div>

              {/* COLUNA DIREITA: DETALHES */}
              <div className="lg:col-span-1 space-y-6">
                {/* Itens do Pedido */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg mb-4">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={
                          item.id ??
                          item.product?.id ??
                          `${item.product?.name}-${item.quantity}`
                        }
                        className="border-b pb-3 last:border-b-0"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold">
                            {item.quantity}x {item.product?.name}
                          </span>
                          <span className="font-bold text-red-600">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.variant?.label}
                        </p>
                        {item.crust && (
                          <p className="text-xs text-gray-500">
                            Borda: {item.crust.name}
                          </p>
                        )}
                        {item.filling && (
                          <p className="text-xs text-gray-500">
                            Recheio: {item.filling.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa de Entrega</span>
                      <span className="font-semibold">
                        {formatPrice(order.delivery_fee)}
                      </span>
                    </div>
                    {Number.parseFloat(order.discount) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Desconto</span>
                        <span className="font-semibold text-green-600">
                          -{formatPrice(order.discount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-red-600">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Endereço de Entrega */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    Endereço de Entrega
                  </h3>

                  {order.address && (
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold">
                        {order.address.street}, {order.address.number}
                      </p>

                      {order.address.complement && (
                        <p>{order.address.complement}</p>
                      )}

                      <p>
                        {order.address.neighborhood}, {order.address.city}/
                        {order.address.state}
                      </p>

                      <p>CEP: {order.address.zip_code}</p>

                      {order.address.reference && (
                        <p className="text-gray-500 mt-2">
                          Ref: {order.address.reference}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Forma de Pagamento */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-red-600" />
                    Pagamento
                  </h3>
                  <p className="text-gray-700">
                    {translatePaymentMethod(order.payment_method)}
                  </p>
                </div>

                {/* Informações de Contato */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    Contato
                  </h3>
                  {order.user && (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <span className="font-semibold">Nome:</span>{" "}
                        {order.user.name}
                      </p>
                      <p>
                        <span className="font-semibold">Telefone:</span>{" "}
                        {order.user.phone}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {order.user.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
