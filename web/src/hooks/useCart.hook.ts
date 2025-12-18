// ============================================
// HOOK: USER CART
// ============================================
// Hook personalizado para usar CartContext
// Simplifica acesso ao carrinho
// ============================================

import { useCart as useCartContext } from "@/contexts/CartContext";

// ============================================
// HOOK: USE CART
// ============================================
export const useCart = () => {
  return useCartContext();
};

// ============================================
// EXPORTAÇÃO
// ============================================
export default useCart;
