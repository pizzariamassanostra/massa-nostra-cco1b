// ============================================
// FUNÇÃO UTILITÁRIA: CLASSNAMES (CN)
// ============================================
// Combina múltiplas classes CSS de forma inteligente.
// Usa `clsx` para condicionar classes e `tailwind-merge`
// para evitar conflitos entre utilitários do Tailwind.
// ============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função auxiliar para unir classes CSS
 * - Aceita múltiplos valores (string, array, objeto condicional)
 * - Resolve conflitos de classes do Tailwind automaticamente
 *
 * @param inputs - Lista de classes a serem combinadas
 * @returns String final com classes unificadas
 *
 * @example
 * cn("px-4", "py-2", isActive && "bg-red-500");
 * // Retorna: "px-4 py-2 bg-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
