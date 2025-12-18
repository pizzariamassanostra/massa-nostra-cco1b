// ============================================
// COMPONENTE: CARD DE PRODUTO
// ============================================
// Responsável por exibir um produto individual em formato de card.
// Suporta pizzas, bebidas e sobremesas.
// Exibe imagem, nome, descrição e menor preço disponível.
// Permite abrir o modal de seleção do produto.
// ============================================

import React, { useState } from "react";
import { Product } from "@/services/product.service";
import Image from "next/image";
import ProductModal from "./ProductModal";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface ProductCardProps {
  product: Product; // Dados do produto exibido no card
}

// ============================================
// COMPONENTE
// ============================================
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla abertura do modal

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  // Recebe valor em centavos (string)
  // Converte para número, divide por 100 e formata em BRL
  const formatPrice = (priceInCents: string) => {
    const price = parseFloat(priceInCents) / 100; // Converte centavos para reais
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // PEGAR MENOR PREÇO
  // ============================================
  // Caso o produto tenha variações:
  // - Extrai os preços
  // - Retorna o menor valor formatado
  const getLowestPrice = () => {
    if (!product.variants || product.variants.length === 0) {
      return "R$ 0,00"; // Fallback de segurança
    }

    const prices = product.variants.map((v) => parseFloat(v.price)); // Lista de preços
    const lowestPrice = Math.min(...prices); // Menor valor encontrado

    return formatPrice(lowestPrice.toString());
  };

  // ============================================
  // ABRIR MODAL
  // ============================================
  const handleOpenModal = () => {
    setIsModalOpen(true); // Abre modal de seleção
  };

  // ============================================
  // FECHAR MODAL
  // ============================================
  const handleCloseModal = () => {
    setIsModalOpen(false); // Fecha modal de seleção
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
          onClick={handleOpenModal} // Clique na imagem abre o modal
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          ) : (
            // Placeholder exibido quando não há imagem cadastrada
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
          {/* Nome do produto */}
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {product.name}
          </h3>

          {/* Descrição resumida */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* ============================================ */}
          {/* PREÇO E BOTÃO */}
          {/* ============================================ */}
          <div className="flex items-center justify-between">
            {/* Área de preço */}
            <div>
              <span className="text-xs text-gray-500">A partir de</span>
              <p className="text-xl font-bold text-red-600">
                {getLowestPrice()}
              </p>
            </div>

            {/* Botão para abrir modal */}
            <button
              onClick={handleOpenModal} // Abre modal de seleção
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL DE SELEÇÃO DO PRODUTO */}
      {/* ============================================ */}
      {isModalOpen && (
        <ProductModal
          product={product} // Produto selecionado
          isOpen={isModalOpen} // Estado do modal
          onClose={handleCloseModal} // Callback de fechamento
        />
      )}
    </>
  );
};

// ============================================
// EXPORTAÇÃO
// ============================================
export default ProductCard;
