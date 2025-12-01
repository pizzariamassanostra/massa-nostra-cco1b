// ============================================
// ENTIDADE: CATEGORIAS DE PRODUTOS
// ============================================
// Representa categorias do cardápio
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  // Nome da categoria (ex: "Pizzas Salgadas")
  @Column({ length: 100 })
  name: string;

  // Slug para URL amigável (ex: "pizzas-salgadas")
  @Column({ length: 100, unique: true })
  slug: string;

  // Descrição da categoria
  @Column({ type: 'text', nullable: true })
  description: string;

  // URL da imagem (Cloudinary)
  @Column({ type: 'text', nullable: true })
  image_url: string;

  // Ordem de exibição no cardápio
  @Column({ default: 0 })
  sort_order: number;

  // Status: active, inactive
  @Column({ length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}
