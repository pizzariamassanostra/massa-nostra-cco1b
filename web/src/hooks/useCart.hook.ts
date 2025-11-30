// ============================================
// HOOK: USE CART
// ============================================
// Hook personalizado para usar CartContext
// Simplifica acesso ao carrinho
// ============================================

import { useCart as useCartContext } from "@/contexts/CartContext";

export const useCart = () => {
  return useCartContext();
};

export default useCart;
