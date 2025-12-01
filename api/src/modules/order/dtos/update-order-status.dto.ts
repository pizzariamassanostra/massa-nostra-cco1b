// ============================================
// DTO: ATUALIZAR STATUS DO PEDIDO
// ============================================
// Representa os dados necessários para atualizar o status de um pedido,
// incluindo o novo status e observações opcionais.
// ============================================

import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  // Novo status do pedido
  // Valores permitidos: pending | confirmed | preparing | on_delivery | delivered | cancelled
  @IsIn([
    'pending',
    'confirmed',
    'preparing',
    'on_delivery',
    'delivered',
    'cancelled',
  ])
  status: string;

  // Observações adicionais sobre a mudança de status (opcional)
  @IsOptional()
  @IsString()
  notes?: string;
}
