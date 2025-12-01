// ============================================
// ENTIDADE: AVALIAÇÕES DE PEDIDOS
// ============================================
// Avaliações dos clientes sobre pedidos entregues
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { CommonUser } from '@/modules/common-user/entities/common-user.entity';

@Entity('order_reviews')
export class OrderReview {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // RELACIONAMENTOS
  // ============================================
  @Column()
  order_id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  customer_id: number;

  @ManyToOne(() => CommonUser)
  @JoinColumn({ name: 'customer_id' })
  customer: CommonUser;

  // ============================================
  // AVALIAÇÕES (1-5 ESTRELAS)
  // ============================================
  @Column({ type: 'int' })
  overall_rating: number; // Nota geral (obrigatória)

  @Column({ type: 'int', nullable: true })
  food_quality: number; // Qualidade da comida

  @Column({ type: 'int', nullable: true })
  delivery_time: number; // Tempo de entrega

  @Column({ type: 'int', nullable: true })
  packaging: number; // Qualidade da embalagem

  // ============================================
  // COMENTÁRIO
  // ============================================
  @Column({ type: 'text', nullable: true })
  comment: string; // Comentário opcional

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}
