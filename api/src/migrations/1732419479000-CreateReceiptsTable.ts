// ============================================
// MIGRATION: TABELA DE COMPROVANTES
// ============================================
// CORREÇÕES APLICADAS:
// Adicionado campos faltantes (subtotal, delivery_fee, discount, issue_date)
// Alterado customer_phone para nullable
// Melhorado estrutura de colunas
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
          // ============================================
          // ID PRIMÁRIO
          // ============================================
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          // ============================================
          // RELACIONAMENTO COM PEDIDO
          // ============================================
          {
            name: 'order_id',
            type: 'int',
          },

          // ============================================
          // IDENTIFICAÇÃO DO COMPROVANTE
          // ============================================
          {
            name: 'receipt_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },

          // ============================================
          // ARQUIVO PDF
          // ============================================
          {
            name: 'pdf_url',
            type: 'varchar',
            length: '500',
            isNullable: true, // Permitir null até gerar PDF
          },

          // ============================================
          // VALORES FINANCEIROS
          // ============================================
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            comment: 'Valor dos produtos sem taxa de entrega',
          },
          {
            name: 'delivery_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            comment: 'Taxa de entrega',
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            comment: 'Desconto aplicado',
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            comment: 'Valor total (subtotal + entrega - desconto)',
          },

          // ============================================
          // FORMA DE PAGAMENTO
          // ============================================
          {
            name: 'payment_method',
            type: 'varchar',
            length: '50',
          },

          // ============================================
          // DADOS DO CLIENTE
          // ============================================
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
            isNullable: true, // Telefone pode ser opcional
          },

          // ============================================
          // ITENS DO PEDIDO (JSON)
          // ============================================
          {
            name: 'items_json',
            type: 'text',
            comment: 'JSON com detalhes dos itens do pedido',
          },

          // ============================================
          // CONTROLE DE ENVIO DE EMAIL
          // ============================================
          {
            name: 'was_emailed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'emailed_at',
            type: 'timestamp',
            isNullable: true,
          },

          // ============================================
          // DATAS
          // ============================================
          {
            name: 'issue_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            comment: 'Data de emissão do comprovante',
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
            onUpdate: 'CURRENT_TIMESTAMP', // Auto-update
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
            comment: 'Soft delete',
          },
        ],
      }),
      true,
    );

    // ============================================
    // FOREIGN KEY:  ORDER_ID
    // ============================================
    await queryRunner.createForeignKey(
      'receipts',
      new TableForeignKey({
        name: 'fk_receipts_order',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // ============================================
    // ÍNDICES PARA PERFORMANCE
    // ============================================
    await queryRunner.query(`
      CREATE INDEX idx_receipts_order_id ON receipts(order_id);
      CREATE INDEX idx_receipts_receipt_number ON receipts(receipt_number);
      CREATE INDEX idx_receipts_created_at ON receipts(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign key
    const table = await queryRunner.getTable('receipts');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('order_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('receipts', foreignKey);
    }

    // Remover índices
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_receipts_order_id;
      DROP INDEX IF EXISTS idx_receipts_receipt_number;
      DROP INDEX IF EXISTS idx_receipts_created_at;
    `);

    // Remover tabela
    await queryRunner.dropTable('receipts');
  }
}
