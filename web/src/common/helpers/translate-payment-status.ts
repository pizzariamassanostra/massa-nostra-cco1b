// ============================================
// FUNÇÕES: TRADUÇÃO DE STATUS DE PAGAMENTO
// ============================================
// Fornece utilitários para:
// - Traduzir status de pagamento (enum) para texto em português.
// - Definir classes de cor (Tailwind) para badges de status.
// ============================================

import { PaymentStatus } from "../enum/payment-status.enum";

// Retorna o texto em português correspondente ao status
export function translatePaymentStatus(status: PaymentStatus): string {
  const translations: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "Aguardando Pagamento",
    [PaymentStatus.APPROVED]: "Pago",
    [PaymentStatus.REJECTED]: "Recusado",
    [PaymentStatus.CANCELLED]: "Cancelado",
    [PaymentStatus.REFUNDED]: "Reembolsado",
  };

  // Caso não exista tradução, retorna o próprio status
  return translations[status] || status;
}

// Retorna classes de cor para estilização do badge
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800", // Em espera
    [PaymentStatus.APPROVED]: "bg-green-100 text-green-800", // Aprovado
    [PaymentStatus.REJECTED]: "bg-red-100 text-red-800", // Recusado
    [PaymentStatus.CANCELLED]: "bg-gray-100 text-gray-800", // Cancelado
    [PaymentStatus.REFUNDED]: "bg-blue-100 text-blue-800", // Reembolsado
  };

  // Caso não exista cor definida, usa padrão cinza
  return colors[status] || "bg-gray-100 text-gray-800";
}
