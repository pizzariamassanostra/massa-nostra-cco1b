// ============================================
// FUNÇÃO: CENSOR USERNAME
// ============================================
// Censura partes intermediárias do nome do usuário
// Mantém o primeiro e o último nome visíveis
// ============================================

export const censorUsername = (username: string): string => {
  // Divide o nome em palavras, removendo espaços extras
  const usernameArray = username.trim().split(" ");
  let censoredArray: string[] = [];

  // ============================================
  // PROCESSAMENTO: Censura das palavras intermediárias
  // ============================================
  usernameArray?.forEach((word, index) => {
    // Mantém primeira e última palavra sem censura
    if ([usernameArray.length - 1, 0].includes(index)) {
      censoredArray.push(word);
    } else {
      // Substitui cada letra da palavra por "*"
      censoredArray.push(
        word
          .split("")
          .map(() => "*")
          .join("")
      );
    }
  });

  // ============================================
  // RETORNO
  // ============================================
  // Junta novamente as palavras em uma string
  return censoredArray.join(" ");
};
