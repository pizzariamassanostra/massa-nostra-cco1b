// ============================================
// ENUM: UNIDADE DE MEDIDA
// ============================================
// Define como o ingrediente é medido/contado
// Usado para controle de estoque
// ============================================

export enum UnitMeasure {
  // Peso
  KG = 'kg', // Quilograma
  G = 'g', // Grama
  MG = 'mg', // Miligrama
  TON = 'ton', // Tonelada

  // Volume
  L = 'l', // Litro
  ML = 'ml', // Mililitro
  M3 = 'm3', // Metro cúbico

  // Unidade
  UN = 'un', // Unidade
  PC = 'pc', // Peça
  CX = 'cx', // Caixa
  PCT = 'pct', // Pacote
  FARDO = 'fardo', // Fardo
  SACO = 'saco', // Saco

  // Comprimento
  M = 'm', // Metro
  CM = 'cm', // Centímetro
  MM = 'mm', // Milímetro
}
