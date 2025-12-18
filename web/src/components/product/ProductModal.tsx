// ============================================
// COMPONENTE: MODAL DE SELEÇÃO DO PRODUTO
// ============================================
// Modal responsável por:
// - Selecionar tamanho (variação)
// - Selecionar borda e recheio (apenas pizzas)
// - Calcular preço total automaticamente
// - Adicionar item configurado ao carrinho
// ============================================

import React, { useState, useEffect } from "react";
import { Product, Crust, Filling } from "@/services/product.service";
import { productService } from "@/services/product.service";
import { useCart } from "@/contexts/CartContext";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

// ============================================
// INTERFACES
// ============================================
interface ProductModalProps {
  product: Product; // Produto selecionado
  isOpen: boolean; // Controla abertura do modal
  onClose: () => void; // Callback para fechar modal
}

// ============================================
// COMPONENTE
// ============================================
const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem } = useCart(); // Função para adicionar item ao carrinho

  // ============================================
  // ESTADOS
  // ============================================
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null); // Tamanho selecionado
  const [selectedCrust, setSelectedCrust] = useState<number | null>(null); // Borda selecionada
  const [selectedFilling, setSelectedFilling] = useState<number | null>(null); // Recheio selecionado
  const [quantity, setQuantity] = useState(1); // Quantidade do item
  const [crusts, setCrusts] = useState<Crust[]>([]); // Lista de bordas
  const [fillings, setFillings] = useState<Filling[]>([]); // Lista de recheios
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // ============================================
  // CARREGAR BORDAS E RECHEIOS (APENAS PARA PIZZAS)
  // ============================================
  useEffect(() => {
    if (product.type === "pizza") {
      loadCrustsAndFillings(); // Busca dados adicionais
    }
  }, [product.type]);

  // ============================================
  // SELECIONAR PRIMEIRO TAMANHO AUTOMATICAMENTE
  // ============================================
  useEffect(() => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0].id); // Define tamanho padrão
    }
  }, [product.variants, selectedVariant]);

  // ============================================
  // CARREGAR BORDAS E RECHEIOS
  // ============================================
  const loadCrustsAndFillings = async () => {
    try {
      const [crustsData, fillingsData] = await Promise.all([
        productService.getCrusts(), // Busca bordas
        productService.getFillings(), // Busca recheios
      ]);

      setCrusts(crustsData.crusts); // Atualiza estado de bordas
      setFillings(fillingsData.fillings); // Atualiza estado de recheios

      // Seleciona primeira borda por padrão
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

    // Preço do tamanho selecionado
    const variant = product.variants?.find((v) => v.id === selectedVariant);
    if (variant) {
      total += parseFloat(variant.price);
    }

    // Preço da borda
    const crust = crusts.find((c) => c.id === selectedCrust);
    if (crust) {
      total += parseFloat(crust.price_modifier);
    }

    // Preço do recheio
    const filling = fillings.find((f) => f.id === selectedFilling);
    if (filling) {
      total += parseFloat(filling.price);
    }

    return total / 100; // Converte centavos para reais
  };

  // ============================================
  // ADICIONAR AO CARRINHO
  // ============================================
  const handleAddToCart = () => {
    // Validar seleção de tamanho
    if (!selectedVariant) {
      toast.error("Selecione um tamanho");
      return;
    }

    const variant = product.variants?.find((v) => v.id === selectedVariant);
    const crust = crusts.find((c) => c.id === selectedCrust);
    const filling = fillings.find((f) => f.id === selectedFilling);

    if (!variant) return;

    // Gerar identificador único do item no carrinho
    const itemId = `${product.id}-${selectedVariant}-${selectedCrust || 0}-${
      selectedFilling || 0
    }`;

    // Calcular preços unitários
    const variantPrice = parseFloat(variant.price) / 100;
    const crustPrice = crust ? parseFloat(crust.price_modifier) / 100 : 0;
    const fillingPrice = filling ? parseFloat(filling.price) / 100 : 0;
    const unitPrice = variantPrice + crustPrice + fillingPrice;

    // Criar objeto do item do carrinho
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

    // Adiciona item ao carrinho
    addItem(cartItem);

    // Fecha o modal
    onClose();
  };

  // Não renderiza se modal estiver fechado
  if (!isOpen) return null;

  return (
    <>
      {/* ============================================ */}
      {/* OVERLAY */}
      {/* ============================================ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose} // Fecha modal ao clicar fora
      >
        {/* ============================================ */}
        {/* MODAL */}
        {/* ============================================ */}
        <div
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar no conteúdo
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
            {/* Imagem do produto */}
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

            {/* Descrição do produto */}
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
                        onChange={() => setSelectedVariant(variant.id)} // Atualiza tamanho selecionado
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
            {/* Renderiza a seleção de bordas somente quando:
                - O produto é do tipo pizza
                - Existem bordas disponíveis carregadas da API */}
            {product.type === "pizza" && crusts.length > 0 && (
              <div>
                <h3 className="font-bold mb-3">Escolha a borda</h3>

                {/* Lista de opções de borda */}
                <div className="space-y-2">
                  {crusts.map((crust) => (
                    <label
                      key={crust.id} // ID único da borda
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCrust === crust.id
                          ? "border-red-600 bg-red-50" // Borda selecionada
                          : "border-gray-300 hover:border-red-400" // Borda não selecionada
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="crust" // Grupo de radios para bordas
                          value={crust.id}
                          checked={selectedCrust === crust.id} // Controla seleção
                          onChange={() => setSelectedCrust(crust.id)} // Atualiza borda selecionada
                          className="text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-semibold">{crust.name}</p>
                          <p className="text-sm text-gray-500">
                            {crust.description}
                          </p>
                        </div>
                      </div>

                      {/* Exibe o valor adicional da borda */}
                      <span className="font-bold text-red-600">
                        {parseFloat(crust.price_modifier) === 0
                          ? "Grátis" // Sem custo adicional
                          : `+${formatPrice(crust.price_modifier)}`}{" "}
                        {/* Acréscimo no preço */}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* SELEÇÃO DE RECHEIO (APENAS PIZZAS) */}
            {/* ============================================ */}
            {/* Recheio da borda é opcional e só aparece para pizzas */}
            {product.type === "pizza" && fillings.length > 0 && (
              <div>
                <h3 className="font-bold mb-3">Recheio da borda (opcional)</h3>

                <div className="space-y-2">
                  {/* ============================================ */}
                  {/* OPÇÃO: SEM RECHEIO */}
                  {/* ============================================ */}
                  {/* Permite remover qualquer recheio selecionado */}
                  <label
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFilling === null
                        ? "border-red-600 bg-red-50" // Sem recheio selecionado
                        : "border-gray-300 hover:border-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="filling" // Grupo de radios para recheio
                        checked={selectedFilling === null}
                        onChange={() => setSelectedFilling(null)} // Remove recheio
                        className="text-red-600 focus:ring-red-500"
                      />
                      <p className="font-semibold">Sem recheio</p>
                    </div>

                    {/* Valor fixo zero */}
                    <span className="font-bold text-gray-600">R$ 0,00</span>
                  </label>

                  {/* ============================================ */}
                  {/* OPÇÕES DE RECHEIO */}
                  {/* ============================================ */}
                  {/* Lista todos os recheios disponíveis */}
                  {fillings.map((filling) => (
                    <label
                      key={filling.id} // ID único do recheio
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFilling === filling.id
                          ? "border-red-600 bg-red-50" // Recheio selecionado
                          : "border-gray-300 hover:border-red-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="filling"
                          value={filling.id}
                          checked={selectedFilling === filling.id}
                          onChange={() => setSelectedFilling(filling.id)} // Atualiza recheio selecionado
                          className="text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-semibold">{filling.name}</p>
                          <p className="text-sm text-gray-500">
                            {filling.description}
                          </p>
                        </div>
                      </div>

                      {/* Valor adicional do recheio */}
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
            {/* Controle da quantidade de itens adicionados ao carrinho */}
            <div>
              <h3 className="font-bold mb-3">Quantidade</h3>

              <div className="flex items-center gap-4">
                {/* Botão para diminuir quantidade */}
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} // Garante mínimo 1
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>

                {/* Exibe quantidade atual */}
                <span className="text-2xl font-bold w-12 text-center">
                  {quantity}
                </span>

                {/* Botão para aumentar quantidade */}
                <button
                  onClick={() => setQuantity(quantity + 1)} // Incrementa quantidade
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
          {/* Área fixa no rodapé do modal:
              - Exibe o preço total calculado
              - Contém a ação principal de adicionar ao carrinho */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            {/* Linha de resumo do valor total */}
            <div className="flex items-center justify-between mb-4">
              {/* Label do valor */}
              <span className="text-lg">Total</span>

              {/* Valor total final:
                  - Soma variação + borda + recheio
                  - Multiplica pela quantidade
                  - Converte para centavos antes de formatar */}
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(calculateTotalPrice() * quantity * 100)}
              </span>
            </div>

            {/* Botão principal de ação */}
            {/* Responsável por validar seleção e adicionar o item ao carrinho */}
            <button
              onClick={handleAddToCart} // Executa fluxo de adicionar ao carrinho
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
