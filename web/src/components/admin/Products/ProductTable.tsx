// ============================================
// COMPONENTE: PRODUCT TABLE
// ============================================
// Tabela administrativa de produtos
// Listagem com imagem, categoria, preço, status e ações
// ============================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Power, Trash2, Eye } from "lucide-react";

// ============================================
// INTERFACES
// ============================================
export interface Product {
  id: number; // ID do produto
  name: string; // Nome do produto
  description: string; // Descrição do produto
  image_url: string | null; // URL da imagem (ou null)
  category_name: string; // Nome da categoria
  base_price: number; // Preço base em centavos
  is_active: boolean; // Status ativo/inativo
  created_at: string; // Data de criação
}

interface ProductTableProps {
  products: Product[]; // Lista de produtos
  onToggleStatus?: (productId: number) => void; // Ativar/Inativar produto
  onDelete?: (productId: number) => void; // Excluir produto
}

// ============================================
// COMPONENTE: ProductTable
// ============================================
export default function ProductTable({
  products,
  onToggleStatus,
  onDelete,
}: ProductTableProps) {
  // ============================================
  // FORMATAR MOEDA (CENTAVOS → REAL)
  // ============================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ============================================ */}
          {/* CABEÇALHO DA TABELA */}
          {/* ============================================ */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço Base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          {/* ============================================ */}
          {/* CORPO DA TABELA */}
          {/* ============================================ */}
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              // Estado vazio
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  {/* ============================================ */}
                  {/* IMAGEM DO PRODUTO */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        // Placeholder quando não há imagem
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Eye className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* ============================================ */}
                  {/* NOME E DESCRIÇÃO */}
                  {/* ============================================ */}
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.description}
                      </p>
                    </div>
                  </td>

                  {/* ============================================ */}
                  {/* CATEGORIA */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {product.category_name}
                    </span>
                  </td>

                  {/* ============================================ */}
                  {/* PREÇO BASE */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(product.base_price)}
                    </span>
                  </td>

                  {/* ============================================ */}
                  {/* STATUS DO PRODUTO */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  {/* ============================================ */}
                  {/* AÇÕES */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Editar produto */}
                      <Link
                        href={`/admin/produtos/${product.id}/editar`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      {/* Ativar/Inativar produto */}
                      {onToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            product.is_active
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={product.is_active ? "Inativar" : "Ativar"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}

                      {/* Excluir produto */}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
