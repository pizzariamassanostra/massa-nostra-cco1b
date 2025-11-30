// ============================================
// REDUX REDUCER: CART
// ============================================
// Gerencia estado do carrinho no Redux
// ============================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/contexts/CartContext";

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  deliveryFee: 5,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.total = state.deliveryFee;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
