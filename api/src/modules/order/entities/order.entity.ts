// ============================================
// ENTIDADE: PEDIDO (ORDER)
// ============================================
// Representa um pedido realizado por um cliente,
// vinculando cliente, endereço, itens e pagamento.
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonUser } from '../../common-user/entities/common-user.entity';
import { Address } from './address.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';

@Entity('orders')
export class Order {
  // ========== IDENTIFICADORES ==========

  // ID único do pedido
  @PrimaryGeneratedColumn()
  id: number;

  // Número único do pedido para exibição (ex.: "ORD-20251130-000001")
  @Column({ type: 'varchar', length: 50, unique: true })
  order_number: string;

  // ========== RELACIONAMENTOS ==========

  // Cliente associado ao pedido
  @ManyToOne(() => CommonUser, { eager: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'common_user_id' })
  user: CommonUser;

  // ID do cliente (foreign key)
  @Column({ type: 'int' })
  common_user_id: number;

  // Endereço de entrega
  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  // ID do endereço (foreign key)
  @Column({ type: 'int' })
  address_id: number;

  // Itens do pedido (pizzas, bebidas, etc.)
  @OneToMany(() => OrderItem, (item) => item.order, { eager: true })
  items: OrderItem[];

  // Histórico de mudanças de status
  @OneToMany(() => OrderStatusHistory, (history) => history.order)
  statusHistory: OrderStatusHistory[];

  // ========== STATUS DO PEDIDO ==========

  // Status atual do pedido
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  // Token único para validação na entrega (6 dígitos)
  @Column({ type: 'varchar', length: 6, nullable: true })
  delivery_token: string;

  // Tempo estimado de entrega em minutos
  @Column({ type: 'int', nullable: true })
  estimated_time: number;

  // ========== VALORES ==========

  // Soma dos valores dos itens (sem taxa de entrega nem desconto)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  // Taxa de entrega
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_fee: number;

  // Desconto aplicado
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  // Valor total = subtotal + delivery_fee - discount
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // ========== PAGAMENTO ==========

  // Forma de pagamento (pix, dinheiro, cartao_debito, cartao_credito)
  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  // Referência do pagamento (temporária até refatoração)
  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_reference: string;

  // ========== OBSERVAÇÕES ==========

  // Observações do cliente (ex.: "Sem cebola", "Extra gelo")
  @Column({ type: 'text', nullable: true })
  notes: string;

  // ========== TIMESTAMPS ==========

  // Data de criação do pedido
  @CreateDateColumn()
  created_at: Date;

  // Última atualização
  @UpdateDateColumn()
  updated_at: Date;

  // Quando o pagamento foi confirmado
  @Column({ type: 'timestamp', nullable: true })
  confirmed_at: Date;

  // Quando o preparo começou
  @Column({ type: 'timestamp', nullable: true })
  started_preparing_at: Date;

  // Quando saiu para entrega
  @Column({ type: 'timestamp', nullable: true })
  out_for_delivery_at: Date;

  // Quando foi entregue
  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

  // Quando foi deletado (soft delete)
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
