/**
 * ============================================
 * HELPER: Generate Order Number
 * ============================================
 * Gera número único e legível do pedido
 * Formato: ORD-YYYYMMDD-XXXXXX
 * Exemplo: ORD-20251130-000045
 *
 * Uso no OrderService:
 * const orderNumber = generateOrderNumber(savedOrder.id);
 * savedOrder.order_number = orderNumber;
 * await this.orderRepo.save(savedOrder);
 * ============================================
 */

/**
 * ============================================
 * FUNCTION: generateOrderNumber
 * ============================================
 * @param orderId - ID do pedido gerado pelo banco (PK)
 * @returns - String com formato ORD-YYYYMMDD-XXXXXX
 *
 * Exemplo:
 * generateOrderNumber(45) => "ORD-20251130-000045"
 * generateOrderNumber(1234) => "ORD-20251130-001234"
 * ============================================
 */
export function generateOrderNumber(orderId: number): string {
  // Extrair data no formato YYYYMMDD
  // Exemplo: 2025-11-30 => 20251130
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;

  // Formatar ID com 6 dígitos (padding com zeros à esquerda)
  // Exemplo: 45 => 000045, 1234 => 001234
  const paddedId = String(orderId).padStart(6, '0');

  // Concatenar no formato final: ORD-YYYYMMDD-XXXXXX
  // Exemplo: ORD-20251130-000045
  return `ORD-${dateString}-${paddedId}`;
}
