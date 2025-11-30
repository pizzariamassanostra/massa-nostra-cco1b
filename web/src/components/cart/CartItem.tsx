// ============================================
// COMPONENTE: ITEM DO CARRINHO
// ============================================
// Exibe um item do carrinho com imagem, nome, preço
// Botões para aumentar/diminuir quantidade
// Botão para remover
// ============================================

import React from "react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // AUMENTAR QUANTIDADE
  // ============================================
  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  // ============================================
  // DIMINUIR QUANTIDADE
  // ============================================
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  // ============================================
  // REMOVER ITEM
  // ============================================
  const handleRemove = () => {
    removeItem(item.id);
  };

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
          // Placeholder se não tiver imagem
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            🍕
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* INFORMAÇÕES DO PRODUTO */}
      {/* ============================================ */}
      <div className="flex-1">
        {/* Nome do produto */}
        <h3 className="font-semibold text-gray-800">{item.product_name}</h3>

        {/* Tamanho */}
        <p className="text-sm text-gray-600">{item.variant_label}</p>

        {/* Borda (se tiver) */}
        {item.crust_name && (
          <p className="text-xs text-gray-500">
            Borda: {item.crust_name} (+{formatPrice(item.crust_price)})
          </p>
        )}

        {/* Recheio (se tiver) */}
        {item.filling_name && (
          <p className="text-xs text-gray-500">
            Recheio: {item.filling_name} (+{formatPrice(item.filling_price)})
          </p>
        )}

        {/* ============================================ */}
        {/* CONTROLES DE QUANTIDADE E PREÇO */}
        {/* ============================================ */}
        <div className="flex items-center justify-between mt-2">
          {/* Botões de quantidade */}
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

          {/* Preço total do item */}
          <span className="font-bold text-red-600">
            {formatPrice(item.total_price)}
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* BOTÃO REMOVER */}
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
