// ============================================
// ENTIDADE: RECHEIOS DE BORDA
// ============================================
// Representa os recheios disponíveis para bordas especiais
// (ex.: Vulcão, Trançada)
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('crust_fillings')
export class CrustFilling {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // Nome do recheio (ex.: "Catupiry", "Cheddar")
  @Column({ length: 100 })
  name: string;

  // Slug único para identificação (ex.: catupiry, cheddar)
  @Column({ length: 100, unique: true })
  slug: string;

  // Descrição detalhada do recheio
  @Column({ type: 'text', nullable: true })
  description: string;

  // Preço adicional do recheio
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  // Status do recheio (active, inactive)
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
