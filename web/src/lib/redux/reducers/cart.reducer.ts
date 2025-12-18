// ============================================
// REDUX REDUCER: CART
// ============================================
// Gerencia o estado global do carrinho de compras
// incluindo itens, totais e valores de entrega.
// ============================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/contexts/CartContext";

// ============================================
// INTERFACE DE ESTADO
// ============================================
// Estrutura do estado do carrinho no Redux
// ============================================
interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

// ============================================
// ESTADO INICIAL
// ============================================
// Estado padrão do carrinho ao iniciar a aplicação
// ============================================
const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  deliveryFee: 5,
  total: 0,
};

// ============================================
// SLICE DO REDUX
// ============================================
// Define reducers e actions relacionadas ao carrinho
// ============================================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ============================================
    // ADICIONAR ITEM AO CARRINHO
    // ============================================
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.total_price =
          existingItem.unit_price * existingItem.quantity;
      } else {
        state.items.push(action.payload);
      }

      // Recalcular totais
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.total_price,
        0
      );
      state.total = state.subtotal + state.deliveryFee;
    },

    // ============================================
    // REMOVER ITEM DO CARRINHO
    // ============================================
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Recalcular totais
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.total_price,
        0
      );
      state.total = state.subtotal + state.deliveryFee;
    },

    // ============================================
    // ATUALIZAR QUANTIDADE DE UM ITEM
    // ============================================
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);

      if (item) {
        item.quantity = action.payload.quantity;
        item.total_price = item.unit_price * item.quantity;
      }

      // Recalcular totais
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.total_price,
        0
      );
      state.total = state.subtotal + state.deliveryFee;
    },

    // ============================================
    // LIMPAR CARRINHO
    // ============================================
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.total = state.deliveryFee;
    },
  },
});

// ============================================
// EXPORTAÇÕES
// ============================================
// Actions e reducer do carrinho
// ============================================
export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
