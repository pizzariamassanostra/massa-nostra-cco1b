// ============================================
// ENUM: STATUS DO PEDIDO DE COMPRA
// ============================================

export enum PurchaseOrderStatus {
  // Pedido criado, aguardando aprovação
  DRAFT = 'draft',

  // Aguardando aprovação do responsável
  PENDING_APPROVAL = 'pending_approval',

  // Aprovado e enviado ao fornecedor
  APPROVED = 'approved',

  // Fornecedor confirmou recebimento
  CONFIRMED = 'confirmed',

  // Em processo de entrega
  IN_TRANSIT = 'in_transit',

  // Entregue, aguardando conferência
  DELIVERED = 'delivered',

  // Conferido e aprovado
  RECEIVED = 'received',

  // Finalizado (nota fiscal lançada)
  COMPLETED = 'completed',

  // Cancelado
  CANCELLED = 'cancelled',

  // Parcialmente recebido
  PARTIAL = 'partial',
}
