// ============================================
// ENTIDADE: VARIAÇÕES DE PRODUTO
// ============================================
// Representa as variações de um produto do cardápio,
// como tamanhos e preços (ex.: P/M/G para pizzas).
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
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // ID do produto pai
  @Column()
  product_id: number;

  // Relacionamento ManyToOne com o produto base
  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Tamanho da variação (ex.: small, medium, large, unique)
  @Column({ length: 50 })
  size: string;

  // Label exibido (ex.: "Pequena - 4 pedaços")
  @Column({ length: 100 })
  label: string;

  // Preço desta variação
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Número de pedaços (aplicável para pizzas)
  @Column({ nullable: true })
  servings: number;

  // Ordem de exibição no cardápio
  @Column({ default: 0 })
  sort_order: number;

  // Status da variação (active, inactive)
  @Column({ length: 20, default: 'active' })
  status: string;

  // Data de criação do registro
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Data da última atualização
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Data de exclusão lógica (soft delete)
  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}
