// ============================================
// ENTIDADE: COMPROVANTE
// ============================================
// Entidade de comprovantes de pedidos
// Armazena snapshot do pedido para emissão de PDF
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity('receipts')
export class Receipt {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // RELACIONAMENTO COM PEDIDO
  // ============================================
  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  order_id: number;

  // ============================================
  // NÚMERO ÚNICO DO COMPROVANTE
  // ============================================
  // Formato: REC-YYYYMMDD-XXXX
  // Exemplo: REC-20251126-0001
  @Column({ type: 'varchar', length: 50, unique: true })
  receipt_number: string;

  // ============================================
  // DADOS DO CLIENTE (SNAPSHOT)
  // ============================================
  // Armazena dados do cliente no momento da compra
  // para garantir histórico correto mesmo se cliente
  // atualizar seus dados posteriormente
  @Column({ type: 'varchar', length: 255 })
  customer_name: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  customer_cpf: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_email: string;

  // ============================================
  // ITENS DO PEDIDO (JSON)
  // ============================================
  // Armazena array de itens em formato JSON:
  // [
  //   {
  //     "product_name": "Pizza Marguerita",
  //     "variant_name": "Grande",
  //     "quantity": 2,
  //     "unit_price": 45.00,
  //     "total_price": 90.00,
  //     "observations": "Sem cebola"
  //   }
  // ]
  @Column({ type: 'text' })
  items_json: string;

  // ============================================
  // VALORES DO PEDIDO
  // ============================================
  // Subtotal: soma dos itens (sem taxa de entrega)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  // Taxa de entrega
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_fee: number;

  // Desconto aplicado (se houver cupom)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  // TOTAL FINAL
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // ============================================
  // FORMA DE PAGAMENTO
  // ============================================
  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  // ============================================
  // URL DO PDF
  // ============================================
  // Pode ser usado para armazenar URL do Cloudinary
  // ou outro serviço de armazenamento de arquivos
  // Por padrão, geramos PDF on-demand
  @Column({ type: 'varchar', length: 500, nullable: true })
  pdf_url: string;

  // ============================================
  // CONTROLE DE EMAIL
  // ============================================
  // Flag se comprovante foi enviado por email
  @Column({ type: 'boolean', default: false })
  was_emailed: boolean;

  // Data/hora do envio do email
  @Column({ type: 'timestamp', nullable: true })
  emailed_at: Date;

  // ============================================
  // DATAS
  // ============================================
  // Data de emissão do comprovante
  @Column({ type: 'timestamp' })
  issue_date: Date;

  // Data de criação do registro no banco
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
