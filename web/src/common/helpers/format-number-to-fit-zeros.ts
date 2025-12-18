// ============================================
// FUNÇÃO UTILITÁRIA: FORMATAR NÚMEROS COM ZEROS À ESQUERDA
// ============================================

// ============================================
// FUNÇÃO: formatNumberToFitZeros
// ============================================
// Preenche números com zeros à esquerda até atingir o tamanho desejado
// ============================================
export const formatNumberToFitZeros = (
  numbers: string[], // Lista de números em formato string
  desiredLength: number // Comprimento final desejado para cada número
) => {
  const formattedNumbers = numbers.map((number) => {
    // Preenche com zeros à esquerda até atingir o tamanho desejado
    return number.padStart(desiredLength, "0");
  });

  // Retorna a lista de números já formatados
  return formattedNumbers;
};
