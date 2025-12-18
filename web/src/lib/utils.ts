// ============================================
// FUNÇÃO UTILITÁRIA: CLASS NAMES
// ============================================
// Combina múltiplas classes CSS de forma inteligente.
// Usa `clsx` para condicionar classes e `tailwind-merge`
// para evitar conflitos entre utilitários do Tailwind.
// ============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================
// FUNÇÃO UTILITÁRIA
// ============================================
// Une múltiplas classes CSS em uma única string.
// - Aceita strings, arrays e objetos condicionais
// - Resolve conflitos de classes do Tailwind automaticamente
//
// Exemplo de uso:
// cn("px-4", "py-2", isActive && "bg-red-500");
// Retorna: "px-4 py-2 bg-red-500"
// ============================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
