// ============================================
// MIGRATION: CREATE INGREDIENT TABLES
// ============================================
// Cria as tabelas relacionadas a ingredientes e estoque,
// incluindo chaves estrangeiras para relacionamentos.
// ============================================

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateIngredientTables1732579200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // TABELA: INGREDIENTES
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'ingredients',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'manufacturer',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'internal_code',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'ean',
            type: 'varchar',
            length: '13',
            isNullable: true,
          },
          {
            name: 'supplier_code',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'unit_measure',
            type: 'varchar',
            length: '20',
            default: "'un'",
          },
          {
            name: 'package_quantity',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'group',
            type: 'varchar',
            length: '20',
            default: "'ingredient'",
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'cost_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'sale_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'profit_margin',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'ncm',
            type: 'varchar',
            length: '8',
            isNullable: true,
          },
          {
            name: 'cest',
            type: 'varchar',
            length: '7',
            isNullable: true,
          },
          {
            name: 'cfop',
            type: 'varchar',
            length: '4',
            isNullable: true,
          },
          {
            name: 'cst',
            type: 'varchar',
            length: '3',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'active'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
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
    // TABELA: STOCKS
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'stocks',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'ingredient_id',
            type: 'int',
          },
          {
            name: 'batch_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'manufacturing_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'expiry_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
            default: 0,
          },
          {
            name: 'minimum_quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
            default: 0,
          },
          {
            name: 'maximum_quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
            default: 0,
          },
          {
            name: 'reserved_quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
            default: 0,
          },
          {
            name: 'unit_cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'total_value',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
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
          },
        ],
      }),
      true,
    );

    // FK: stocks → ingredients
    await queryRunner.createForeignKey(
      'stocks',
      new TableForeignKey({
        columnNames: ['ingredient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ingredients',
        onDelete: 'CASCADE',
      }),
    );

    // ============================================
    // TABELA: STOCK_MOVEMENTS
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'stock_movements',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'movement_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '30',
          },
          {
            name: 'ingredient_id',
            type: 'int',
          },
          {
            name: 'stock_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
          },
          {
            name: 'unit_cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'total_value',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'balance_before',
            type: 'decimal',
            precision: 10,
            scale: 3,
            default: 0,
          },
          {
            name: 'balance_after',
            type: 'decimal',
            precision: 10,
            scale: 3,
            default: 0,
          },
          {
            name: 'supplier_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'invoice_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'order_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'movement_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
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

    // FK: stock_movements → ingredients
    await queryRunner.createForeignKey(
      'stock_movements',
      new TableForeignKey({
        columnNames: ['ingredient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ingredients',
        onDelete: 'CASCADE',
      }),
    );

    // FK: stock_movements → stocks
    await queryRunner.createForeignKey(
      'stock_movements',
      new TableForeignKey({
        columnNames: ['stock_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'stocks',
        onDelete: 'SET NULL',
      }),
    );

    // ============================================
    // TABELA: STOCK_ALERTS
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'stock_alerts',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '30',
          },
          {
            name: 'ingredient_id',
            type: 'int',
          },
          {
            name: 'stock_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'current_quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
            isNullable: true,
          },
          {
            name: 'threshold',
            type: 'decimal',
            precision: 10,
            scale: 3,
            isNullable: true,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_resolved',
            type: 'boolean',
            default: false,
          },
          {
            name: 'resolved_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resolved_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '20',
            default: "'medium'",
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

    // FK: stock_alerts → ingredients
    await queryRunner.createForeignKey(
      'stock_alerts',
      new TableForeignKey({
        columnNames: ['ingredient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ingredients',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stock_alerts');
    await queryRunner.dropTable('stock_movements');
    await queryRunner.dropTable('stocks');
    await queryRunner.dropTable('ingredients');
  }
}
