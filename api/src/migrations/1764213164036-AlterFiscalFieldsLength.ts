// ============================================
// MIGRATION: ALTER FISCAL FIELDS LENGTH
// ============================================
// Ajusta o tamanho dos campos fiscais (NCM, CEST, CFOP)
// na tabela de ingredientes, permitindo maior flexibilidade.
// ============================================

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFiscalFieldsLength1732670000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Aumenta o tamanho dos campos fiscais para até 20 caracteres
    await queryRunner.query(`
      ALTER TABLE ingredients 
      ALTER COLUMN ncm TYPE VARCHAR(20),
      ALTER COLUMN cest TYPE VARCHAR(20),
      ALTER COLUMN cfop TYPE VARCHAR(20);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverte os campos fiscais para tamanho original (8 caracteres)
    await queryRunner.query(`
      ALTER TABLE ingredients 
      ALTER COLUMN ncm TYPE VARCHAR(8),
      ALTER COLUMN cest TYPE VARCHAR(8),
      ALTER COLUMN cfop TYPE VARCHAR(8);
    `);
  }
}
