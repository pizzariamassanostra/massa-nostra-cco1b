// ============================================
// SERVIÇO: API CLIENTE (Axios + Next.js)
// ============================================

import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import { redirect } from "next/navigation";

// ============================================
// OBJETO: Cabeçalhos padrão para requisições HTTP
// ============================================
const headers = {
  Accept: "application/json", // Aceita respostas em JSON
  "Content-Type": "application/json", // Envia dados no formato JSON
  "ngrok-skip-browser-warning": "69420", // Ignora aviso do Ngrok no navegador
};

// ============================================
// INSTÂNCIA: Cliente Axios configurado
// ============================================
const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers,
});

// ============================================
// INTERCEPTOR: Requisição
// ============================================
Api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("auth_token"); // Recupera token salvo

  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`; // Insere token no header
  }

  return config; // Retorna configuração atualizada
});

// ============================================
// INTERCEPTOR: Resposta
// ============================================
Api.interceptors.response.use(
  function (response) {
    return response; // Retorna resposta normalmente em caso de sucesso
  },
  function (error) {
    const message = error.response?.data?.error?.message; // Mensagem de erro retornada pela API

    // Lista de mensagens que indicam sessão inválida ou expirada
    const sessionErrors = [
      "missing-token",
      "invalid signature",
      "token-expired",
      "unauthorized",
    ];

    // Se for erro de sessão, limpa token e exibe alerta
    if (sessionErrors.includes(message)) {
      localStorage.clear(); // Remove dados de autenticação

      const handleConfirmDialog = () => {
        confirmAlert({
          closeOnClickOutside: false, // Impede fechar clicando fora
          title: "Atenção", // Título do alerta
          message: "Sua sessão expirou, faça login novamente", // Mensagem exibida
          buttons: [
            {
              label: "Ok",
              onClick: () => {
                redirect("/"); // Redireciona para login
              },
            },
          ],
        });
      };

      return handleConfirmDialog(); // Executa alerta
    }

    // Retorna outros erros normalmente
    return Promise.reject(error);
  }
);

// ============================================
// EXPORTAÇÃO: Instância Axios configurada
// ============================================
export default Api;
