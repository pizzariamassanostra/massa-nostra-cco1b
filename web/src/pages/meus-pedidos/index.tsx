// ============================================
// PÁGINA: MEUS PEDIDOS
// ============================================
// Listagem de todos os pedidos do cliente
// Acompanhamento em tempo real com WebSocket
// Atualização automática de status
// ============================================

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { orderService, Order } from "@/services/order.service";
import { useSocket } from "@/hooks/useSocket.hook";
import OrderCard from "@/components/order/OrderCard";
import { Loader } from "lucide-react";

// ============================================
// COMPONENTE - MyOrdersPage
// ============================================
export default function MyOrdersPage() {
  // ============================================
  // ROUTER E AUTENTICAÇÃO
  // ============================================
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // ============================================
  // WEBSOCKET
  // ============================================
  // Deve ser chamado no topo do componente
  // ============================================
  const {
    isConnected,
    orderPreparing,
    orderOnDelivery,
    orderDelivered,
    clearOrderPreparing,
    clearOrderOnDelivery,
    clearOrderDelivered,
  } = useSocket();

  // ============================================
  // ESTADOS
  // ============================================
  // Controle da lista de pedidos, loading e filtro
  // ============================================
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // ============================================
  // REFS
  // ============================================
  // Evitam processamento duplicado de notificações
  // ============================================
  const lastProcessedPreparingRef = useRef<number | null>(null);
  const lastProcessedDeliveryRef = useRef<number | null>(null);
  const lastProcessedDeliveredRef = useRef<number | null>(null);

  // ============================================
  // FUNÇÃO: Carregar pedidos
  // ============================================
  // Busca todos os pedidos do usuário autenticado
  // ============================================
  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      toast.error("Erro ao carregar seus pedidos");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNÇÃO: Recarregar pedidos
  // ============================================
  // Utilizada para sincronização com WebSocket
  // ============================================
  const refetch = () => {
    loadOrders();
  };

  // ============================================
  // EFEITO: Validação de autenticação
  // ============================================
  // Redireciona para login se não autenticado
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/meus-pedidos");
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  // ============================================
  // EFEITO: WEBSOCKET - Pedido em preparação
  // ============================================
  // Atualiza status do pedido e notifica o usuário
  // ============================================
  useEffect(() => {
    if (orderPreparing && orderPreparing.order_id) {
      if (lastProcessedPreparingRef.current === orderPreparing.order_id) {
        return;
      }

      console.log("🟡 Pedido em preparação!", orderPreparing);
      lastProcessedPreparingRef.current = orderPreparing.order_id;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderPreparing.order_id
            ? { ...order, status: "preparing" }
            : order
        )
      );

      refetch();

      toast("Seu pedido está sendo preparado! 🍕", {
        icon: "🟡",
        duration: 3000,
      });

      setTimeout(() => {
        clearOrderPreparing();
        lastProcessedPreparingRef.current = null;
      }, 500);
    }
  }, [orderPreparing, clearOrderPreparing]);

  // ============================================
  // EFEITO: WEBSOCKET - Pedido saiu para entrega
  // ============================================
  // Atualiza status e token de entrega
  // ============================================
  useEffect(() => {
    if (orderOnDelivery && orderOnDelivery.order_id) {
      if (lastProcessedDeliveryRef.current === orderOnDelivery.order_id) {
        return;
      }

      console.log("🔵 Saiu para entrega!", orderOnDelivery);
      lastProcessedDeliveryRef.current = orderOnDelivery.order_id;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderOnDelivery.order_id
            ? {
                ...order,
                status: "on_delivery",
                delivery_token: orderOnDelivery.delivery_token,
              }
            : order
        )
      );

      refetch();

      toast("Seu pedido saiu para entrega!", {
        icon: "🔵",
        duration: 3000,
      });

      setTimeout(() => {
        clearOrderOnDelivery();
        lastProcessedDeliveryRef.current = null;
      }, 500);
    }
  }, [orderOnDelivery, clearOrderOnDelivery]);

  // ============================================
  // EFEITO: WEBSOCKET - Pedido entregue
  // ============================================
  // Atualiza status para entregue e notifica o usuário
  // ============================================
  useEffect(() => {
    if (orderDelivered && orderDelivered.order_id) {
      if (lastProcessedDeliveredRef.current === orderDelivered.order_id) {
        return;
      }

      console.log("Pedido entregue!", orderDelivered);
      lastProcessedDeliveredRef.current = orderDelivered.order_id;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderDelivered.order_id
            ? { ...order, status: "delivered" }
            : order
        )
      );

      refetch();

      toast.success("Pedido entregue! Deixe uma avaliação", {
        duration: 4000,
      });

      setTimeout(() => {
        clearOrderDelivered();
        lastProcessedDeliveredRef.current = null;
      }, 500);
    }
  }, [orderDelivered, clearOrderDelivered]);

  // ============================================
  // FILTRO DE PEDIDOS
  // ============================================
  // Filtra pedidos pelo status selecionado
  // ============================================
  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  // ============================================
  // RENDER: CARREGAMENTO
  // ============================================
  // Exibe loader enquanto os pedidos são carregados
  // ============================================
  if (loading) {
    return (
      <>
        <Head>
          <title>Meus Pedidos - Pizzaria Massa Nostra</title>
        </Head>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <Loader className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // RENDER: PRINCIPAL
  // ============================================
  // Exibe cabeçalho, filtros e lista de pedidos
  // ============================================
  return (
    <>
      <Head>
        <title>Meus Pedidos - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* ============================================ */}
        {/* CABEÇALHO */}
        {/* ============================================ */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-600">Acompanhe seus pedidos em tempo real</p>

          {/* ============================================ */}
          {/* INDICADOR DE CONEXÃO WEBSOCKET */}
          {/* ============================================ */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {isConnected
                ? "Recebendo atualizações em tempo real"
                : "Conectando..."}
            </span>
          </div>
        </div>

        {/* ============================================ */}
        {/* FILTROS POR STATUS */}
        {/* ============================================ */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedStatus === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedStatus("pending")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedStatus === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setSelectedStatus("confirmed")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedStatus === "confirmed"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Confirmados
          </button>
          <button
            onClick={() => setSelectedStatus("preparing")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedStatus === "preparing"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Preparando
          </button>
          <button
            onClick={() => setSelectedStatus("on_delivery")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedStatus === "on_delivery"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Em Entrega
          </button>
          <button
            onClick={() => setSelectedStatus("delivered")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedStatus === "delivered"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Entregues
          </button>
        </div>

        {/* ============================================ */}
        {/* LISTA DE PEDIDOS */}
        {/* ============================================ */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              Nenhum pedido encontrado nesta categoria
            </p>
            <button
              onClick={() => router.push("/cardapio")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Fazer um Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
