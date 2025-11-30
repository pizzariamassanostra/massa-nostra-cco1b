// ============================================
// COMPONENTE: FILTRO DE CATEGORIAS
// ============================================
// Exibe botões para filtrar produtos por categoria
// Mostra "Todos" + categorias ativas
// Destaca categoria selecionada
// ============================================

import React from "react";
import { ProductCategory } from "@/services/product.service";

interface CategoryFilterProps {
  categories: ProductCategory[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* ============================================ */}
      {/* TÍTULO */}
      {/* ============================================ */}
      <h2 className="text-lg font-bold mb-4">Categorias</h2>

      {/* ============================================ */}
      {/* BOTÕES DE FILTRO */}
      {/* ============================================ */}
      <div className="flex flex-wrap gap-2">
        {/* Botão "Todos" */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            selectedCategory === null
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todos
        </button>

        {/* Botões de cada categoria */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              selectedCategory === category.id
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
