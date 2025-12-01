/**
 * ============================================
 * ENTIDADE: PERMISSION (PERMISSÃO)
 * ============================================
 * Representa as permissões disponíveis no sistema.
 *
 * Relacionamentos:
 * - N:N com Role (role_permissions)
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { PermissionEnum } from '../enums/permission.enum';

@Entity('permissions')
export class Permission {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // Nome único da permissão (formato: resource:action, ex.: orders:create, users:read)
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: PermissionEnum;

  // Nome de exibição da permissão
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  display_name: string;

  // Descrição detalhada da permissão
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  // Grupo/Recurso ao qual pertence (ex.: orders, users, products)
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  resource: string;

  // Ação da permissão (ex.: create, read, update, delete)
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  action: string;

  // Indica se a permissão está ativa
  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  // Roles que possuem esta permissão (N:N com Role)
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  // Data de criação do registro
  @CreateDateColumn()
  created_at: Date;

  // Data da última atualização
  @UpdateDateColumn()
  updated_at: Date;

  // Data de exclusão lógica (soft delete)
  @DeleteDateColumn()
  deleted_at: Date;
}
