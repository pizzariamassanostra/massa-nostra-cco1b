// ============================================
// PÁGINA ADMIN: PRODUTOS
// ============================================
// Lista todos os produtos (admin)
// CRUD de produtos (futuro)
// ============================================

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { productService, Product } from "@/services/product.service";
import { Loader } from "lucide-react";

export default function AdminProdutosPage() {
  // ============================================
  // ESTADOS
  // ============================================
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // CARREGAR PRODUTOS AO MONTAR O COMPONENTE
  // ============================================
  useEffect(() => {
    loadProducts();
  }, []);

  // ============================================
  // CARREGAR TODOS OS PRODUTOS DO SERVIÇO
  // ============================================
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.products);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Produtos - Admin</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* ============================================ */}
        {/* HEADER DA PÁGINA */}
        {/* ============================================ */}
        <h1 className="text-3xl font-bold mb-6">Gerenciar Produtos</h1>

        {/* ============================================ */}
        {/* LOADING STATE */}
        {/* ============================================ */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        )}

        {/* ============================================ */}
        {/* GRID DE PRODUTOS */}
        {/* ============================================ */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{product.type}</span>
                  <span className="text-sm text-gray-500">
                    {product.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
