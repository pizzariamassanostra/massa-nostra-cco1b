// ============================================
// ENTIDADE: ESTOQUE
// ============================================
// Controle de estoque por ingrediente e lote
// Permite rastreabilidade e validade
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
import { Ingredient } from './ingredient.entity';

@Entity('stocks')
export class Stock {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  ingredient_id: number;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.stocks)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  // ============================================
  // LOTE E VALIDADE
  // ============================================
  @Column({ type: 'varchar', length: 50, nullable: true })
  batch_number: string; // Número do lote

  @Column({ type: 'date', nullable: true })
  manufacturing_date: Date; // Data de fabricação

  @Column({ type: 'date', nullable: true })
  expiry_date: Date; // Data de validade

  // ============================================
  // QUANTIDADE
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  quantity: number; // Quantidade atual

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  minimum_quantity: number; // Estoque mínimo (alerta)

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  maximum_quantity: number; // Estoque máximo

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  reserved_quantity: number; // Quantidade reservada (em pedidos)

  // ============================================
  // VALORES
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unit_cost: number; // Custo unitário deste lote

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_value: number; // Valor total em estoque

  // ============================================
  // LOCALIZAÇÃO
  // ============================================
  @Column({ type: 'varchar', length: 50, nullable: true })
  location: string; // "Prateleira A3", "Freezer 1"

  // ============================================
  // OBSERVAÇÕES
  // ============================================
  @Column({ type: 'text', nullable: true })
  notes: string;

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
