// ============================================
// FUNÇÕES UTILITÁRIAS: FORMATAÇÃO DE TELEFONE
// ============================================

// ============================================
// FUNÇÃO: formatPhone
// ============================================
// Formata número de telefone (celular ou fixo) para exibição
// ============================================
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cleaned.length === 11) {
    // Celular — formato: (XX) XXXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // Fixo — formato: (XX) XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // Caso não tenha 10 ou 11 dígitos, retorna o valor original
  return phone;
}

// ============================================
// FUNÇÃO: unformatPhone
// ============================================
// Remove qualquer formatação, retornando apenas os dígitos
// ============================================
export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, ""); // Remove caracteres não numéricos
}
