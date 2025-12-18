// ============================================
// HELPER: HASH E VALIDAÇÃO DE SENHAS
// ============================================
// Utilitário responsável por:
// - Gerar hash de senha com bcrypt
// - Validar senha em texto contra hash armazenado
// ============================================

import * as bcrypt from 'bcrypt';

// ============================================
// FUNÇÃO: hashPassword
// ============================================
// Gera hash bcrypt a partir de senha em texto
// Usa salt rounds padrão (10)
// ============================================
const hashPassword = async (password: string): Promise<string> => {
  // Número de rounds do bcrypt (padrão seguro)
  const saltRounds = 10;

  // Gera hash criptografado
  const hash = await bcrypt.hash(password, saltRounds);

  // Retorna hash gerado
  return hash;
};

// ============================================
// FUNÇÃO: validatePassword
// ============================================
// Compara senha em texto puro com hash armazenado
// Retorna true se a senha for válida
// ============================================
const validatePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  // Compara senha com hash
  const isValid = await bcrypt.compare(password, hash);

  // Retorna resultado da validação
  return isValid;
};

// ============================================
// EXPORTAÇÃO
// ============================================
export { hashPassword, validatePassword };
