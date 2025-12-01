// ============================================
// FUNÇÃO: HASH E VALIDAÇÃO DE SENHAS
// ============================================
// Usa bcrypt para criptografar e validar senhas
// ============================================

import * as bcrypt from 'bcrypt';

// ============================================
// GERAR HASH DE SENHA
// ============================================
// Gera hash bcrypt com 10 rounds
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Número de rounds do bcrypt (padrão: 10)
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// ============================================
// VALIDAR SENHA
// ============================================
// Compara senha em texto puro com hash armazenado
export async function validatePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

// ============================================
// EXEMPLO DE USO:
// ============================================
// const senha = "MinhaSenh@123";
// const hash = await hashPassword(senha); // "$2b$10$..."
// const valido = await validatePassword(senha, hash); // true
