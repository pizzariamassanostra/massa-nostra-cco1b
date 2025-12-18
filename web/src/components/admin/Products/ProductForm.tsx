// ============================================
// COMPONENT: PRODUCT FORM
// ============================================

import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { Loader } from "lucide-react";

// ============================================
// INTERFACES
// ============================================
export interface ProductFormData {
  name: string; // Nome do produto
  description: string; // Descrição do produto
  category_id: number | ""; // ID da categoria
  base_price: number; // Preço base
  is_active: boolean; // Status ativo/inativo
  image?: File | null; // Imagem do produto
}

interface Category {
  id: number; // ID da categoria
  name: string; // Nome da categoria
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>; // Dados iniciais (edição)
  categories: Category[]; // Lista de categorias
  currentImage?: string | null; // Imagem atual
  onSubmit: (data: ProductFormData) => void; // Callback submit
  onCancel: () => void; // Callback cancelar
  loading?: boolean; // Estado de loading
}

// ============================================
// COMPONENTE
// ============================================
export default function ProductForm({
  initialData,
  categories,
  currentImage,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  // ============================================
  // ESTADOS
  // ============================================
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "", // Nome inicial
    description: initialData?.description || "", // Descrição inicial
    category_id: initialData?.category_id || "", // Categoria inicial
    base_price: initialData?.base_price || 0, // Preço inicial
    is_active: initialData?.is_active ?? true, // Status inicial
    image: null, // Imagem selecionada
  });

  // ============================================
  // INPUTS, TEXT AREA, SELECT, CHECKBOX
  // ============================================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked // Checkbox
          : type === "number"
          ? Number(value) // Campo numérico
          : value, // Campo texto
    });
  };

  // ============================================
  // HANDLE IMAGE CHANGE
  // ============================================
  const handleImageChange = (file: File | null) => {
    setFormData({ ...formData, image: file });
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ============================================
    // VALIDAÇÕES
    // ============================================
    if (!formData.name.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    if (!formData.category_id) {
      alert("Selecione uma categoria");
      return;
    }

    if (formData.base_price <= 0) {
      alert("Preço base deve ser maior que zero");
      return;
    }

    // Enviar dados para o componente pai
    onSubmit(formData);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ============================================ */}
      {/* IMAGEM */}
      {/* ============================================ */}
      <ImageUpload
        currentImage={currentImage}
        onImageChange={handleImageChange}
      />

      {/* ============================================ */}
      {/* NOME DO PRODUTO */}
      {/* ============================================ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Produto *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Ex: Pizza Margherita"
        />
      </div>

      {/* ============================================ */}
      {/* DESCRIÇÃO DO PRODUTO */}
      {/* ============================================ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Descrição do produto..."
        />
      </div>

      {/* ============================================ */}
      {/* CATEGORIA E PREÇO */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ============================================ */}
        {/* CATEGORIA */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Selecione...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* ============================================ */}
        {/* PREÇO BASE */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço Base (R$) *
          </label>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* STATUS DO PRODUTO */}
      {/* ============================================ */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Produto ativo (disponível para venda)
        </label>
      </div>

      {/* ============================================ */}
      {/* BOTÕES DE AÇÃO */}
      {/* ============================================ */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? "Salvando..." : "Salvar Produto"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
