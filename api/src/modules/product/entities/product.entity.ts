// ============================================
// ENTIDADE: PRODUTOS (BASE)
// ============================================
// Representa o produto base do cardápio (pizza, bebida, etc.)
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from '../../product-category/entities/product-category.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // ID da categoria do produto (ex.: Pizzas Salgadas, Bebidas)
  @Column()
  category_id: number;

  // Relacionamento ManyToOne com a categoria
  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  // Nome do produto (ex.: "Pizza Margherita")
  @Column({ length: 255 })
  name: string;

  // Slug para URL amigável (ex.: "pizza-margherita")
  @Column({ length: 255, unique: true })
  slug: string;

  // Descrição completa do produto
  @Column({ type: 'text', nullable: true })
  description: string;

  // URL da imagem do produto (armazenada em Cloudinary)
  @Column({ type: 'text', nullable: true })
  image_url: string;

  // Tipo do produto: simple (bebida, 1 preço) ou pizza (vários tamanhos)
  @Column({ length: 50, default: 'simple' })
  type: string;

  // Status do produto: active, inactive, out_of_stock
  @Column({ length: 20, default: 'active' })
  status: string;

  // Ordem de exibição no cardápio
  @Column({ default: 0 })
  sort_order: number;

  // Variações do produto (ex.: tamanhos P/M/G com preços)
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

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
