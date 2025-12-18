// ============================================
// FUNÇÕES UTILITÁRIAS: STATUS DE PAGAMENTO
// ============================================

import { PaymentStatus } from "../enum/payment-status.enum";

// ============================================
// FUNÇÃO: translatePaymentStatus
// ============================================
// Retorna a descrição em português do status de pagamento
// ============================================
export function translatePaymentStatus(status: PaymentStatus): string {
  const translations: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "Aguardando Pagamento", // Pagamento pendente
    [PaymentStatus.APPROVED]: "Pago", // Pagamento aprovado
    [PaymentStatus.REJECTED]: "Recusado", // Pagamento recusado
    [PaymentStatus.CANCELLED]: "Cancelado", // Pagamento cancelado
    [PaymentStatus.REFUNDED]: "Reembolsado", // Pagamento reembolsado
  };

  // Retorna a tradução correspondente ou o próprio status como fallback
  return translations[status] || status;
}

// ============================================
// FUNÇÃO: getPaymentStatusColor
// ============================================
// Retorna classes CSS de cor conforme o status de pagamento
// ============================================
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800", // Em espera
    [PaymentStatus.APPROVED]: "bg-green-100 text-green-800", // Aprovado
    [PaymentStatus.REJECTED]: "bg-red-100 text-red-800", // Recusado
    [PaymentStatus.CANCELLED]: "bg-gray-100 text-gray-800", // Cancelado
    [PaymentStatus.REFUNDED]: "bg-blue-100 text-blue-800", // Reembolsado
  };

  // Retorna a cor correspondente ou uma cor padrão
  return colors[status] || "bg-gray-100 text-gray-800";
}
