// ============================================
// ENTIDADE: BORDAS DE PIZZA
// ============================================
// Representa os tipos de borda disponíveis para pizzas
// (ex.: Tradicional, Vulcão, Trançada)
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pizza_crusts')
export class PizzaCrust {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // Nome da borda (ex.: "Tradicional", "Vulcão", "Trançada")
  @Column({ length: 100 })
  name: string;

  // Slug único para identificação (ex.: tradicional, vulcao, trancada)
  @Column({ length: 100, unique: true })
  slug: string;

  // Descrição detalhada da borda
  @Column({ type: 'text', nullable: true })
  description: string;

  // Valor adicional da borda (0 para tradicional)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price_modifier: number;

  // Status da borda (active, inactive)
  @Column({ length: 20, default: 'active' })
  status: string;

  // Ordem de exibição no cardápio
  @Column({ default: 0 })
  sort_order: number;

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
