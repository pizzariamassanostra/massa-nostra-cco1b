// ============================================
// ENTITY: AVALIAÇÕES DE FORNECEDORES
// ============================================
// Avaliação técnica e financeira
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity('supplier_evaluations')
export class SupplierEvaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplier_id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.evaluations)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  // ============================================
  // CRITÉRIOS DE AVALIAÇÃO
  // ============================================
  @Column({ type: 'int' })
  quality_rating: number; // 1 a 5

  @Column({ type: 'int' })
  delivery_rating: number; // 1 a 5

  @Column({ type: 'int' })
  price_rating: number; // 1 a 5

  @Column({ type: 'int' })
  service_rating: number; // 1 a 5

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  overall_rating: number; // Média calculada

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column()
  evaluated_by: number; // ID do admin

  @CreateDateColumn()
  created_at: Date;
}
