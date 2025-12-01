// ============================================
// SERVIÇO: API CLIENT (Axios + Next.js)
// ============================================
// Configura cliente HTTP Axios para toda a aplicação.
// - Define cabeçalhos padrão.
// - Usa variável de ambiente ou localhost como baseURL.
// - Intercepta requisições para adicionar token de autenticação.
// - Intercepta respostas para tratar sessão expirada.
// - Exibe alerta e redireciona usuário em caso de erro de sessão.
// ============================================

import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import { redirect } from "next/navigation";

// Cabeçalhos padrão para todas as requisições
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "69420", // ignora aviso do ngrok se usado
};

// Cliente API (Axios)
const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers,
});

// Interceptor de requisição: adiciona token de autenticação se existir
Api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("user_token");
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: trata erros de autenticação e sessão expirada
Api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const message = error.response?.data?.error?.message;

    // Lista de mensagens que indicam sessão inválida ou expirada
    const sessionErrors = [
      "missing-token",
      "invalid signature",
      "token-expired",
      "unauthorized",
    ];

    // Se for erro de sessão, limpa token e exibe alerta
    if (sessionErrors.includes(message)) {
      localStorage.clear();

      const handleConfirmDialog = () => {
        confirmAlert({
          closeOnClickOutside: false,
          title: "Atenção",
          message: "Sua sessão expirou, faça login novamente",
          buttons: [
            {
              label: "Ok",
              onClick: () => {
                redirect("/");
              },
            },
          ],
        });
      };

      return handleConfirmDialog();
    }

    // Retorna outros erros normalmente
    return Promise.reject(error);
  }
);

// Exporta instância configurada para uso em toda a aplicação
export default Api;
