// ============================================
// SERVIÇO: AUTENTICAÇÃO
// ============================================
// Responsável por login, cadastro e logout
// Gerencia token JWT e dados do usuário
// ============================================

import api from "./api.service";
import { CommonUser } from "@/common/interfaces/common-users.interface";

// ============================================
// INTERFACES DE TIPOS
// ============================================
// Estruturas de dados utilizadas para autenticação
// ============================================

// Estrutura de dados para login
interface LoginDto {
  username: string; // Email ou telefone
  password: string;
}

// Estrutura de dados para cadastro
interface RegisterDto {
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

// Estrutura de resposta ao login/cadastro
interface LoginResponse {
  ok: boolean;
  message: string;
  user: CommonUser;
  access_token: string;
}

// ============================================================================
// CLASSE DE SERVIÇO
// Responsável por fazer todas as requisições relacionadas à autenticação
// ============================================================================
class AuthService {
  // ============================================
  // LOGIN
  // ============================================
  // Faz login com email/telefone e senha
  // Armazena token e dados do usuário no localStorage
  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/customer/login", data);

    if (response.data.ok) {
      // Salvar token no localStorage
      localStorage.setItem("auth_token", response.data.access_token);

      // Salvar dados do usuário no localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  }

  // ============================================
  // CADASTRO
  // ============================================
  // Realiza cadastro de novo usuário e armazena token
  async register(data: RegisterDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/customer/register", data);

    if (response.data.ok) {
      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  }

  // ============================================
  // LOGOUT
  // ============================================
  // Remove dados de autenticação e redireciona para home
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    globalThis.location.href = "/";
  }

  // ============================================
  // VERIFICAR SE ESTÁ AUTENTICADO
  // ============================================
  // Retorna true se existir token armazenado
  isAuthenticated(): boolean {
    if (globalThis.window === undefined) {
      return false;
    }
    return !!localStorage.getItem("auth_token");
  }

  // ============================================
  // PEGAR USUÁRIO LOGADO
  // ============================================
  // Retorna dados do usuário armazenados no localStorage
  getUser(): CommonUser | null {
    if (globalThis.window === undefined) {
      return null;
    }
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // ============================================
  // PEGAR TOKEN
  // ============================================
  // Retorna token JWT armazenado
  getToken(): string | null {
    if (globalThis.window === undefined) {
      return null;
    }
    return localStorage.getItem("auth_token");
  }

  // ============================================
  // ATUALIZAR PERFIL
  // ============================================
  // Atualiza dados do usuário e salva no localStorage
  async updateProfile(
    data: Partial<CommonUser>
  ): Promise<{ ok: boolean; user: CommonUser }> {
    const response = await api.put("/customer/profile", data);

    if (response.data.ok) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  }

  // ============================================
  // DELETAR CONTA
  // ============================================
  // Remove conta do usuário e executa logout
  async deleteAccount(): Promise<{ ok: boolean; message: string }> {
    const response = await api.delete("/customer/account");

    if (response.data.ok) {
      this.logout();
    }

    return response.data;
  }
}

// ============================================
// EXPORTAR INSTÂNCIA ÚNICA
// ============================================
export const authService = new AuthService();
