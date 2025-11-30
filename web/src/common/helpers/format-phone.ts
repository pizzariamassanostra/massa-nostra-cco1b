// ============================================
// FUNÇÕES: FORMATAÇÃO DE TELEFONE
// ============================================
// Utilitários para lidar com números de telefone:
// - `formatPhone`: aplica máscara de celular ou fixo.
// - `unformatPhone`: remove qualquer formatação, retornando apenas dígitos.
// ============================================

// Formata número de telefone (celular ou fixo)
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cleaned.length === 11) {
    // Celular (padrão: (XX) XXXXX-XXXX)
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // Fixo (padrão: (XX) XXXX-XXXX)
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // Caso não seja 10 ou 11 dígitos, retorna original
  return phone;
}

// Remove qualquer formatação, retornando apenas os dígitos
export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}
