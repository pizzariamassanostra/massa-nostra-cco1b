// ============================================
// FUNÇÃO: CENSURAR NOME
// ============================================
// Responsável por ocultar nomes do meio
// Atende LGPD / privacidade de dados pessoais
// Exemplo: "João Silva Santos" → "João S***** Santos"
// ============================================

// ============================================
// FUNÇÃO: censorName
// ============================================
const censorName = (username: string): string => {
  // Remove espaços extras e separa o nome em partes
  const usernameArray = username.trim().split(' ');

  // Array que armazenará o nome censurado
  let censoredArray: string[] = [];

  usernameArray.forEach((word, index) => {
    // Mantém o primeiro e o último nome visíveis
    if ([0, usernameArray.length - 1].includes(index)) {
      censoredArray.push(word);
    } else {
      // Censura nomes do meio mantendo apenas a primeira letra
      censoredArray.push(
        word
          .split('')
          .map((char, charIndex) => {
            if (charIndex === 0) return char; // Mantém a primeira letra
            return '*'; // Substitui o restante por asteriscos
          })
          .join(''),
      );
    }
  });

  // Retorna o nome censurado
  return censoredArray.join(' ');
};

// ============================================
// EXPORTAÇÃO
// ============================================
export { censorName };
