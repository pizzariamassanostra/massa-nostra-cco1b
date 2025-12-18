// ============================================
// HELPER: FORMATAÇÃO E VALIDAÇÃO DE CPF
// ============================================

// ============================================
// FUNÇÃO: formatCpf
// ============================================
// Aplica máscara no CPF no formato XXX.XXX.XXX-XX
// ============================================
export function formatCpf(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, ""); // Remove tudo que não for número
  if (cleaned.length !== 11) return cpf; // Retorna original se não tiver 11 dígitos

  // Aplica máscara no formato XXX.XXX.XXX-XX
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// ============================================
// FUNÇÃO: unformatCpf
// ============================================
// Remove formatação do CPF, retornando apenas números
// ============================================
export function unformatCpf(cpf: string): string {
  return cpf.replace(/\D/g, ""); // Remove qualquer caractere não numérico
}

// ============================================
// FUNÇÃO: validateCpf
// ============================================
// Valida CPF com base nos dígitos verificadores
// ============================================
export function validateCpf(cpf: string): boolean {
  const cleaned = unformatCpf(cpf); // Remove formatação

  if (cleaned.length !== 11) return false; // CPF deve ter 11 dígitos

  // Lista de CPFs inválidos conhecidos (todos dígitos iguais)
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

  // ============================================
  // CÁLCULO: Primeiro dígito verificador
  // ============================================
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i); // Multiplica cada dígito pelo peso correspondente
  }

  let digit1 = 11 - (sum % 11); // Calcula dígito
  if (digit1 >= 10) digit1 = 0; // Ajusta regra do CPF

  if (digit1 !== parseInt(cleaned[9])) return false; // Compara com dígito informado

  // ============================================
  // CÁLCULO: Segundo dígito verificador
  // ============================================
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i); // Multiplica cada dígito pelo peso correspondente
  }

  let digit2 = 11 - (sum % 11); // Calcula dígito
  if (digit2 >= 10) digit2 = 0; // Ajusta regra do CPF

  if (digit2 !== parseInt(cleaned[10])) return false; // Compara com dígito informado

  return true; // CPF válido
}
