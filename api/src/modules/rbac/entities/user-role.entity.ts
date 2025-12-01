/**
 * ============================================
 * ENTIDADE: USER_ROLE (USUÁRIO-PAPEL)
 * ============================================
 * Representa a tabela de relacionamento N:N entre usuários e roles.
 *
 * Permite:
 * - Um usuário ter múltiplos roles
 * - Controlar quando o role foi atribuído
 * - Rastrear quem atribuiu o role
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminUser } from '../../admin-user/entities/admin-user.entity';
import { Role } from './role.entity';

@Entity('user_roles')
export class UserRole {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // ID do usuário associado ao role
  @Column({ name: 'user_id' })
  user_id: number;

  // ID do role atribuído ao usuário
  @Column({ name: 'role_id' })
  role_id: number;

  // Usuário que recebeu o role (relacionamento ManyToOne com AdminUser)
  @ManyToOne(() => AdminUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: AdminUser;

  // Role atribuído ao usuário (relacionamento ManyToOne com Role)
  @ManyToOne(() => Role, (role) => role.user_roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // ID do usuário administrador que atribuiu este role (opcional)
  @Column({ name: 'assigned_by', nullable: true })
  assigned_by: number;

  // Data em que o role foi atribuído (gerada automaticamente pelo TypeORM)
  @CreateDateColumn()
  created_at: Date;
}
