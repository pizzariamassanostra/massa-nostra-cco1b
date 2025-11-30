// ============================================
// FUNÇÃO: CENSOR USERNAME
// ============================================
// Censura partes do nome de usuário, mantendo apenas
// o primeiro e o último nome visíveis.
// - Exemplo: "Lucas da Silva Pereira" → "Lucas *** Pereira"
// ============================================

export const censorUsername = (username: string): string => {
  // Divide o nome em palavras, removendo espaços extras
  const usernameArray = username.trim().split(" ");
  let censoredArray: string[] = [];

  // Itera sobre cada palavra do nome
  usernameArray?.forEach((word, index) => {
    // Mantém primeira e última palavra sem censura
    if ([usernameArray.length - 1, 0].includes(index)) {
      censoredArray.push(word);
    } else {
      // Substitui cada letra por "*"
      censoredArray.push(
        word
          .split("")
          .map(() => "*")
          .join("")
      );
    }
  });

  // Junta novamente em uma string
  return censoredArray.join(" ");
};
