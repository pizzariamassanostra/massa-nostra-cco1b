// ============================================
// INTERFACE: PEDIDO
// ============================================
// Define a estrutura de um pedido
// Sincronizado com a API NestJS
// ============================================

import { OrderStatus } from "../enum/order-status.enum";
import { PaymentMethod } from "../enum/payment-method.enum";
import { Product, ProductVariant, Crust, Filling } from "./product.interface";
import { Address } from "./address.interface";

export interface Order {
  id: number;
  common_user_id: number;
  address_id: number;
  status: OrderStatus;
  subtotal: string; // Decimal como string
  delivery_fee: string; // Decimal como string
  discount: string; // Decimal como string
  total: string; // Decimal como string
  payment_method: PaymentMethod;
  payment_reference: string | null;
  delivery_token: string; // Token de 6 dígitos
  notes: string | null;
  estimated_time: number; // Em minutos
  created_at: string;
  updated_at: string;

  // Relações
  user?: User;
  address?: Address;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  crust_id: number | null;
  filling_id: number | null;
  quantity: number;
  unit_price: string; // Decimal como string
  crust_price: string; // Decimal como string
  filling_price: string; // Decimal como string
  subtotal: string; // Decimal como string
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Relações
  product?: Product;
  variant?: ProductVariant;
  crust?: Crust;
  filling?: Filling;
}

export interface User {
  id: number;
  name: string;
  cpf: string;
  birth_date: string;
  phone: string;
  phone_alternative: string | null;
  email: string;
  accept_terms: boolean;
  accept_promotions: boolean;
  created_at: string;
  updated_at: string;
}

// DTO para criar pedido
export interface CreateOrderDto {
  address_id: number;
  items: {
    product_id: number;
    variant_id: number;
    crust_id?: number;
    filling_id?: number;
    quantity: number;
    notes?: string;
  }[];
  payment_method: PaymentMethod;
  notes?: string;
}
