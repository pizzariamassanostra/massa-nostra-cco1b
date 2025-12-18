// ============================================
// ENTIDADE: ENDEREÇOS DE ENTREGA
// ============================================
// Endereços cadastrados pelos clientes
// CORREÇÕES APLICADAS:
// Campo 'number' agora é VARCHAR(20) para aceitar strings
// Tipo timestamptz mantido para timestamps
// Nullable corrigido nos campos opcionais
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
import { CommonUser } from '../../common-user/entities/common-user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // RELACIONAMENTO COM CLIENTE
  // ============================================
  @Column()
  common_user_id: number;

  @ManyToOne(() => CommonUser)
  @JoinColumn({ name: 'common_user_id' })
  user: CommonUser;

  // ============================================
  // DADOS DO ENDEREÇO
  // ============================================

  @Column({ type: 'varchar', length: 255 })
  street: string; // Rua/Avenida

  // Tipo VARCHAR ao invés de INT para aceitar "123", "S/N", etc
  @Column({ type: 'varchar', length: 20 })
  number: string; // Número (aceita string:  "123", "S/N", "KM 5")

  // Nullable true para campos opcionais
  @Column({ type: 'varchar', length: 100, nullable: true })
  complement?: string; // Complemento (apto, bloco, etc)

  @Column({ type: 'varchar', length: 100 })
  neighborhood: string; // Bairro

  @Column({ type: 'varchar', length: 100 })
  city: string; // Cidade

  @Column({ type: 'varchar', length: 2 })
  state: string; // Estado (UF)

  @Column({ type: 'varchar', length: 10 })
  zip_code: string; // CEP

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference?: string; // Ponto de referência

  // Aumentado para 500 caracteres para instruções detalhadas
  @Column({ type: 'varchar', length: 500, nullable: true })
  delivery_instructions?: string; // Instruções de entrega

  // ============================================
  // ENDEREÇO PADRÃO
  // ============================================
  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  // ============================================
  // TIMESTAMPS
  // ============================================
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at?: Date;
}
