// ============================================
// SERVIÇO: CONFIGURAÇÃO BASE DA API
// ============================================
// Configuração do Axios com interceptors
// Base URL, timeout, headers, autenticação JWT
// ============================================

import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

// Criar instância do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// INTERCEPTOR DE REQUEST
// ============================================
// Adiciona token JWT automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Pegar token do localStorage
    if (globalThis !== undefined) {
      const token = localStorage.getItem("auth_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR DE RESPONSE
// ============================================
// Trata erros globalmente e redireciona em caso de 401
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<any>) => {
    // Erro 401: Não autenticado
    if (error.response?.status === 401) {
      if (globalThis !== undefined) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        globalThis.location.href = "/login";
      }
    }

    // Erro 403: Sem permissão
    if (error.response?.status === 403) {
      toast.error("Você não tem permissão para acessar este recurso");
    }

    // Erro 404: Não encontrado
    if (error.response?.status === 404) {
      toast.error("Recurso não encontrado");
    }

    // Erro 500: Erro interno do servidor
    if (error.response?.status === 500) {
      toast.error("Erro interno do servidor. Tente novamente mais tarde.");
    }

    return Promise.reject(error);
  }
);

export default api;
