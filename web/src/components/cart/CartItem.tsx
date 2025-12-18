// ============================================
// COMPONENTE: ITEM DO CARRINHO
// ============================================
// Responsável por exibir um item individual do carrinho
// Permite alterar quantidade e remover o produto
// ============================================

import React from "react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface CartItemProps {
  item: CartItemType; // Item do carrinho
}

// ============================================
// COMPONENTE: CartItem
// ============================================
const CartItem: React.FC<CartItemProps> = ({ item }) => {
  // ============================================
  // CONTEXTO DO CARRINHO
  // ============================================
  const { updateQuantity, removeItem } = useCart();

  // ============================================
  // FUNÇÃO: Formatar preço em Real (BRL)
  // ============================================
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // FUNÇÃO: Aumentar quantidade do item
  // ============================================
  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  // ============================================
  // FUNÇÃO: Diminuir quantidade do item
  // ============================================
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      // Remove item caso quantidade chegue a zero
      removeItem(item.id);
    }
  };

  // ============================================
  // FUNÇÃO: Remover item do carrinho
  // ============================================
  const handleRemove = () => {
    removeItem(item.id);
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      {/* ============================================ */}
      {/* IMAGEM DO PRODUTO */}
      {/* ============================================ */}
      <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {item.product_image ? (
          <Image
            src={item.product_image}
            alt={item.product_name}
            fill
            className="object-cover"
          />
        ) : (
          // Placeholder quando não há imagem
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            🍕
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* INFORMAÇÕES DO PRODUTO */}
      {/* ============================================ */}
      <div className="flex-1">
        {/* NOME DO PRODUTO */}
        <h3 className="font-semibold text-gray-800">{item.product_name}</h3>

        {/* VARIANTE / TAMANHO */}
        <p className="text-sm text-gray-600">{item.variant_label}</p>

        {/* BORDA (SE EXISTIR) */}
        {item.crust_name && (
          <p className="text-xs text-gray-500">
            Borda: {item.crust_name} (+{formatPrice(item.crust_price)})
          </p>
        )}

        {/* RECHEIO (SE EXISTIR) */}
        {item.filling_name && (
          <p className="text-xs text-gray-500">
            Recheio: {item.filling_name} (+{formatPrice(item.filling_price)})
          </p>
        )}

        {/* ============================================ */}
        {/* CONTROLES DE QUANTIDADE E PREÇO */}
        {/* ============================================ */}
        <div className="flex items-center justify-between mt-2">
          {/* CONTROLE DE QUANTIDADE */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* PREÇO TOTAL DO ITEM */}
          <span className="font-bold text-red-600">
            {formatPrice(item.total_price)}
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* BOTÃO REMOVER ITEM */}
      {/* ============================================ */}
      <button
        onClick={handleRemove}
        className="text-red-600 hover:text-red-700 transition-colors"
        aria-label="Remover item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;
