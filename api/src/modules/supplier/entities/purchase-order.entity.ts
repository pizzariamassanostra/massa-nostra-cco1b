// ============================================
// ENTITY: PEDIDOS DE COMPRA
// ============================================
// Pedidos de compra para fornecedores
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
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import { SupplierPaymentMethod } from '../enums/payment-method.enum';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // RELACIONAMENTO
  // ============================================
  @Column()
  supplier_id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchase_orders)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  // ============================================
  // DADOS DO PEDIDO
  // ============================================
  @Column({ type: 'varchar', length: 50, unique: true })
  order_number: string; // PO-20251124-001

  @Column({ type: 'text' })
  items_json: string; // JSON com itens comprados

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_value: number;

  @Column({
    type: 'enum',
    enum: SupplierPaymentMethod,
  })
  payment_method: SupplierPaymentMethod;

  @Column({ type: 'date' })
  expected_delivery_date: Date;

  @Column({ type: 'date', nullable: true })
  actual_delivery_date: Date;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', nullable: true })
  approved_by: number; // ID do admin que aprovou

  // ============================================
  // NOTA FISCAL
  // ============================================
  @Column({ type: 'varchar', length: 50, nullable: true })
  nfe_number: string; // Número da NF-e

  @Column({ type: 'varchar', length: 500, nullable: true })
  nfe_xml_url: string; // URL do XML da nota

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
