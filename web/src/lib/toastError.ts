// ============================================
// FUNÇÃO: TOAST ERROR
// ============================================
// Exibe mensagens de erro amigáveis usando react-toastify.
// Faz tratamento de diferentes formatos de erro vindos da API.
// ============================================

import { toast } from "react-toastify";

export function toastError(error: any) {
  // Mensagem padrão caso não seja possível identificar o erro
  let message = "Erro desconhecido";

  if (error) {
    // Verifica se existe mensagem em errors[0].userMessage
    if (error?.response?.data?.errors?.[0]?.userMessage)
      message = error.response.data.errors[0].userMessage;
    // Verifica se existe mensagem em errors[0].message
    else if (error?.response?.data?.errors?.[0]?.message)
      message = error.response.data.errors[0].message;
    // Verifica se existe userMessage direto na resposta
    else if (error.response?.data?.userMessage)
      message = error.response.data.userMessage;
    // Verifica se existe message direto na resposta
    else if (error.response?.data?.message)
      message = error.response.data.message;
    // Verifica se existe userMessage dentro de error
    else if (error?.response?.data?.error.userMessage)
      message = error.response.data.error.userMessage;
    // Verifica se existe userMessage direto no objeto error
    else if (error.userMessage) message = error.userMessage;
    // Verifica se existe message direto no objeto error
    else if (error.message) message = error.message;
    // Caso o erro seja apenas uma string
    else if (typeof error === "string") message = error;
  }

  // Exibe mensagem de erro no toast
  toast.error(message);
}
