// ============================================
// MIGRATION: ADD FISCAL FIELDS TO INGREDIENTS
// ============================================
// Adiciona campos fiscais (NCM, CEST, CFOP) à tabela de ingredientes,
// permitindo integração com regras tributárias e fiscais.
// ============================================

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFiscalFieldsToIngredients1732670000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona colunas fiscais se não existirem
    await queryRunner.query(`
      ALTER TABLE ingredients 
      ADD COLUMN IF NOT EXISTS ncm VARCHAR(20),
      ADD COLUMN IF NOT EXISTS cest VARCHAR(20),
      ADD COLUMN IF NOT EXISTS cfop VARCHAR(20);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove colunas fiscais se existirem
    await queryRunner.query(`
      ALTER TABLE ingredients 
      DROP COLUMN IF EXISTS ncm,
      DROP COLUMN IF EXISTS cest,
      DROP COLUMN IF EXISTS cfop;
    `);
  }
}
