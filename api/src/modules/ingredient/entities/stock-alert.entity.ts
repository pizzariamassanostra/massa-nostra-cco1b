// ============================================
// ENTIDADE: ALERTAS DE ESTOQUE
// ============================================
// Alertas automáticos de estoque baixo,
// vencimento, etc
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { Stock } from './stock.entity';
import { AlertType } from '../enums/alert-type.enum';

@Entity('stock_alerts')
export class StockAlert {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // TIPO DE ALERTA
  // ============================================
  @Column({
    type: 'enum',
    enum: AlertType,
  })
  type: AlertType; // Baixo estoque, vencido

  // ============================================
  // INGREDIENTE E LOTE
  // ============================================
  @Column({ type: 'int' })
  ingredient_id: number;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ type: 'int', nullable: true })
  stock_id: number; // Lote específico

  @ManyToOne(() => Stock, { nullable: true })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  // ============================================
  // DETALHES DO ALERTA
  // ============================================
  @Column({ type: 'varchar', length: 200 })
  title: string; // Ex: "Estoque baixo de Farinha"

  @Column({ type: 'text' })
  message: string; // Mensagem detalhada

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  current_quantity: number; // Quantidade atual

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  threshold: number; // Limite que gerou o alerta

  // ============================================
  // STATUS DO ALERTA
  // ============================================
  @Column({ type: 'boolean', default: false })
  is_read: boolean; // Alerta foi lido?

  @Column({ type: 'boolean', default: false })
  is_resolved: boolean; // Alerta foi resolvido?

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date; // Data de resolução

  @Column({ type: 'int', nullable: true })
  resolved_by: number; // Usuário que resolveu

  // ============================================
  // PRIORIDADE
  // ============================================
  @Column({ type: 'varchar', length: 20, default: 'medium' })
  priority: string;

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn()
  created_at: Date;
}
