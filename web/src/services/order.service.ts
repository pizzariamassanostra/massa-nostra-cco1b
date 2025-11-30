// ============================================
// SERVICE: PEDIDOS
// ============================================
// Serviço de criação, listagem e gerenciamento de pedidos
// ============================================

import api from "./api.service";

// ============================================
// INTERFACES
// ============================================

interface OrderItem {
  product_id: number;
  variant_id: number;
  crust_id?: number;
  filling_id?: number;
  quantity: number;
  notes?: string;
}

interface CreateOrderDto {
  address_id: number;
  items: OrderItem[];
  payment_method: "pix" | "dinheiro" | "cartao_debito" | "cartao_credito";
  notes?: string;
}

interface Order {
  id: number;
  common_user_id: number;
  address_id: number;
  status: string;
  subtotal: string;
  delivery_fee: string;
  discount: string;
  total: string;
  payment_method: string;
  payment_reference: string | null;
  delivery_token: string;
  notes: string | null;
  estimated_time: number;
  created_at: string;
  updated_at: string;
  user?: any;
  address?: any;
  items?: any[];
}

class OrderService {
  // ============================================
  // CRIAR PEDIDO
  // ============================================
  // Cria um novo pedido com os itens do carrinho
  // Requer autenticação (pega customer_id do JWT)
  async create(
    data: CreateOrderDto
  ): Promise<{ ok: boolean; message: string; order: Order }> {
    const response = await api.post("/order", data);
    return response.data;
  }

  // ============================================
  // LISTAR MEUS PEDIDOS
  // ============================================
  // Retorna todos os pedidos do usuário logado
  async getMyOrders(): Promise<{ ok: boolean; orders: Order[] }> {
    const response = await api.get("/order/my-orders");
    return response.data;
  }

  // ============================================
  // BUSCAR PEDIDO POR ID
  // ============================================
  // Retorna detalhes completos de um pedido específico
  async getById(id: number): Promise<{ ok: boolean; order: Order }> {
    const response = await api.get(`/order/${id}`);
    return response.data;
  }

  // ============================================
  // CANCELAR PEDIDO
  // ============================================
  // Cancela um pedido (apenas se status = pendente ou confirmado)
  async cancel(id: number): Promise<{ ok: boolean; message: string }> {
    const response = await api.post(`/order/${id}/cancel`);
    return response.data;
  }

  // ============================================
  // VALIDAR TOKEN DE ENTREGA
  // ============================================
  // Valida o token de 6 dígitos na entrega
  async validateToken(
    orderId: number,
    token: string
  ): Promise<{ ok: boolean; message: string }> {
    const response = await api.post(`/order/${orderId}/validate-token`, {
      token,
    });
    return response.data;
  }
}

export const orderService = new OrderService();
export type { CreateOrderDto, Order, OrderItem };
