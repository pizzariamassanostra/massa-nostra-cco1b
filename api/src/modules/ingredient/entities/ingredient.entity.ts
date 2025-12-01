// ============================================
// ENTIDADE: INGREDIENTE/INSUMO
// ============================================
// Cadastro de ingredientes, bebidas e insumos
// utilizados na pizzaria
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IngredientStatus } from '../enums/ingredient-status.enum';
import { IngredientGroup } from '../enums/ingredient-group.enum';
import { UnitMeasure } from '../enums/unit-measure.enum';
import { Stock } from './stock.entity';
import { StockMovement } from './stock-movement.entity';
import { ProductCategory } from '@/modules/product-category/entities/product-category.entity';

@Entity('ingredients')
export class Ingredient {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string; // Ex: "Farinha de Trigo Tipo 1"

  @Column({ type: 'text', nullable: true })
  description: string; // Descrição detalhada

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  manufacturer: string;

  // ============================================
  // CÓDIGO INTERNO E EXTERNO
  // ============================================
  @Column({ type: 'varchar', length: 50, unique: true })
  internal_code: string; // Código interno (gerado automaticamente)

  @Column({ type: 'varchar', length: 13, nullable: true })
  ean: string; // Código de barras (EAN-13)

  @Column({ type: 'varchar', length: 50, nullable: true })
  supplier_code: string; // Código do fornecedor

  // ============================================
  // UNIDADE DE MEDIDA
  // ============================================
  @Column({
    type: 'enum',
    enum: UnitMeasure,
    default: UnitMeasure.UN,
  })
  unit_measure: UnitMeasure; // kg, litro, unidade

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  package_quantity: number; // Quantidade na embalagem (ex: 25kg)

  // ============================================
  // GRUPO/CATEGORIA
  // ============================================
  @Column({
    type: 'enum',
    enum: IngredientGroup,
    default: IngredientGroup.INGREDIENT,
  })
  group: IngredientGroup;

  @Column({ type: 'int', nullable: true })
  category_id: number;

  @ManyToOne(() => ProductCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  // ============================================
  // VALORES
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost_price: number; // Preço de custo unitário

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  sale_price: number; // Preço de venda

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  profit_margin: number; // Margem de lucro (%)

  // ============================================
  // CLASSIFICAÇÃO FISCAL
  // ============================================
  @Column({ type: 'varchar', length: 8, nullable: true })
  ncm: string;

  @Column({ type: 'varchar', length: 7, nullable: true })
  cest: string; // Código Especificador da ST

  @Column({ type: 'varchar', length: 4, nullable: true })
  cfop: string; // Código Fiscal de Operações

  @Column({ type: 'varchar', length: 3, nullable: true })
  cst: string; // Código de Situação Tributária

  // ============================================
  // STATUS
  // ============================================
  @Column({
    type: 'enum',
    enum: IngredientStatus,
    default: IngredientStatus.ACTIVE,
  })
  status: IngredientStatus;

  // ============================================
  // OBSERVAÇÕES
  // ============================================
  @Column({ type: 'text', nullable: true })
  notes: string;

  // ============================================
  // RELACIONAMENTOS
  // ============================================
  @OneToMany(() => Stock, (stock) => stock.ingredient)
  stocks: Stock[]; // Estoque atual (pode ter múltiplos lotes)

  @OneToMany(() => StockMovement, (movement) => movement.ingredient)
  movements: StockMovement[]; // Movimentações

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
