// ============================================
// INTERFACE: USUÁRIO COMUM (CLIENTE)
// ============================================
export interface CommonUser {
  id: number;
  name: string;
  cpf: string;
  birth_date: string;
  phone: string;
  phone_alternative: string | null;
  email: string;
  accept_terms: boolean;
  accept_promotions: boolean;
  created_at: string;
  updated_at: string;
}

// DTO para cadastro
export interface RegisterDto {
  name: string;
  cpf: string;
  birth_date: string;
  phone: string;
  phone_alternative?: string;
  email: string;
  password: string;
  accept_terms: boolean;
  accept_promotions: boolean;
}

// DTO para login
export interface LoginDto {
  username: string; // Email ou telefone
  password: string;
}

// Resposta de login
export interface LoginResponse {
  ok: boolean;
  message: string;
  user: CommonUser;
  access_token: string;
}
