// ============================================
// COMPONENTE: CARD DE PRODUTO
// ============================================
// Exibe um produto (pizza, bebida, etc) em card
// Mostra imagem, nome, descrição, preços
// Botão para abrir modal de seleção
// ============================================

import React, { useState } from "react";
import { Product } from "@/services/product.service";
import Image from "next/image";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  // Preço vem em centavos (ex: "2500" = R$ 25,00)
  const formatPrice = (priceInCents: string) => {
    const price = parseFloat(priceInCents) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // PEGAR MENOR PREÇO
  // ============================================
  // Se produto tem variações, pega o menor preço
  const getLowestPrice = () => {
    if (!product.variants || product.variants.length === 0) {
      return "R$ 0,00";
    }

    const prices = product.variants.map((v) => parseFloat(v.price));
    const lowestPrice = Math.min(...prices);

    return formatPrice(lowestPrice.toString());
  };

  // ============================================
  // ABRIR MODAL
  // ============================================
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // ============================================
  // FECHAR MODAL
  // ============================================
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* ============================================ */}
      {/* CARD DO PRODUTO */}
      {/* ============================================ */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* ============================================ */}
        {/* IMAGEM DO PRODUTO */}
        {/* ============================================ */}
        <div
          className="relative h-48 bg-gray-200 overflow-hidden"
          onClick={handleOpenModal}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          ) : (
            // Placeholder se não tiver imagem
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {product.type === "pizza" && "🍕"}
              {product.type === "bebida" && "🥤"}
              {product.type === "sobremesa" && "🍰"}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* INFORMAÇÕES DO PRODUTO */}
        {/* ============================================ */}
        <div className="p-4">
          {/* Nome */}
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {product.name}
          </h3>

          {/* Descrição */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* ============================================ */}
          {/* PREÇO E BOTÃO */}
          {/* ============================================ */}
          <div className="flex items-center justify-between">
            {/* Preço */}
            <div>
              <span className="text-xs text-gray-500">A partir de</span>
              <p className="text-xl font-bold text-red-600">
                {getLowestPrice()}
              </p>
            </div>

            {/* Botão adicionar */}
            <button
              onClick={handleOpenModal}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL DE SELEÇÃO */}
      {/* ============================================ */}
      {isModalOpen && (
        <ProductModal
          product={product}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ProductCard;
