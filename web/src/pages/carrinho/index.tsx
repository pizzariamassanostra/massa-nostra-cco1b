// ============================================
// PÁGINA: CARRINHO
// ============================================
// Exibe todos os itens do carrinho
// Permite alterar quantidades e remover itens
// Botão para ir ao checkout
// ============================================

import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CarrinhoPage() {
  const { items, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // ============================================
  // IR PARA CHECKOUT
  // ============================================
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login? redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <>
      <Head>
        <title>Carrinho - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Meu Carrinho
            </h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? "item" : "itens"} no carrinho
            </p>
          </div>

          {/* Botão limpar carrinho */}
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Limpar Carrinho
            </button>
          )}
        </div>

        {/* ============================================ */}
        {/* CARRINHO VAZIO */}
        {/* ============================================ */}
        {items.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Adicione pizzas deliciosas ao seu carrinho para continuar
            </p>
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Ver Cardápio
            </Link>
          </div>
        )}

        {/* ============================================ */}
        {/* CARRINHO COM ITENS */}
        {/* ============================================ */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna esquerda: Lista de itens */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Botão continuar comprando */}
              <Link
                href="/cardapio"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Continuar Comprando
              </Link>
            </div>

            {/* Coluna direita: Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

                <CartSummary />

                {/* Botão finalizar pedido */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors mt-6 flex items-center justify-center gap-2"
                >
                  Finalizar Pedido
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Aviso se não estiver logado */}
                {!isAuthenticated && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Você será direcionado para fazer login
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
