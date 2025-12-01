// ============================================
// ENTITY: COTAÇÕES DE FORNECEDORES
// ============================================
// Sistema de cotação e comparação de preços
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { QuoteStatus } from '../enums/quote-status.enum';

@Entity('supplier_quotes')
export class SupplierQuote {
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // RELACIONAMENTO COM FORNECEDOR
  // ============================================
  @Column()
  supplier_id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.quotes)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  // ============================================
  // DADOS DA COTAÇÃO
  // ============================================
  @Column({ type: 'varchar', length: 50, unique: true })
  quote_number: string; // COT-20251124-001

  @Column({ type: 'text' })
  items_json: string; // JSON com itens solicitados

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_value: number; // Valor total da proposta

  @Column({ type: 'int', nullable: true })
  delivery_days: number; // Prazo de entrega em dias

  @Column({ type: 'int', nullable: true })
  payment_days: number; // Prazo de pagamento em dias

  @Column({
    type: 'enum',
    enum: QuoteStatus,
    default: QuoteStatus.PENDING,
  })
  status: QuoteStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true })
  validity_date: Date; // Validade da cotação

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
