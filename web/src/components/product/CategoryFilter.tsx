// ============================================
// COMPONENTE: FILTRO DE CATEGORIAS
// ============================================
// Responsável por exibir os filtros de categoria dos produtos.
// Mostra a opção "Todos" e as categorias ativas vindas da API.
// Destaca visualmente a categoria atualmente selecionada.
// ============================================

import React from "react";
import { ProductCategory } from "@/services/product.service";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface CategoryFilterProps {
  categories: ProductCategory[]; // Lista de categorias disponíveis
  selectedCategory: number | null; // Categoria atualmente selecionada
  onSelectCategory: (categoryId: number | null) => void; // Callback de seleção
}

// ============================================
// COMPONENTE
// ============================================
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
        {/* ============================================ */}
        {/* BOTÃO: TODOS */}
        {/* ============================================ */}
        {/* Remove qualquer filtro de categoria */}
        <button
          onClick={() => onSelectCategory(null)} // Limpa filtro
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            selectedCategory === null
              ? "bg-red-600 text-white" // Estado ativo
              : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Estado inativo
          }`}
        >
          Todos
        </button>

        {/* ============================================ */}
        {/* BOTÕES: CATEGORIAS */}
        {/* ============================================ */}
        {/* Renderiza dinamicamente cada categoria */}
        {categories.map((category) => (
          <button
            key={category.id} // ID único da categoria
            onClick={() => onSelectCategory(category.id)} // Seleciona categoria
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              selectedCategory === category.id
                ? "bg-red-600 text-white" // Categoria ativa
                : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Categoria inativa
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// EXPORTAÇÃO
// ============================================
export default CategoryFilter;
