// ============================================
// DTO: CRIAR PEDIDO DE COMPRA
// ============================================

import {
  IsInt,
  IsString,
  // IsDecimal, // Comentado: avaliar necessidade futura para valores monetários
  IsEnum,
  // IsDateString, // Comentado: avaliar necessidade futura para datas
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import { SupplierPaymentMethod } from '../enums/payment-method.enum';

// DTO para itens do pedido de compra
export class PurchaseOrderItemDto {
  // Nome do produto ou serviço
  @IsString()
  product_name: string;

  // Quantidade solicitada
  @IsInt()
  quantity: number;

  // Unidade de medida (ex.: kg, unidade, caixa)
  @IsString()
  unit: string;

  // Preço unitário do item
  @IsNumber()
  unit_price: number;

  // Valor total do item (unit_price * quantity)
  @IsNumber()
  total_price: number;
}

// DTO principal para criação de pedido de compra
export class CreatePurchaseOrderDto {
  // Identificador do fornecedor
  @IsInt()
  supplier_id: number;

  // Lista de itens do pedido (validados individualmente)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];

  // Valor total do pedido
  @IsNumber()
  total_value: number;

  // Método de pagamento (enum)
  @IsEnum(SupplierPaymentMethod)
  payment_method: SupplierPaymentMethod;

  // Data prevista para entrega (string, considerar uso de @IsDateString)
  @IsString()
  expected_delivery_date: string; // Exemplo: "2025-12-05"

  // Data real de entrega (opcional)
  @IsString()
  @IsOptional()
  actual_delivery_date?: string; // Exemplo: "2025-12-05"

  // Status do pedido (enum)
  @IsEnum(PurchaseOrderStatus)
  @IsOptional()
  status?: PurchaseOrderStatus;

  // Observações adicionais (opcional)
  @IsString()
  @IsOptional()
  notes?: string;

  // Identificador do usuário que aprovou o pedido (opcional)
  @IsInt()
  @IsOptional()
  approved_by?: number;
}
