// ============================================
// ENTIDADE: ENDEREÇOS DE ENTREGA
// ============================================
// Endereços cadastrados pelos clientes
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

  // Cliente dono do endereço
  @Column()
  common_user_id: number;

  @ManyToOne(() => CommonUser)
  @JoinColumn({ name: 'common_user_id' })
  user: CommonUser;

  // Dados do endereço
  @Column({ length: 255 })
  street: string; // Rua/Avenida

  @Column({ length: 20 })
  number: string; // Número

  @Column({ length: 100, nullable: true })
  complement: string; // Complemento (apto, bloco, etc)

  @Column({ length: 100 })
  neighborhood: string; // Bairro

  @Column({ length: 100 })
  city: string; // Cidade

  @Column({ length: 2 })
  state: string; // Estado (UF)

  @Column({ length: 10 })
  zip_code: string; // CEP

  @Column({ length: 255, nullable: true })
  reference: string; // Ponto de referência

  @Column({ length: 500, nullable: true })
  delivery_instructions: string; // Instruções de entrega

  // Endereço padrão
  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}
