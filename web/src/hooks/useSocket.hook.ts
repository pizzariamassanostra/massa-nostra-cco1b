// ============================================
// HOOK: USE SOCKET
// ============================================
// Gerencia conexão WebSocket com o backend.
// Escuta eventos de pedidos, pagamentos e notificações
// em tempo real para clientes e administradores.
// ============================================

import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

// ============================================
// HOOK PRINCIPAL
// ============================================
// Responsável por criar, manter e limpar a conexão
// WebSocket e expor eventos recebidos ao frontend.
// ============================================
export function useSocket() {
  // ============================================
  // ESTADOS DE CONEXÃO
  // ============================================
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // ============================================
  // ESTADOS DE EVENTOS RECEBIDOS
  // ============================================
  const [paymentApproved, setPaymentApproved] = useState<any>(null);
  const [orderPreparing, setOrderPreparing] = useState<any>(null);
  const [orderOnDelivery, setOrderOnDelivery] = useState<any>(null);
  const [orderDelivered, setOrderDelivered] = useState<any>(null);
  const [orderCancelled, setOrderCancelled] = useState<any>(null);
  const [newOrderForAdmin, setNewOrderForAdmin] = useState<any>(null);

  // ============================================
  // EFEITO: CONEXÃO COM WEBSOCKET
  // ============================================
  // Inicia conexão ao montar o componente e
  // encerra ao desmontar
  // ============================================
  useEffect(() => {
    // ============================================
    // DEFINIÇÃO DA URL BASE
    // ============================================
    // Prioriza variável pública do socket,
    // fallback para API ou origin do navegador
    // ============================================
    const socketBase =
      (process.env.NEXT_PUBLIC_SOCKET_URL as string) ||
      (process.env.NEXT_PUBLIC_API_URL as string) ||
      (typeof window !== "undefined" ? window.location.origin : "");

    // Remove barra final se existir
    const base = socketBase.replace(/\/$/, "");

    // ============================================
    // CRIAÇÃO DO SOCKET
    // ============================================
    const newSocket: Socket = io(`${base}/notifications`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // ============================================
    // EVENTOS DE CONEXÃO
    // ============================================

    newSocket.on("connect", () => {
      console.log("WebSocket conectado!", newSocket.id);
      setIsConnected(true);

      // Registrar usuário autenticado no socket
      const userToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (userId) {
        newSocket.emit("registerUser", { userId: parseInt(userId) });
        console.log(`Registrado usuário: ${userId}`);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket desconectado");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Erro ao conectar WebSocket:", error);
    });

    // ============================================
    // EVENTOS DE PEDIDOS E PAGAMENTOS
    // ============================================

    // Pagamento aprovado
    newSocket.on("paymentApproved", (data) => {
      console.log("🟢 Pagamento aprovado!", data);
      setPaymentApproved(data);
    });

    // Novo pedido para admin
    newSocket.on("newOrderForAdmin", (data) => {
      console.log("🟠 Novo pedido para admin!", data);
      setNewOrderForAdmin(data);
    });

    // Pedido em preparação
    newSocket.on("orderPreparing", (data) => {
      console.log("🟡 Pedido em preparação!", data);
      setOrderPreparing(data);
    });

    // Pedido saiu para entrega
    newSocket.on("orderOnDelivery", (data) => {
      console.log("🔵 Pedido saiu para entrega!", data);
      setOrderOnDelivery(data);
    });

    // Pedido entregue
    newSocket.on("orderDelivered", (data) => {
      console.log("Pedido entregue!", data);
      setOrderDelivered(data);
    });

    // Pedido cancelado
    newSocket.on("orderCancelled", (data) => {
      console.log("🔴 Pedido cancelado!", data);
      setOrderCancelled(data);
    });

    setSocket(newSocket);

    // ============================================
    // CLEANUP
    // ============================================
    // Encerra conexão ao desmontar o componente
    // ============================================
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ============================================
  // CALLBACKS DE LIMPEZA DE EVENTOS
  // ============================================
  const clearPaymentApproved = useCallback(() => {
    setPaymentApproved(null);
  }, []);

  const clearOrderPreparing = useCallback(() => {
    setOrderPreparing(null);
  }, []);

  const clearOrderOnDelivery = useCallback(() => {
    setOrderOnDelivery(null);
  }, []);

  const clearOrderDelivered = useCallback(() => {
    setOrderDelivered(null);
  }, []);

  // ============================================
  // RETORNO DO HOOK
  // ============================================
  return {
    socket,
    isConnected,

    // Eventos
    paymentApproved,
    orderPreparing,
    orderOnDelivery,
    orderDelivered,
    orderCancelled,
    newOrderForAdmin,

    // Callbacks
    clearPaymentApproved,
    clearOrderPreparing,
    clearOrderOnDelivery,
    clearOrderDelivered,
  };
}
