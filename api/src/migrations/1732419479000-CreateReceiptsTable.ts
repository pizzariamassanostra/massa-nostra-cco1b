// ============================================
// MIGRATION: TABELA DE COMPROVANTES
// ============================================

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateReceiptsTable1732419479000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'receipts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order_id',
            type: 'int',
          },
          {
            name: 'receipt_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'pdf_url',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'payment_method',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'customer_cpf',
            type: 'varchar',
            length: '14',
            isNullable: true,
          },
          {
            name: 'customer_email',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'customer_phone',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'items_json',
            type: 'text',
          },
          {
            name: 'was_emailed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'emailed_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Foreign Keys
    await queryRunner.createForeignKey(
      'receipts',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('receipts');
  }
}
