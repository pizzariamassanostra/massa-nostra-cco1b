// ============================================
// FUNÇÃO UTILITÁRIA: TRANSLATE SORT
// ============================================

import { Key } from "react";

// ============================================
// FUNÇÃO: translateSort
// ============================================
// Converte a chave de ordenação (ex: "table.2")
// em um valor correspondente dentro do array
// ============================================
export default function translateSort(key: Key | undefined, array: any[]): any {
  // Verifica se a chave é uma string válida
  if (typeof key === "string") {
    // Divide a string pelo "." e utiliza a segunda parte como índice
    const index = parseInt(key.split(".")[1]);

    // Retorna o valor do array correspondente ao índice
    return array[index];
  }

  // Fallback: retorna o primeiro elemento do array
  return array[0];
}
