// ============================================
// MODELOS / INTERFACES: USUÁRIO COMUM (CLIENTE)
// ============================================

// ============================================
// INTERFACE: CommonUser
// ============================================
export interface CommonUser {
  id: number; // ID do usuário
  name: string; // Nome completo
  cpf: string; // CPF do usuário
  birth_date: string; // Data de nascimento
  phone: string; // Telefone principal
  phone_alternative: string | null; // Telefone alternativo (opcional)
  email: string; // E-mail do usuário
  accept_terms: boolean; // Aceitou os termos de uso
  accept_promotions: boolean; // Aceitou receber promoções
  created_at: string; // Data de criação do registro
  updated_at: string; // Data da última atualização
}

// ============================================
// DTO: RegisterDto (Cadastro de Usuário)
// ============================================
export interface RegisterDto {
  name: string; // Nome completo
  cpf: string; // CPF
  birth_date: string; // Data de nascimento
  phone: string; // Telefone principal
  phone_alternative?: string; // Telefone alternativo (opcional)
  email: string; // E-mail
  password: string; // Senha de acesso
  accept_terms: boolean; // Aceite dos termos obrigatórios
  accept_promotions: boolean; // Aceite para receber promoções
}

// ============================================
// DTO: LoginDto (Login do Usuário)
// ============================================
export interface LoginDto {
  username: string; // E-mail ou telefone
  password: string; // Senha
}

// ============================================
// INTERFACE: LoginResponse (Resposta de Autenticação)
// ============================================
export interface LoginResponse {
  ok: boolean; // Indica sucesso na operação
  message: string; // Mensagem retornada pela API
  user: CommonUser; // Dados do usuário autenticado
  access_token: string; // Token JWT
}
