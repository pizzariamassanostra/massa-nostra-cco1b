/**
 * ============================================
 * ENTIDADE: ROLE (PAPEL/FUNÇÃO)
 * ============================================
 * Representa os papéis/funções que podem ser atribuídos aos usuários.
 *
 * Relacionamentos:
 * - N:N com Permission (role_permissions)
 * - 1:N com AdminUser (user_roles)
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';
import { RoleEnum } from '../enums/role.enum';

@Entity('roles')
export class Role {
  // Chave primária da tabela
  @PrimaryGeneratedColumn()
  id: number;

  // Nome único do role (ex.: admin, gerência, cozinheira)
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  name: RoleEnum;

  // Nome de exibição (ex.: "Administrador", "Gerente", "Cozinheira")
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  display_name: string;

  // Descrição detalhada do papel
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  // Nível hierárquico (1 = maior autoridade)
  @Column({
    type: 'int',
    default: 10,
  })
  level: number;

  // Indica se o role está ativo
  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  // Indica se o role é protegido (não pode ser deletado)
  @Column({
    type: 'boolean',
    default: false,
  })
  is_protected: boolean;

  // Permissões associadas ao role (N:N com Permission)
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  // Usuários que possuem este role (1:N com UserRole)
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  user_roles: UserRole[];

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
