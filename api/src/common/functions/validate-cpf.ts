// ============================================
// FUNÇÕES: VALIDAÇÃO E FORMATAÇÃO DE CPF
// ============================================
// Conjunto de utilitários para trabalhar com CPF:
// - validateCPF: valida dígitos verificadores e regras básicas
// - formatCPF: aplica máscara no padrão brasileiro (XXX.XXX.XXX-XX)
// ============================================

/**
 * Valida um CPF verificando dígitos verificadores
 *
 * Regras:
 * - Remove pontos e traços automaticamente
 * - CPF deve ter 11 dígitos
 * - Não aceita CPFs com todos os dígitos iguais
 * - Valida os dois dígitos verificadores
 */
export function validateCPF(cpf: string): boolean {
  // Remove máscara (pontos e traços) deixando apenas números
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // Verifica se tem exatamente 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Rejeita CPFs com todos os dígitos iguais (000.000.000-00, 111.111.111-11, etc)
  const allSameDigits = /^(\d)\1{10}$/.test(cleanCPF);
  if (allSameDigits) {
    return false;
  }

  // Valida o primeiro dígito verificador
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

  // Valida o segundo dígito verificador
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

  // CPF passou em todas as validações
  return true;
}

/**
 * Formata CPF adicionando máscara (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  // Remove qualquer caractere que não seja número
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    throw new Error('CPF deve ter 11 dígitos');
  }

  // Formata com padrão brasileiro (XXX.XXX.XXX-XX)
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
