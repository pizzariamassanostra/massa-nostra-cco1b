// ============================================
// ENUM: STATUS DO FORNECEDOR
// ============================================

export enum SupplierStatus {
  // Pré-cadastro - aguardando documentos
  PRE_REGISTERED = 'pre_registered',

  // Em análise - avaliação técnica/financeira
  UNDER_REVIEW = 'under_review',

  // Ativo - liberado para cotações
  ACTIVE = 'active',

  // Inativo - não pode receber cotações
  INACTIVE = 'inactive',

  // Bloqueado - problemas identificados
  BLOCKED = 'blocked',

  // Reprovado - não passou na avaliação
  REJECTED = 'rejected',
}
