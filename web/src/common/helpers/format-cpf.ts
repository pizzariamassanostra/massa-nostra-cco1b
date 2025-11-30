// ============================================
// HELPER: FORMATAÇÃO DE CPF
// ============================================
// Formata e valida CPF
// ============================================

export function formatCpf(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// remove formatação do CPF
export function unformatCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

// valida CPF
export function validateCpf(cpf: string): boolean {
  const cleaned = unformatCpf(cpf);
  if (cleaned.length !== 11) return false;

  // CPFs inválidos
  const invalidCpfs = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];
  if (invalidCpfs.includes(cleaned)) return false;

  // dígito 1
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  if (digit1 !== parseInt(cleaned[9])) return false;

  // dígito 2
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  if (digit2 !== parseInt(cleaned[10])) return false;

  return true;
}
