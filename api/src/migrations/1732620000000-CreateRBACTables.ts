// ===========================================
// MIGRATION: CREATE RBAC TABLES
// Sistema de Permissões - Pizzaria Massa Nostra
// Cria tabelas:
// - roles
// - permissions
// - role_permissions
// - user_roles
// ===========================================

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateRBACTables1732620000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // Tabela: roles
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'level',
            type: 'int',
            default: 10,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'is_protected',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // ============================================
    // Tabela: permissions
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'resource',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // ============================================
    // Tabela: role_permissions (N:N)
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
        columns: [
          {
            name: 'role_id',
            type: 'int',
          },
          {
            name: 'permission_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    // Foreign keys - role_permissions
    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    );

    // ============================================
    // Tabela: user_roles
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'user_roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'role_id',
            type: 'int',
          },
          {
            name: 'assigned_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Foreign keys - user_roles
    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admin_users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    // ============================================
    // Índices (ajustados com IF NOT EXISTS)
    // ============================================
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(name)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id)`,
    );

    console.log('Tabelas RBAC criadas com sucesso');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles');
    await queryRunner.dropTable('role_permissions');
    await queryRunner.dropTable('permissions');
    await queryRunner.dropTable('roles');
  }
}
