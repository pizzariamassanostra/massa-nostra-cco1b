// ============================================
// ENTIDADE: MOVIMENTAÇÃO DE ESTOQUE
// ============================================
// Registra todas as entradas e saídas do estoque
// Garante rastreabilidade completa
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
import { MovementType } from '../enums/movement-type.enum';
import { AdminUser } from '@/modules/admin-user/entities/admin-user.entity';
import { Supplier } from '@/modules/supplier/entities/supplier.entity';

@Entity('stock_movements')
export class StockMovement {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  movement_number: string; // Ex: MOV-20251125-001

  // ============================================
  // TIPO DE MOVIMENTAÇÃO
  // ============================================
  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType; // Entrada, Saída, Ajuste

  // ============================================
  // INGREDIENTE E LOTE
  // ============================================
  @Column({ type: 'int' })
  ingredient_id: number;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.movements)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ type: 'int', nullable: true })
  stock_id: number; // Lote específico (se aplicável)

  @ManyToOne(() => Stock, { nullable: true })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  // ============================================
  // QUANTIDADE E VALORES
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity: number; // Quantidade movimentada

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unit_cost: number; // Custo unitário

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_value: number; // Valor total da movimentação

  // ============================================
  // SALDO APÓS MOVIMENTAÇÃO
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  balance_before: number; // Saldo antes da movimentação

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  balance_after: number; // Saldo após a movimentação

  // ============================================
  // ORIGEM/DESTINO
  // ============================================
  @Column({ type: 'int', nullable: true })
  supplier_id: number; // Fornecedor (se compra)

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'varchar', length: 50, nullable: true })
  invoice_number: string; // Número da nota fiscal

  @Column({ type: 'int', nullable: true })
  order_id: number; // Pedido relacionado (se venda)

  // ============================================
  // RESPONSÁVEL
  // ============================================
  @Column({ type: 'int', nullable: true })
  user_id: number; // Usuário que fez a movimentação

  @ManyToOne(() => AdminUser, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: AdminUser;

  // ============================================
  // OBSERVAÇÕES
  // ============================================
  @Column({ type: 'text', nullable: true })
  reason: string; // Motivo da movimentação

  @Column({ type: 'text', nullable: true })
  notes: string; // Observações adicionais

  // ============================================
  // DATA DA MOVIMENTAÇÃO
  // ============================================
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  movement_date: Date; // Data real da movimentação

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn()
  created_at: Date; // Data de registro no sistema
}
