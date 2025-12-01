// ============================================
// ENUM: STATUS DA COTAÇÃO
// ============================================

export enum QuoteStatus {
  // Cotação criada, aguardando envio
  PENDING = 'pending',

  // Enviada aos fornecedores
  SENT = 'sent',

  // Propostas recebidas
  RECEIVED = 'received',

  // Análise de propostas em andamento
  UNDER_ANALYSIS = 'under_analysis',

  // Fornecedor escolhido
  APPROVED = 'approved',

  // Cotação cancelada
  CANCELLED = 'cancelled',

  // Convertida em pedido de compra
  CONVERTED = 'converted',
}
