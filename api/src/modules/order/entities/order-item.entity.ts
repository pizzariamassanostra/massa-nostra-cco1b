// ============================================
// ENTIDADE: ITENS DO PEDIDO
// ============================================
// Itens individuais de cada pedido
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';
import { ProductVariant } from '../../product/entities/product-variant.entity';
import { PizzaCrust } from '../../product/entities/pizza-crust.entity';
import { CrustFilling } from '../../product/entities/crust-filling.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Pedido pai
  @Column()
  order_id: number;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // Produto
  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Variação (tamanho P/M/G)
  @Column({ nullable: true })
  variant_id: number;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  // Borda (se pizza)
  @Column({ nullable: true })
  crust_id: number;

  @ManyToOne(() => PizzaCrust)
  @JoinColumn({ name: 'crust_id' })
  crust: PizzaCrust;

  // Recheio da borda (se pizza)
  @Column({ nullable: true })
  filling_id: number;

  @ManyToOne(() => CrustFilling)
  @JoinColumn({ name: 'filling_id' })
  filling: CrustFilling;

  // Quantidade
  @Column({ default: 1 })
  quantity: number;

  // Preços (guardados no momento da compra)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number; // Preço da variação

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  crust_price: number; // Preço da borda

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  filling_price: number; // Preço do recheio

  // Subtotal do item
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  // Observações do item
  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
  product_name: any;
  total_price: any;
}
