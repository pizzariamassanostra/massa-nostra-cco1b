// ============================================
// ENUM: TIPO DE MOVIMENTAÇÃO DE ESTOQUE
// ============================================
// Define se é entrada ou saída de estoque
// E o motivo da movimentação
// ============================================

export enum MovementType {
  // ENTRADAS (+)
  PURCHASE = 'purchase', // Compra de fornecedor
  RETURN = 'return', // Devolução de cliente
  ADJUSTMENT_IN = 'adjustment_in', // Ajuste (aumentar estoque)
  TRANSFER_IN = 'transfer_in', // Transferência entre lojas

  // SAÍDAS (-)
  SALE = 'sale', // Venda/Consumo (produção)
  LOSS = 'loss', // Perda (vencimento, quebra)
  THEFT = 'theft', // Furto
  DONATION = 'donation', // Doação
  ADJUSTMENT_OUT = 'adjustment_out', // Ajuste (diminuir estoque)
  TRANSFER_OUT = 'transfer_out', // Transferência entre lojas

  // NEUTRAS (sem efeito no estoque)
  INVENTORY = 'inventory', // Inventário (contagem)
}
