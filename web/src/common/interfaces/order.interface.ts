// ============================================
// MODELOS / INTERFACES: PEDIDOS E RELACIONADOS
// ============================================

import { OrderStatus } from "../enum/order-status.enum";
import { PaymentMethod } from "../enum/payment-method.enum";
import { Product, ProductVariant, Crust, Filling } from "./product.interface";
import { Address } from "./address.interface";

// ============================================
// INTERFACE: Order (Pedido)
// ============================================
export interface Order {
  id: number; // ID do pedido
  common_user_id: number; // ID do usuário que realizou o pedido
  address_id: number; // ID do endereço selecionado
  status: OrderStatus; // Status atual do pedido
  subtotal: string; // Valor subtotal (decimal em string)
  delivery_fee: string; // Taxa de entrega (decimal em string)
  discount: string; // Desconto aplicado (decimal em string)
  total: string; // Valor total (decimal em string)
  payment_method: PaymentMethod; // Método de pagamento escolhido
  payment_reference: string | null; // Referência do pagamento (quando existir)
  delivery_token: string; // Token de rastreio (6 dígitos)
  notes: string | null; // Observações do pedido
  estimated_time: number; // Tempo estimado de entrega (minutos)
  created_at: string; // Data de criação
  updated_at: string; // Data da última atualização

  // Relações
  user?: User; // Dados do usuário
  address?: Address; // Endereço associado
  items?: OrderItem[]; // Itens do pedido
}

// ============================================
// INTERFACE: OrderItem (Item do Pedido)
// ============================================
export interface OrderItem {
  id: number; // ID do item
  order_id: number; // ID do pedido ao qual pertence
  product_id: number; // ID do produto
  variant_id: number; // ID da variação escolhida
  crust_id: number | null; // ID da borda (opcional)
  filling_id: number | null; // ID do recheio (opcional)
  quantity: number; // Quantidade do item
  unit_price: string; // Preço unitário (decimal em string)
  crust_price: string; // Preço da borda (decimal em string)
  filling_price: string; // Preço do recheio (decimal em string)
  subtotal: string; // Subtotal do item (decimal em string)
  notes: string | null; // Observações do item
  created_at: string; // Data de criação
  updated_at: string; // Data da última atualização

  // Relações
  product?: Product; // Produto associado
  variant?: ProductVariant; // Variação selecionada
  crust?: Crust; // Borda selecionada
  filling?: Filling; // Recheio selecionado
}

// ============================================
// INTERFACE: User (Usuário do Pedido)
// ============================================
export interface User {
  id: number; // ID do usuário
  name: string; // Nome completo
  cpf: string; // CPF
  birth_date: string; // Data de nascimento
  phone: string; // Telefone principal
  phone_alternative: string | null; // Telefone alternativo (opcional)
  email: string; // E-mail
  accept_terms: boolean; // Aceitou os termos de uso
  accept_promotions: boolean; // Aceitou receber promoções
  created_at: string; // Data de criação
  updated_at: string; // Data da última atualização
}

// ============================================
// DTO: CreateOrderDto (Criação de Pedido)
// ============================================
export interface CreateOrderDto {
  address_id: number; // Endereço selecionado
  items: {
    product_id: number; // Produto escolhido
    variant_id: number; // Variação selecionada
    crust_id?: number; // Borda (opcional)
    filling_id?: number; // Recheio (opcional)
    quantity: number; // Quantidade
    notes?: string; // Observações do item (opcional)
  }[];
  payment_method: PaymentMethod; // Método de pagamento
  notes?: string; // Observações gerais do pedido (opcional)
}
