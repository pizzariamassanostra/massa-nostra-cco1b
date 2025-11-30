// ============================================
// COMPONENTE: RESUMO DO CARRINHO
// ============================================
// Exibe subtotal, taxa de entrega e total
// Formatação de valores em Real (R$)
// ============================================

import React from "react";
import { useCart } from "@/contexts/CartContext";

const CartSummary: React.FC = () => {
  const { subtotal, deliveryFee, total } = useCart();

  // ============================================
  // FORMATAR PREÇO EM REAL
  // ============================================
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="space-y-2">
      {/* ============================================ */}
      {/* SUBTOTAL */}
      {/* ============================================ */}
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {/* ============================================ */}
      {/* TAXA DE ENTREGA */}
      {/* ============================================ */}
      <div className="flex justify-between text-gray-600">
        <span>Taxa de Entrega</span>
        <span>{formatPrice(deliveryFee)}</span>
      </div>

      {/* ============================================ */}
      {/* DIVISOR */}
      {/* ============================================ */}
      <div className="border-t pt-2" />

      {/* ============================================ */}
      {/* TOTAL */}
      {/* ============================================ */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-red-600">{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
