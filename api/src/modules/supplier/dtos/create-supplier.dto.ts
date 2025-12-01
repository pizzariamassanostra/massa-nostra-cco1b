// ============================================
// DTO: CRIAR FORNECEDOR
// ============================================

import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  // IsDecimal,   // Comentado: avaliar necessidade futura para valores monetários
  IsEnum,
  Length,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { SupplierStatus } from '../enums/supplier-status.enum';

export class CreateSupplierDto {
  // Razão social obrigatória (nome jurídico da empresa)
  @IsString()
  @Length(3, 200)
  razao_social: string;

  // Nome fantasia opcional (nome comercial)
  @IsString()
  @IsOptional()
  @Length(3, 200)
  nome_fantasia?: string;

  // CNPJ obrigatório (14 a 18 caracteres considerando máscara)
  @IsString()
  @Length(14, 18)
  cnpj: string;

  // Inscrição estadual opcional
  @IsString()
  @IsOptional()
  @Length(5, 20)
  inscricao_estadual?: string;

  // E-mail de contato principal
  @IsEmail()
  email: string;

  // Telefone principal obrigatório
  @IsString()
  @Length(10, 20)
  telefone_principal: string;

  // Indica se o WhatsApp está disponível nesse número
  @IsBoolean()
  @IsOptional()
  whatsapp_disponivel?: boolean;

  // Telefone alternativo opcional
  @IsString()
  @IsOptional()
  @Length(10, 20)
  telefone_alternativo?: string;

  // Site da empresa (opcional)
  @IsString()
  @IsOptional()
  @Length(10, 255)
  site?: string;

  // Endereço completo
  @IsString()
  @Length(8, 10)
  cep: string;

  @IsString()
  @Length(3, 255)
  rua: string;

  @IsString()
  @Length(1, 10)
  numero: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @IsString()
  @Length(3, 100)
  bairro: string;

  @IsString()
  @Length(3, 100)
  cidade: string;

  @IsString()
  @Length(2, 2)
  estado: string;

  @IsString()
  @IsOptional()
  ponto_referencia?: string;

  // Dados bancários (opcionais)
  @IsString()
  @IsOptional()
  @Length(3, 100)
  banco?: string;

  @IsString()
  @IsOptional()
  @Length(1, 10)
  agencia?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  conta?: string;

  @IsString()
  @IsOptional()
  tipo_conta?: string;

  @IsString()
  @IsOptional()
  @Length(5, 100)
  pix?: string;

  // Informações comerciais
  @IsString()
  @IsOptional()
  produtos_servicos?: string;

  @IsString()
  @IsOptional()
  condicoes_comerciais?: string;

  // Prazos de entrega e pagamento (em dias)
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(365)
  prazo_entrega_dias?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(365)
  prazo_pagamento_dias?: number;

  // Percentual de desconto padrão (0 a 100)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  desconto_padrao?: number;

  // Status do fornecedor (enum)
  @IsEnum(SupplierStatus)
  @IsOptional()
  status?: SupplierStatus;

  // Observações gerais e internas
  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsOptional()
  observacoes_internas?: string;
}
