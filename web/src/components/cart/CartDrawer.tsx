// ============================================
// COMPONENTE: DRAWER DO CARRINHO
// ============================================
// Drawer lateral que exibe itens do carrinho
// Abre/fecha com animação
// Mostra resumo e botão para checkout
// ============================================

import React from "react";
import { useCart } from "@/contexts/CartContext";
import { X, ShoppingCart } from "lucide-react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useRouter } from "next/router";

const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, totalItems } = useCart();
  const router = useRouter();

  // ============================================
  // IR PARA CHECKOUT
  // ============================================
  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <>
      {/* ============================================ */}
      {/* OVERLAY (FUNDO ESCURO) */}
      {/* ============================================ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* ============================================ */}
      {/* DRAWER (PAINEL LATERAL) */}
      {/* ============================================ */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* ============================================ */}
        {/* HEADER DO DRAWER */}
        {/* ============================================ */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold">
              Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
            </h2>
          </div>

          {/* Botão fechar */}
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ============================================ */}
        {/* CONTEÚDO (LISTA DE ITENS) */}
        {/* ============================================ */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            // Carrinho vazio
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-24 h-24 mb-4" />
              <p className="text-lg">Seu carrinho está vazio</p>
              <p className="text-sm">Adicione pizzas deliciosas! </p>
            </div>
          ) : (
            // Lista de itens
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* FOOTER (RESUMO E BOTÃO) */}
        {/* ============================================ */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Resumo de valores */}
            <CartSummary />

            {/* Botão finalizar pedido */}
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
