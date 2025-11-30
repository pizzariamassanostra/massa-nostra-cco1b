// ============================================
// FUNÇÃO: FIRST LAST NAME
// ============================================
// Extrai o primeiro e o último nome de uma string de nome completo.
// - Remove espaços extras com `trim()`.
// - Divide o nome em partes usando `split(" ")`.
// - Retorna apenas o primeiro e o último nome concatenados.
// ============================================

export const firstLastName = (username: string): string => {
  // Divide o nome em array de palavras
  const usernameArray = username.trim().split(" ");

  // Primeiro nome
  const firstName = usernameArray[0];

  // Último nome (último elemento do array)
  const lastName = usernameArray[usernameArray.length - 1];

  // Retorna apenas "Primeiro Último"
  return `${firstName} ${lastName}`;
};
