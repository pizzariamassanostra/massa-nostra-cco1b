import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

/**
 * ============================================
 * HOOK: useSocket
 * ============================================
 * Gerencia conexão WebSocket com o backend
 * Escuta eventos: pagamento aprovado, status mudanças, etc
 * ============================================
 */
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Estados para eventos recebidos
  const [paymentApproved, setPaymentApproved] = useState<any>(null);
  const [orderPreparing, setOrderPreparing] = useState<any>(null);
  const [orderOnDelivery, setOrderOnDelivery] = useState<any>(null);
  const [orderDelivered, setOrderDelivered] = useState<any>(null);
  const [orderCancelled, setOrderCancelled] = useState<any>(null);
  const [newOrderForAdmin, setNewOrderForAdmin] = useState<any>(null);

  // Conectar ao WebSocket quando componente monta
  useEffect(() => {
    // Conectar ao servidor WebSocket
    const newSocket = io("http://localhost:3001/notifications", {
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

      // Registrar userId do usuário logado
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
    // EVENTOS DE PEDIDOS
    // ============================================

    // 🟢 Pagamento aprovado
    newSocket.on("paymentApproved", (data) => {
      console.log("🟢 Pagamento aprovado!", data);
      setPaymentApproved(data);
    });

    // 🟠 Novo pedido para admin
    newSocket.on("newOrderForAdmin", (data) => {
      console.log("🟠 Novo pedido para admin!", data);
      setNewOrderForAdmin(data);
    });

    // 🟡 Pedido em preparação
    newSocket.on("orderPreparing", (data) => {
      console.log("🟡 Pedido em preparação!", data);
      setOrderPreparing(data);
    });

    // 🔵 Pedido saiu para entrega
    newSocket.on("orderOnDelivery", (data) => {
      console.log("🔵 Pedido saiu para entrega!", data);
      setOrderOnDelivery(data);
    });

    // ✅ Pedido entregue
    newSocket.on("orderDelivered", (data) => {
      console.log("✅ Pedido entregue!", data);
      setOrderDelivered(data);
    });

    // 🔴 Pedido cancelado
    newSocket.on("orderCancelled", (data) => {
      console.log("🔴 Pedido cancelado!", data);
      setOrderCancelled(data);
    });

    setSocket(newSocket);

    // Cleanup: desconectar ao desmontar
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Callback para limpar eventos
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
    // Callbacks para limpar
    clearPaymentApproved,
    clearOrderPreparing,
    clearOrderOnDelivery,
    clearOrderDelivered,
  };
}
