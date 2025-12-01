// ============================================
// DTO: CRIAR COTAÇÃO
// ============================================

import {
  IsInt,
  IsString,
  IsOptional,
  // IsDecimal, // Comentado: avaliar necessidade futura para valores monetários
  IsEnum,
  // IsDateString, // Comentado: avaliar necessidade futura para datas
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteStatus } from '../enums/quote-status.enum';

// DTO para itens da cotação
export class QuoteItemDto {
  // Nome do produto ou serviço
  @IsString()
  product_name: string;

  // Quantidade solicitada
  @IsInt()
  quantity: number;

  // Unidade de medida (ex.: kg, unidade, caixa)
  @IsString()
  unit: string;

  // Preço estimado por item (opcional)
  @IsNumber()
  @IsOptional()
  estimated_price?: number;
}

// DTO principal para criação de cotação
export class CreateQuoteDto {
  // Identificador do fornecedor que está enviando a cotação
  @IsInt()
  supplier_id: number;

  // Lista de itens da cotação (validados individualmente)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  // Valor total da cotação (opcional)
  @IsNumber()
  @IsOptional()
  total_value?: number;

  // Prazo de entrega em dias (opcional)
  @IsInt()
  @IsOptional()
  delivery_days?: number;

  // Prazo de pagamento em dias (opcional)
  @IsInt()
  @IsOptional()
  payment_days?: number;

  // Status da cotação (enum)
  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  // Observações adicionais (opcional)
  @IsString()
  @IsOptional()
  notes?: string;

  // Data de validade da cotação (opcional, considerar uso de @IsDateString)
  @IsString()
  @IsOptional()
  validity_date?: string;
}
