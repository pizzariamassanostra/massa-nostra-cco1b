// ============================================
// DTO: CRIAR PEDIDO
// ============================================
// Define os campos obrigatórios para criar um pedido.
// O ID do cliente é extraído automaticamente do JWT.
// ============================================

import {
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  // ========== ENDEREÇO DE ENTREGA ==========

  // ID do endereço de entrega (deve pertencer ao cliente logado)
  @IsInt({ message: 'ID do endereço deve ser um número inteiro' })
  address_id: number;

  // ========== ITENS DO PEDIDO ==========

  // Lista de itens do pedido (produtos, variações, bordas, recheios, etc.)
  @IsArray({ message: 'Itens deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  // ========== PAGAMENTO ==========

  // Forma de pagamento: pix | dinheiro | cartao_debito | cartao_credito
  @IsIn(['pix', 'dinheiro', 'cartao_debito', 'cartao_credito'], {
    message: 'Forma de pagamento inválida',
  })
  payment_method: string;

  // ========== OBSERVAÇÕES ==========

  // Observações gerais do pedido (opcional)
  @IsOptional()
  @IsString({ message: 'Observações deve ser um texto' })
  notes?: string;

  // ========== CLIENTE ==========

  // ID do cliente (extraído automaticamente do JWT)
  common_user_id: number;
}
