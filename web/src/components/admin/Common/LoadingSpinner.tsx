// ============================================
// COMPONENT: LOADING SPINNER
// ============================================

import React from "react";
import { Loader } from "lucide-react";

// ============================================
// INTERFACE: Propriedades do componente
// ============================================
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"; // Tamanho opcional do spinner
  text?: string; // Texto opcional exibido abaixo do spinner
}

// ============================================
// COMPONENTE: Indicador de carregamento
// ============================================
export default function LoadingSpinner({
  size = "md", // Tamanho padrão
  text, // Texto opcional
}: LoadingSpinnerProps) {
  // ============================================
  // MAPEAMENTO: Classes de tamanho do spinner
  // ============================================
  const sizeClasses = {
    sm: "w-4 h-4", // Spinner pequeno
    md: "w-8 h-8", // Spinner médio
    lg: "w-12 h-12", // Spinner grande
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader
        className={`${sizeClasses[size]} text-red-600 animate-spin mb-3`} // Ícone animado
      />

      {/* Texto opcional exibido abaixo do spinner */}
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
}
