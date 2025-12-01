// ============================================
// ENTIDADE: HISTÓRICO DE STATUS DO PEDIDO
// ============================================
// Representa o histórico de mudanças de status de um pedido,
// registrando quem alterou, quando e quais observações foram feitas.
// ============================================

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { AdminUser } from '../../admin-user/entities/admin-user.entity';

@Entity('order_status_history')
export class OrderStatusHistory {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // ID do pedido associado
  @Column()
  order_id: number;

  // Relacionamento ManyToOne com o pedido
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // Status alterado (ex.: pending, confirmed, delivered)
  @Column({ length: 50 })
  status: string;

  // Observações da mudança (opcional)
  @Column({ type: 'text', nullable: true })
  notes: string;

  // ID do admin que realizou a alteração (opcional)
  @Column({ nullable: true })
  created_by: number;

  // Relacionamento ManyToOne com o usuário admin
  @ManyToOne(() => AdminUser)
  @JoinColumn({ name: 'created_by' })
  creator: AdminUser;

  // Data/hora em que a mudança foi registrada
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
