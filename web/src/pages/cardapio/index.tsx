// ============================================
// PÁGINA: CARDÁPIO
// ============================================
// Lista todos os produtos (pizzas, bebidas, sobremesas)
// Filtro por categoria
// Adiciona produtos ao carrinho
// ============================================

import React, { useState, useEffect } from "react";
import {
  productService,
  Product,
  ProductCategory,
} from "@/services/product.service";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilter from "@/components/product/CategoryFilter";
import Head from "next/head";
import { Search, Loader } from "lucide-react";

export default function CardapioPage() {
  // ============================================
  // ESTADOS
  // ============================================
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // CARREGAR DADOS AO MONTAR
  // ============================================
  useEffect(() => {
    loadData();
  }, []);

  // ============================================
  // CARREGAR PRODUTOS E CATEGORIAS
  // ============================================
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
      ]);

      setProducts(productsResponse.products || []);
      setCategories(categoriesResponse.categories || []);
    } catch (error: any) {
      console.error("Erro ao carregar cardápio:", error);
      setError(
        `Erro ao carregar produtos. Certifique-se de que a API está rodando em ${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FILTRAR PRODUTOS
  // ============================================
  // Filtra por categoria E por termo de busca simultaneamente
  const filteredProducts = (products || []).filter((product) => {
    // Verifica se o produto pertence à categoria selecionada
    const matchesCategory =
      selectedCategory === null || product.category_id === selectedCategory;

    // Verifica se o nome ou descrição contém o termo de busca
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Retorna true apenas se passar nos dois filtros
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Cardápio - Pizzaria Massa Nostra</title>
        <meta
          name="description"
          content="Confira nosso cardápio completo com pizzas, bebidas e sobremesas. Peça já!"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* ============================================ */}
        {/* HEADER DA PÁGINA */}
        {/* ============================================ */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Nosso Cardápio
          </h1>
          <p className="text-gray-600">
            Escolha entre nossas deliciosas pizzas, bebidas e sobremesas
          </p>
        </div>

        {/* ============================================ */}
        {/* BARRA DE BUSCA */}
        {/* ============================================ */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* FILTRO DE CATEGORIAS */}
        {/* ============================================ */}
        {!loading && categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* ============================================ */}
        {/* LOADING STATE */}
        {/* ============================================ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        )}

        {/* ============================================ */}
        {/* ERROR STATE */}
        {/* ============================================ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4"></div>
            <p className="text-red-600 font-semibold mb-4 text-lg">{error}</p>
            <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Como resolver:</strong>
              </p>
              <ol className="text-left text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Abra um novo terminal</li>
                <li>
                  Execute:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    cd ~/Documentos/pizzaria-massa-nostra/api
                  </code>
                </li>
                <li>
                  Execute:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    yarn start:dev
                  </code>
                </li>
                <li>
                  Aguarde a mensagem &quot;Nest application successfully
                  started&quot;
                </li>
                <li>Volte aqui e clique em &quot;Tentar Novamente&quot;</li>
              </ol>
            </div>
            <button
              onClick={loadData}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* GRID DE PRODUTOS */}
        {/* ============================================ */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* NENHUM PRODUTO ENCONTRADO */}
        {/* ============================================ */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 &&
          products.length > 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `Nenhum produto corresponde a &quot;${searchTerm}&quot;`
                  : "Não há produtos disponíveis nesta categoria"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-red-600 hover:text-red-700 font-semibold"
                >
                  Limpar busca
                </button>
              )}
            </div>
          )}

        {/* ============================================ */}
        {/* CARDÁPIO VAZIO */}
        {/* ============================================ */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Cardápio Vazio
            </h3>
            <p className="text-gray-600 mb-4">
              Ainda não há produtos cadastrados no sistema
            </p>
            <p className="text-sm text-gray-500"></p>
          </div>
        )}
      </div>
    </>
  );
}
