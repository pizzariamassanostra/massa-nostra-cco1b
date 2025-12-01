// ============================================
// FUNÇÃO: CENSURAR NOME
// ============================================
// Oculta nomes do meio (LGPD)
// Exemplo: "João Silva Santos" → "João S***** Santos"
// ============================================

export const censorName = (username: string): string => {
  const usernameArray = username.trim().split(' ');
  let censoredArray: string[] = [];

  usernameArray?.forEach((word, index) => {
    // Manter primeiro e último nome
    if ([usernameArray.length - 1, 0].includes(index)) {
      censoredArray.push(word);
    } else {
      // Censurar nomes do meio
      censoredArray.push(
        word
          .split('')
          .map((char, index) => {
            if (index === 0) return char;
            return '*';
          })
          .join(''),
      );
    }
  });

  return censoredArray.join(' ');
};
