// ============================================
// COMPONENTE: MODAL DE SELEÇÃO DO PRODUTO
// ============================================
// Modal para selecionar tamanho, borda, recheio
// Calcula preço total automaticamente
// Adiciona item ao carrinho
// ============================================

import React, { useState, useEffect } from "react";
import { Product, Crust, Filling } from "@/services/product.service";
import { productService } from "@/services/product.service";
import { useCart } from "@/contexts/CartContext";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem } = useCart();

  // ============================================
  // ESTADOS
  // ============================================
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedCrust, setSelectedCrust] = useState<number | null>(null);
  const [selectedFilling, setSelectedFilling] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [crusts, setCrusts] = useState<Crust[]>([]);
  const [fillings, setFillings] = useState<Filling[]>([]);
  const [loading, setLoading] = useState(false);

  // ============================================
  // CARREGAR BORDAS E RECHEIOS (APENAS PARA PIZZAS)
  // ============================================
  useEffect(() => {
    if (product.type === "pizza") {
      loadCrustsAndFillings();
    }
  }, [product.type]);

  // ============================================
  // SELECIONAR PRIMEIRO TAMANHO AUTOMATICAMENTE
  // ============================================
  useEffect(() => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0].id);
    }
  }, [product.variants, selectedVariant]);

  // ============================================
  // CARREGAR BORDAS E RECHEIOS
  // ============================================
  const loadCrustsAndFillings = async () => {
    try {
      const [crustsData, fillingsData] = await Promise.all([
        productService.getCrusts(),
        productService.getFillings(),
      ]);

      setCrusts(crustsData.crusts);
      setFillings(fillingsData.fillings);

      if (crustsData.crusts.length > 0) {
        setSelectedCrust(crustsData.crusts[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar bordas e recheios:", error);
    }
  };

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  const formatPrice = (priceInCents: string | number) => {
    const price =
      typeof priceInCents === "string"
        ? parseFloat(priceInCents) / 100
        : priceInCents / 100;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // CALCULAR PREÇO TOTAL
  // ============================================
  const calculateTotalPrice = () => {
    let total = 0;

    // Preço da variação (tamanho)
    const variant = product.variants?.find((v) => v.id === selectedVariant);
    if (variant) {
      total += parseFloat(variant.price);
    }

    // Preço da borda
    const crust = crusts.find((c) => c.id === selectedCrust);
    if (crust) {
      total += parseFloat(crust.price_modifier);
    }

    const filling = fillings.find((f) => f.id === selectedFilling);
    if (filling) {
      total += parseFloat(filling.price);
    }

    return total / 100; // Converter de centavos para reais
  };

  // ============================================
  // ADICIONAR AO CARRINHO
  // ============================================
  const handleAddToCart = () => {
    // Validar se selecionou tamanho
    if (!selectedVariant) {
      toast.error("Selecione um tamanho");
      return;
    }

    const variant = product.variants?.find((v) => v.id === selectedVariant);
    const crust = crusts.find((c) => c.id === selectedCrust);
    const filling = fillings.find((f) => f.id === selectedFilling);

    if (!variant) return;

    // Gerar ID único do item
    const itemId = `${product.id}-${selectedVariant}-${selectedCrust || 0}-${
      selectedFilling || 0
    }`;

    // Calcular preços
    const variantPrice = parseFloat(variant.price) / 100;
    const crustPrice = crust ? parseFloat(crust.price_modifier) / 100 : 0;
    const fillingPrice = filling ? parseFloat(filling.price) / 100 : 0;
    const unitPrice = variantPrice + crustPrice + fillingPrice;

    // Criar item do carrinho
    const cartItem = {
      id: itemId,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      variant_id: variant.id,
      variant_label: variant.label,
      variant_price: variantPrice,
      crust_id: selectedCrust,
      crust_name: crust?.name || null,
      crust_price: crustPrice,
      filling_id: selectedFilling,
      filling_name: filling?.name || null,
      filling_price: fillingPrice,
      quantity,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
    };

    // Adicionar ao carrinho
    addItem(cartItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ============================================ */}
      {/* OVERLAY */}
      {/* ============================================ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* ============================================ */}
        {/* MODAL */}
        {/* ============================================ */}
        <div
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ============================================ */}
          {/* HEADER */}
          {/* ============================================ */}
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ============================================ */}
          {/* CONTEÚDO */}
          {/* ============================================ */}
          <div className="p-6 space-y-6">
            {/* Imagem */}
            {product.image_url && (
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Descrição */}
            <p className="text-gray-600">{product.description}</p>

            {/* ============================================ */}
            {/* SELEÇÃO DE TAMANHO */}
            {/* ============================================ */}
            <div>
              <h3 className="font-bold mb-3">Escolha o tamanho</h3>
              <div className="space-y-2">
                {product.variants?.map((variant) => (
                  <label
                    key={variant.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVariant === variant.id
                        ? "border-red-600 bg-red-50"
                        : "border-gray-300 hover:border-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        checked={selectedVariant === variant.id}
                        onChange={() => setSelectedVariant(variant.id)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <p className="font-semibold">{variant.label}</p>
                        <p className="text-sm text-gray-500">
                          {variant.servings}{" "}
                          {variant.servings === 1 ? "pedaço" : "pedaços"}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-red-600">
                      {formatPrice(variant.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ============================================ */}
            {/* SELEÇÃO DE BORDA (APENAS PIZZAS) */}
            {/* ============================================ */}
            {product.type === "pizza" && crusts.length > 0 && (
              <div>
                <h3 className="font-bold mb-3">Escolha a borda</h3>
                <div className="space-y-2">
                  {crusts.map((crust) => (
                    <label
                      key={crust.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCrust === crust.id
                          ? "border-red-600 bg-red-50"
                          : "border-gray-300 hover:border-red-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="crust"
                          value={crust.id}
                          checked={selectedCrust === crust.id}
                          onChange={() => setSelectedCrust(crust.id)}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-semibold">{crust.name}</p>
                          <p className="text-sm text-gray-500">
                            {crust.description}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-red-600">
                        {parseFloat(crust.price_modifier) === 0
                          ? "Grátis"
                          : `+${formatPrice(crust.price_modifier)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* SELEÇÃO DE RECHEIO (APENAS PIZZAS) */}
            {/* ============================================ */}
            {product.type === "pizza" && fillings.length > 0 && (
              <div>
                <h3 className="font-bold mb-3">Recheio da borda (opcional)</h3>
                <div className="space-y-2">
                  {/* Opção: Sem recheio */}
                  <label
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFilling === null
                        ? "border-red-600 bg-red-50"
                        : "border-gray-300 hover:border-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="filling"
                        checked={selectedFilling === null}
                        onChange={() => setSelectedFilling(null)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <p className="font-semibold">Sem recheio</p>
                    </div>
                    <span className="font-bold text-gray-600">R$ 0,00</span>
                  </label>

                  {/* Opções de recheio */}
                  {fillings.map((filling) => (
                    <label
                      key={filling.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFilling === filling.id
                          ? "border-red-600 bg-red-50"
                          : "border-gray-300 hover:border-red-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="filling"
                          value={filling.id}
                          checked={selectedFilling === filling.id}
                          onChange={() => setSelectedFilling(filling.id)}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-semibold">{filling.name}</p>
                          <p className="text-sm text-gray-500">
                            {filling.description}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-red-600">
                        +{formatPrice(filling.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* QUANTIDADE */}
            {/* ============================================ */}
            <div>
              <h3 className="font-bold mb-3">Quantidade</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <span className="text-2xl font-bold w-12 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* FOOTER (PREÇO E BOTÃO) */}
          {/* ============================================ */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(calculateTotalPrice() * quantity * 100)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
