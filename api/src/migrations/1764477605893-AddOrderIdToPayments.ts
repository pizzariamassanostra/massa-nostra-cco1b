// ============================================
// MIGRATION: Adicionar order_id à tabela payments
// ============================================
// Relaciona pagamentos com seus respectivos pedidos
// Necessário para o webhook saber qual pedido atualizar
// ============================================

import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddOrderIdToPayments1764472800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // ADICIONAR COLUNA order_id
    // ============================================
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'order_id',
        type: 'integer',
        isNullable: true,
        comment: 'Referência do pedido vinculado ao pagamento',
      }),
    );

    // ============================================
    // CRIAR CHAVE ESTRANGEIRA (FK)
    // ============================================
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_payments_orders',
      }),
    );

    // ============================================
    // CRIAR ÍNDICE PARA PERFORMANCE
    // ============================================
    await queryRunner.query(
      `CREATE INDEX "IDX_payments_order_id" ON "payments" ("order_id")`,
    );

    console.log('Migration: order_id adicionado com sucesso');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // REVERTER: Remove tudo que foi adicionado
    // ============================================
    const table = await queryRunner.getTable('payments');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('order_id') !== -1,
    );

    // Remover FK
    if (foreignKey) {
      await queryRunner.dropForeignKey('payments', foreignKey);
    }

    // Remover índice
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_payments_order_id"`);

    // Remover coluna
    await queryRunner.dropColumn('payments', 'order_id');

    console.log('Migration revertida: order_id removido');
  }
}
