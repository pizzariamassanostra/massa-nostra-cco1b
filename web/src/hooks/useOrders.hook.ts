// ============================================
// HOOK: USE ORDERS
// ============================================
// Hook para carregar pedidos com React Query
// Cache automático e revalidação
// ============================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { toast } from "react-hot-toast";

// ============================================
// HOOK: LISTAR MEUS PEDIDOS
// ============================================
export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderService.getMyOrders(),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// ============================================
// HOOK: BUSCAR PEDIDO POR ID
// ============================================
export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 segundos
  });
};

// ============================================
// HOOK: CRIAR PEDIDO (MUTATION)
// ============================================
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Pedido criado com sucesso! ");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.errors?.[0]?.userMessage ||
        "Erro ao criar pedido";
      toast.error(message);
    },
  });
};

// ============================================
// HOOK: CANCELAR PEDIDO (MUTATION)
// ============================================
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => orderService.cancel(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Pedido cancelado com sucesso");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.errors?.[0]?.userMessage ||
        "Erro ao cancelar pedido";
      toast.error(message);
    },
  });
};
