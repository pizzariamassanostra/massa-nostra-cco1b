// ============================================
// ENTITY: FORNECEDORES
// ============================================
// Cadastro completo de fornecedores
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { SupplierStatus } from '../enums/supplier-status.enum';
import { SupplierQuote } from './supplier-quote.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { SupplierEvaluation } from './supplier-evaluation.entity';

@Entity('suppliers')
export class Supplier {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // DADOS FISCAIS (OBRIGATÓRIOS)
  // ============================================
  @Column({ type: 'varchar', length: 200 })
  razao_social: string; // Razão Social completa

  @Column({ type: 'varchar', length: 200, nullable: true })
  nome_fantasia: string; // Nome Fantasia

  @Column({ type: 'varchar', length: 18, unique: true })
  cnpj: string; // CNPJ (validado + único)

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscricao_estadual: string; // IE

  // ============================================
  // CONTATO (OBRIGATÓRIO)
  // ============================================
  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  telefone_principal: string; // Com WhatsApp

  @Column({ type: 'boolean', default: true })
  whatsapp_disponivel: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone_alternativo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  site: string;

  // ============================================
  // ENDEREÇO COMPLETO
  // ============================================
  @Column({ type: 'varchar', length: 10 })
  cep: string;

  @Column({ type: 'varchar', length: 255 })
  rua: string;

  @Column({ type: 'varchar', length: 10 })
  numero: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento: string;

  @Column({ type: 'varchar', length: 100 })
  bairro: string;

  @Column({ type: 'varchar', length: 100 })
  cidade: string;

  @Column({ type: 'varchar', length: 2 })
  estado: string; // UF (MG, SP, RJ...)

  @Column({ type: 'text', nullable: true })
  ponto_referencia: string;

  // ============================================
  // DADOS BANCÁRIOS (PARA PAGAMENTO)
  // ============================================
  @Column({ type: 'varchar', length: 100, nullable: true })
  banco: string; // Ex: Banco do Brasil

  @Column({ type: 'varchar', length: 10, nullable: true })
  agencia: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  conta: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  tipo_conta: string; // Corrente

  @Column({ type: 'varchar', length: 100, nullable: true })
  pix: string; // Chave PIX

  // ============================================
  // INFORMAÇÕES COMERCIAIS
  // ============================================
  @Column({ type: 'text', nullable: true })
  produtos_servicos: string; // Produtos/serviços oferecidos

  @Column({ type: 'text', nullable: true })
  condicoes_comerciais: string; // Prazos, condições...

  @Column({ type: 'int', nullable: true })
  prazo_entrega_dias: number; // Prazo médio de entrega

  @Column({ type: 'int', nullable: true })
  prazo_pagamento_dias: number; // Prazo de pagamento

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  desconto_padrao: number; // % de desconto padrão

  // ============================================
  // AVALIAÇÃO E CLASSIFICAÇÃO
  // ============================================
  @Column({
    type: 'enum',
    enum: SupplierStatus,
    default: SupplierStatus.PRE_REGISTERED,
  })
  status: SupplierStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  nota_avaliacao: number; // Nota de 0 a 5

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'text', nullable: true })
  observacoes_internas: string; // Visível apenas para admin

  // ============================================
  // RELACIONAMENTOS
  // ============================================
  @OneToMany(() => SupplierQuote, (quote) => quote.supplier)
  quotes: SupplierQuote[]; // Cotações enviadas

  @OneToMany(() => PurchaseOrder, (order) => order.supplier)
  purchase_orders: PurchaseOrder[]; // Pedidos de compra

  @OneToMany(() => SupplierEvaluation, (evaluation) => evaluation.supplier)
  evaluations: SupplierEvaluation[]; // Avaliações recebidas

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
