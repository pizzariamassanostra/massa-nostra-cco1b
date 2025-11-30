// ============================================
// FUNÇÃO: FORMAT NUMBER TO FIT ZEROS
// ============================================
// Adiciona zeros à esquerda em uma lista de números (strings),
// garantindo que todos tenham o mesmo comprimento desejado.
// ============================================

export const formatNumberToFitZeros = (
  numbers: string[], // Lista de números em formato string
  desiredLength: number // Comprimento desejado
) => {
  const formattedNumbers = numbers.map((number) => {
    // Usa padStart para preencher com zeros à esquerda
    return number.padStart(desiredLength, "0");
  });

  return formattedNumbers;
};
