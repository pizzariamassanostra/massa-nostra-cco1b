// ============================================
// SERVICE: AUTENTICAÇÃO
// ============================================
// Serviço de login, cadastro, logout
// Gerenciamento de token JWT e dados do usuário
// ============================================

import api from "./api.service";
import { CommonUser } from "@/common/interfaces/common-users.interface";

// ============================================
// INTERFACES
// ============================================

interface LoginDto {
  username: string; // Email ou telefone
  password: string;
}

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

interface LoginResponse {
  ok: boolean;
  message: string;
  user: CommonUser;
  access_token: string;
}

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
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    globalThis.location.href = "/";
  }

  // ============================================
  // VERIFICAR SE ESTÁ AUTENTICADO
  // ============================================
  isAuthenticated(): boolean {
    if (globalThis.window === undefined) {
      return false;
    }

    return !!localStorage.getItem("auth_token");
  }

  // ============================================
  // PEGAR USUÁRIO LOGADO
  // ============================================
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
  getToken(): string | null {
    if (globalThis.window === undefined) {
      return null;
    }

    return localStorage.getItem("auth_token");
  }

  // ============================================
  // ATUALIZAR PERFIL
  // ============================================
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
  async deleteAccount(): Promise<{ ok: boolean; message: string }> {
    const response = await api.delete("/customer/account");

    if (response.data.ok) {
      this.logout();
    }

    return response.data;
  }
}

export const authService = new AuthService();
