// ============================================
// MIGRATION: ADD ORDER STATUS TIMESTAMPS
// ============================================
// Adiciona colunas de timestamps para acompanhar
// mudanças de status nos pedidos (orders).
// Inclui confirmação, início de preparo,
// saída para entrega e entrega final.
// ============================================

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrderStatusTimestamps1764504400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Data/hora em que o pedido foi confirmado
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'confirmed_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Data/hora em que o preparo foi iniciado
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'started_preparing_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Data/hora em que o pedido saiu para entrega
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'out_for_delivery_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Data/hora em que o pedido foi entregue
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'delivered_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove colunas adicionadas
    await queryRunner.dropColumn('orders', 'delivered_at');
    await queryRunner.dropColumn('orders', 'out_for_delivery_at');
    await queryRunner.dropColumn('orders', 'started_preparing_at');
    await queryRunner.dropColumn('orders', 'confirmed_at');
  }
}
