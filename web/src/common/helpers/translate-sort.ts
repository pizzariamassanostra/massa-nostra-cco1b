// ============================================
// FUNÇÃO: TRANSLATE SORT
// ============================================
// Função utilitária para traduzir uma chave em índice de array.
// - Recebe uma `key` (do React, geralmente string ou número).
// - Se for string no formato "algumaCoisa.index", extrai o índice.
// - Retorna o elemento correspondente no array.
// - Caso a key não seja string, retorna o primeiro elemento.
// ============================================

import { Key } from "react";

export default function translateSort(key: Key | undefined, array: any[]): any {
  if (typeof key === "string") {
    // Divide a string pela "." e pega a segunda parte como índice
    const index = parseInt(key.split(".")[1]);
    return array[index];
  }

  // Se não for string, retorna o primeiro elemento do array
  return array[0];
}
