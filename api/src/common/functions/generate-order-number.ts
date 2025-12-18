// ============================================
// HELPER: GENERATE ORDER NUMBER
// ============================================
// Gera número único e legível para pedidos
// Formato: ORD-YYYYMMDD-XXXXXX
// Exemplo: ORD-20251130-000045
//
// Uso no OrderService:
// const orderNumber = generateOrderNumber(savedOrder.id);
// savedOrder.order_number = orderNumber;
// await this.orderRepo.save(savedOrder);
// ============================================

// ============================================
// FUNÇÃO: generateOrderNumber
// ============================================
// Recebe o ID do pedido (PK)
// Retorna string formatada no padrão do sistema
// ============================================
const generateOrderNumber = (orderId: number): string => {
  // Obtém a data atual
  const now = new Date();

  // Extrai ano no formato YYYY
  const year = now.getFullYear();

  // Extrai mês no formato MM (01-12)
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Extrai dia no formato DD (01-31)
  const day = String(now.getDate()).padStart(2, '0');

  // Concatena data no formato YYYYMMDD
  const dateString = `${year}${month}${day}`;

  // Formata o ID com 6 dígitos (padding à esquerda)
  const paddedId = String(orderId).padStart(6, '0');

  // Retorna número do pedido no formato final
  return `ORD-${dateString}-${paddedId}`;
};

// ============================================
// EXPORTAÇÃO
// ============================================
export { generateOrderNumber };
