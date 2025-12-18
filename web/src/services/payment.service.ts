// ============================================
// SERVIÇO: PAGAMENTOS
// ============================================
// Responsável por comunicar com a API de pagamentos,
// incluindo geração de QR Code PIX e validação de status.
// ============================================

import api from "./api.service";

// ============================================
// CONFIGURAÇÃO BASE DA API
// ============================================
// Define a URL base da API (Render ou Localhost)
// ============================================
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3001");

// ============================================
// INTERFACES DE TIPOS
// ============================================
// Estruturas de dados retornadas e enviadas para a API
// ============================================
interface PixQrCodeResponse {
  ok: boolean;
  message: string;
  pix: {
    qr_code: string; // Código PIX copiável
    qr_code_base64: string; // QR Code em formato imagem base64
    payment_id: string; // ID do pagamento no MercadoPago
    ticket_url: string; // URL para validar pagamento
    status: string; // Status do pagamento
  };
}

// Estrutura de dados para requisição de geração de PIX
interface GeneratePixRequest {
  orderId: number; // ID do pedido criado
  amount: number; // Valor total em CENTAVOS (ex: R$ 50,00 = 5000)
  email: string; // E-mail do cliente
}

// ============================================================================
// CLASSE DE SERVIÇO
// Responsável por gerenciar todas as requisições relacionadas a pagamentos
// ============================================================================
class PaymentService {
  // Gera QR Code PIX para pagamento
  async generatePixQrCode(
    orderId: number,
    totalInCents: number,
    customerEmail: string
  ): Promise<PixQrCodeResponse> {
    try {
      // Buscar token do localStorage
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      // Preparar dados para enviar
      const payload: GeneratePixRequest = {
        orderId,
        amount: totalInCents,
        email: customerEmail,
      };

      // Fazer requisição POST para API PIX
      const response = await fetch(`${API_BASE}/payment/pix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Validar resposta
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao gerar QR Code PIX");
      }

      // Retornar dados do QR Code
      const data: PixQrCodeResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      throw error;
    }
  }

  // Valida se pagamento PIX foi confirmado
  async validatePixPayment(paymentId: string) {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (!token) {
        throw new Error("Token não encontrado.");
      }

      // Requisição para verificar status
      const response = await fetch(
        `${API_BASE}/payment/find-one/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao validar pagamento");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao validar PIX:", error);
      throw error;
    }
  }
}

// ============================================
// EXPORTAR INSTÂNCIA ÚNICA
// ============================================
export const paymentService = new PaymentService();
