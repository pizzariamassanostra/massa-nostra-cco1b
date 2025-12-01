// ============================================
// SERVIÇO: PAGAMENTOS
// ============================================
// Responsável por comunicar com a API de pagamentos,
// incluindo geração de QR Code PIX e validação de status.
// ============================================

import api from "./api.service";

/**
 * Interface para resposta do QR Code PIX
 * Retornado pela API após gerar pagamento
 */
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

/**
 * Interface para dados de entrada para gerar PIX
 */
interface GeneratePixRequest {
  orderId: number; // ID do pedido criado
  amount: number; // Valor total em CENTAVOS (ex: R$ 50,00 = 5000)
  email: string; // E-mail do cliente
}

/**
 * ============================================
 * CLASS: PAYMENT SERVICE
 * ============================================
 * Métodos para gerenciar pagamentos
 */
class PaymentService {
  /**
   * Gera QR Code PIX para pagamento
   * Chamado após cliente criar pedido e selecionar PIX
   *
   * @param orderId - ID do pedido criado
   * @param totalInCents - Valor total em centavos (R$ 50,00 = 5000)
   * @param customerEmail - E-mail do cliente
   * @returns Resposta com QR Code e dados de pagamento
   *
   * @example
   * const response = await paymentService.generatePixQrCode(15, 5000, 'lucas@email.com');
   * // Retorna: { qr_code, qr_code_base64, payment_id, ... }
   */
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

      // Fazer requisição POST para API
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          (typeof window !== "undefined" ? window.location.origin : "")
        }/payment/pix`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      // Validar resposta
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao gerar QR Code PIX");
      }

      // Retornar dados do QR Code
      const data: PixQrCodeResponse = await response.json();
      return data;
    } catch (error) {
      // Log do erro para debug
      console.error("Erro ao gerar PIX:", error);
      throw error;
    }
  }

  /**
   * Valida se pagamento PIX foi confirmado
   * Chamado periodicamente enquanto modal está aberto
   *
   * @param paymentId - ID do pagamento retornado ao gerar QR Code
   * @returns Status atual do pagamento
   */
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
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          (typeof window !== "undefined" ? window.location.origin : "")
        }/payment/find-one/${paymentId}`,
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
// Usar em toda aplicação como singleton
export const paymentService = new PaymentService();
