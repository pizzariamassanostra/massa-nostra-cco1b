// ============================================
// DTO: FILTROS DE RELATÓRIOS
// ============================================
// Validação de filtros para consultas
// ============================================

import { IsOptional, IsDateString, IsIn } from 'class-validator';

export class ReportFilterDto {
  // ============================================
  // DATA INICIAL
  // ============================================
  @IsOptional()
  @IsDateString()
  start_date?: string;

  // ============================================
  // DATA FINAL
  // ============================================
  @IsOptional()
  @IsDateString()
  end_date?: string;

  // ============================================
  // PERÍODO PRÉ-DEFINIDO
  // ============================================
  @IsOptional()
  @IsIn(['today', 'week', 'month', 'year', 'custom'])
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';

  // ============================================
  // STATUS DO PEDIDO
  // ============================================
  @IsOptional()
  @IsIn([
    'all',
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'delivering',
    'delivered',
    'cancelled',
  ])
  status?: string;

  // ============================================
  // FORMA DE PAGAMENTO
  // ============================================
  @IsOptional()
  @IsIn(['all', 'pix', 'dinheiro', 'cartao_debito', 'cartao_credito'])
  payment_method?: string;
}

export class TopProductsFilterDto extends ReportFilterDto {
  // ============================================
  // LIMITE DE PRODUTOS
  // ============================================
  @IsOptional()
  limit?: number = 10;
}
