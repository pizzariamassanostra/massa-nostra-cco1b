// ============================================
// ENTIDADE: PAGAMENTOS
// ============================================
// Armazena informações de pagamentos realizados pelos usuários,
// com integração ao Mercado Pago (PIX, Cartão, Dinheiro).
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonUser } from '../../common-user/entities/common-user.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('payments')
export class Payment {
  // ========== CAMPOS PRIMÁRIOS ==========

  // ID único do pagamento (UUID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ========== RELACIONAMENTOS ==========

  // Usuário que realizou o pagamento
  @ManyToOne(() => CommonUser, (user) => user.id, { eager: false })
  @JoinColumn({ name: 'common_user_id' })
  user: CommonUser;

  // ID do usuário (chave estrangeira)
  @Column({ type: 'integer', nullable: false })
  common_user_id: number;

  // Pedido associado ao pagamento (CRÍTICO para o webhook)
  @ManyToOne(() => Order, (order) => order.id, { eager: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // ID do pedido (chave estrangeira)
  @Column({ type: 'integer', nullable: true })
  order_id: number;

  // ========== DADOS DE PAGAMENTO ==========

  // Valor do pagamento em centavos (ex.: 1495 = R$ 14,95)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number;

  // Status do pagamento (pending, approved, rejected, cancelled, refunded)
  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
    comment: 'pending | approved | rejected | cancelled | refunded',
  })
  status: string;

  // ========== INTEGRAÇÃO MERCADO PAGO ==========

  // ID do pagamento no Mercado Pago (ex.: pix_44_1764472229584)
  @Column({ type: 'varchar', length: 100, nullable: true })
  mercadopago_id: string;

  // Código PIX (copia e cola)
  @Column({ type: 'text', nullable: true })
  pix_code: string;

  // QR Code PIX em formato Base64 (imagem PNG)
  @Column('text')
  pix_qr_code: string;

  // Data/hora de expiração do PIX (geralmente 30 minutos)
  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  // Data/hora em que o pagamento foi confirmado
  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  // ========== TIMESTAMPS ==========

  // Data/hora de criação do registro
  @CreateDateColumn()
  created_at: Date;

  // Data/hora da última atualização
  @UpdateDateColumn()
  updated_at: Date;

  // Data/hora de exclusão lógica (soft delete)
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
