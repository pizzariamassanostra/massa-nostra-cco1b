// ============================================
// HELPER: MANIPULAÇÃO DE NOME DO USUÁRIO
// ============================================

// ============================================
// FUNÇÃO: firstLastName
// ============================================
// Retorna apenas o primeiro e o último nome a partir do nome completo
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
