// ============================================
// HELPER: VALIDAÇÃO E FORMATAÇÃO DE CPF
// ============================================
// Utilitários responsáveis por:
// - Validar CPF (dígitos verificadores e regras básicas)
// - Formatar CPF no padrão brasileiro (XXX.XXX.XXX-XX)
// ============================================

// ============================================
// FUNÇÃO: validateCPF
// ============================================
// Valida CPF verificando:
// - Quantidade de dígitos
// - Rejeição de CPFs com todos os dígitos iguais
// - Cálculo dos dois dígitos verificadores
// ============================================
const validateCPF = (cpf: string): boolean => {
  // Remove máscara (pontos e traços), mantendo apenas números
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // CPF deve conter exatamente 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Rejeita CPFs com todos os dígitos iguais
  const allSameDigits = /^(\d)\1{10}$/.test(cleanCPF);
  if (allSameDigits) {
    return false;
  }

  // ============================================
  // CÁLCULO: Primeiro dígito verificador
  // ============================================
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }

  // ============================================
  // CÁLCULO: Segundo dígito verificador
  // ============================================
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false;
  }

  // CPF válido
  return true;
};

// ============================================
// FUNÇÃO: formatCPF
// ============================================
// Aplica máscara no formato brasileiro (XXX.XXX.XXX-XX)
// Lança erro se CPF não possuir 11 dígitos
// ============================================
const formatCPF = (cpf: string): string => {
  // Remove qualquer caractere não numérico
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // CPF deve conter exatamente 11 dígitos
  if (cleanCPF.length !== 11) {
    throw new Error('CPF deve ter 11 dígitos');
  }

  // Retorna CPF formatado
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// ============================================
// EXPORTAÇÃO
// ============================================
export { validateCPF, formatCPF };
