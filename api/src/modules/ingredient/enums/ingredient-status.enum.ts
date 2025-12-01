// ============================================
// ENUM: STATUS DO INGREDIENTE
// ============================================
// Define se o ingrediente está disponível
// para uso no estoque
// ============================================

export enum IngredientStatus {
  ACTIVE = 'active', // Ativo (em uso)
  INACTIVE = 'inactive', // Inativo (não usado mais)
  BLOCKED = 'blocked', // Bloqueado (problema detectado)
}
