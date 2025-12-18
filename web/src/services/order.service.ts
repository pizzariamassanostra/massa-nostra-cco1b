// ============================================
// SERVIÇO: PEDIDOS
// ============================================
// Responsável por gerenciar pedidos da aplicação
// Inclui criação, consulta, cancelamento e validação
// ============================================

import api from "./api.service";

// ============================================
// INTERFACES DE TIPOS
// Estruturas de dados utilizadas para pedidos
// ============================================

// Estrutura de endereço de entrega
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference?: string;
}

// Estrutura de usuário associado ao pedido
export interface User {
  name: string;
  email: string;
  phone?: string;
}

// Estrutura de item do pedido
export interface OrderItem {
  id?: number;
  product?: {
    id?: number;
    name: string;
  };
  product_name?: string;
  variant?: {
    label: string;
  };
  variant_label?: string;
  quantity: number;
  subtotal: string | number;
  unit_price?: number;
  total_price?: number;
  crust?: {
    name: string;
  };
  crust_name?: string;
  filling?: {
    name: string;
  };
  filling_name?: string;
}

// Estrutura completa de pedido
export interface Order {
  id: number;
  order_number?: string;
  user?: User;
  status: string;
  payment_method: string;
  total: number | string;
  subtotal?: number | string;
  delivery_fee?: number | string;
  discount?: number | string;
  created_at: string;
  delivery_address?: Address; // Renomeado de 'address'
  address?: Address; // Mantido para compatibilidade
  delivery_token?: string;
  items?: OrderItem[];
  estimated_time?: number;
}

// Estrutura para criação de pedido
export interface CreateOrderDto {
  address_id: number;
  items: {
    product_id: number;
    variant_id: number;
    crust_id?: number;
    filling_id?: number;
    quantity: number;
  }[];
  payment_method: "pix" | "dinheiro" | "cartao_debito" | "cartao_credito";
}

// ============================================================================
// CLASSE DE SERVIÇO
// Responsável por fazer todas as requisições relacionadas a pedidos
// ============================================================================
class OrderService {
  // Criar novo pedido
  async create(data: CreateOrderDto) {
    const response = await api.post("/order", data);
    return response.data;
  }

  // Buscar pedido específico pelo ID
  async getById(id: number): Promise<Order> {
    const response = await api.get(`/order/${id}`);
    return response.data.order || response.data;
  }

  // Buscar pedidos do usuário logado
  async getMyOrders() {
    const response = await api.get("/order/my-orders");
    return response.data;
  }

  // Buscar todos os pedidos (ADMIN)
  async getAll(params?: {
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> {
    const response = await api.get("/order", { params });
    return {
      orders: response.data.orders || response.data,
      total: response.data.total || response.data.length || 0,
    };
  }

  // Cancelar pedido
  async cancel(id: number) {
    const response = await api.post(`/order/${id}/cancel`);
    return response.data;
  }

  // Validar token de entrega
  async validateToken(id: number, token: string) {
    const response = await api.post(`/order/${id}/validate-token`, { token });
    return response.data;
  }
}

// ============================================
// EXPORTAR INSTÂNCIA ÚNICA
// ============================================
export const orderService = new OrderService();
