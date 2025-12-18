// ============================================
// COMPONENT: IMAGE UPLOAD
// ============================================

import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

// ============================================
// INTERFACE
// ============================================
interface ImageUploadProps {
  currentImage?: string | null; // Imagem atual
  onImageChange: (file: File | null) => void; // Callback ao selecionar/remover imagem
}

// ============================================
// COMPONENTE
// ============================================
export default function ImageUpload({
  currentImage,
  onImageChange,
}: ImageUploadProps) {
  // ============================================
  // ESTADOS E REFS
  // ============================================
  const [preview, setPreview] = useState<string | null>(currentImage || null); // Preview da imagem
  const fileInputRef = useRef<HTMLInputElement>(null); // Referência ao input de arquivo

  // ============================================
  // SELEÇÃO DE IMAGEM
  // ============================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    // Validar existência do arquivo
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida");
      return;
    }

    // Validar tamanho (máx. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }

    // Gerar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Callback para o componente pai
    onImageChange(file);
  };

  // ============================================
  // REMOVER IMAGEM
  // ============================================
  const handleRemove = () => {
    setPreview(null); // Limpar preview
    onImageChange(null); // Informar remoção
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Resetar input
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div>
      {/* ============================================ */}
      {/* LABEL */}
      {/* ============================================ */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagem do Produto
      </label>

      {/* ============================================ */}
      {/* PREVIEW OU UPLOAD */}
      {/* ============================================ */}
      {preview ? (
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image src={preview} alt="Preview" fill className="object-cover" />

          {/* BOTÃO REMOVER */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current && fileInputRef.current.click()} // Abrir seletor de arquivos
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600">Clique para selecionar</p>
          <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
        </div>
      )}

      {/* ============================================ */}
      {/* INPUT FILE (OCULTO) */}
      {/* ============================================ */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
