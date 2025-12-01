// ============================================
// INTERFACE: RESUMO DE ESTOQUE
// ============================================
// Estrutura para retorno de resumo de estoque
// ============================================

export interface StockSummary {
  ingredient_id: number;
  ingredient_name: string;
  total_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  minimum_quantity: number;
  maximum_quantity: number;
  total_value: number;
  needs_restock: boolean; // Precisa repor?
  has_expired_stock: boolean; // Tem lotes vencidos?
  near_expiry_count: number; // Lotes próximos ao vencimento
}
