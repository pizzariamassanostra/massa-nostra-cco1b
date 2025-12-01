// ============================================
// SERVIÇO: CONFIGURAÇÃO BASE DA API
// ============================================
// Configuração do Axios com interceptors
// Base URL, timeout, headers, autenticação JWT
// ============================================

import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://massa-nostra-cco1b-1.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// INTERCEPTOR DE REQUEST
api.interceptors.request.use(
  (config) => {
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

// INTERCEPTOR DE RESPONSE
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      if (globalThis !== undefined) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        globalThis.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      toast.error("Você não tem permissão para acessar este recurso");
    }

    if (error.response?.status === 404) {
      toast.error("Recurso não encontrado");
    }

    if (error.response?.status === 500) {
      toast.error("Erro interno do servidor. Tente novamente mais tarde.");
    }

    return Promise.reject(error);
  }
);

export default api;
