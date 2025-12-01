// ============================================
// ENTIDADE: ADMIN USER (GESTÃO)
// ============================================
// Representa usuários administrativos do sistema de gestão,
// como administradores e gerentes, com suporte a soft delete.
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin_users')
export class AdminUser {
  // Identificador único do usuário admin
  @PrimaryGeneratedColumn()
  id: string;

  // Nome completo do usuário admin
  @Column()
  name: string;

  // Email único para login
  @Column({ unique: true })
  email: string;

  // Hash da senha (não retornado em consultas)
  @Column({ select: false, name: 'password' })
  password_hash: string;

  // Data de criação do registro
  @CreateDateColumn({ type: 'timestamptz', select: false })
  created_at: Date;

  // Data da última atualização
  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updated_at: Date;

  // Data de exclusão lógica (soft delete)
  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}
