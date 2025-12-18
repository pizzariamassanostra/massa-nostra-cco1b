import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReceiptsTable1734568000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar campos faltantes
    await queryRunner.query(`
      ALTER TABLE receipts 
      ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
    `);

    // Tornar campos nullable
    await queryRunner.query(`
      ALTER TABLE receipts 
      ALTER COLUMN pdf_url DROP NOT NULL,
      ALTER COLUMN customer_phone DROP NOT NULL;
    `);

    // Adicionar índices
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_receipts_order_id ON receipts(order_id);
      CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON receipts(receipt_number);
      CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);
    `);

    // Atualizar dados existentes
    await queryRunner.query(`
      UPDATE receipts 
      SET subtotal = total_amount,
          issue_date = created_at
      WHERE subtotal IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_receipts_order_id;
      DROP INDEX IF EXISTS idx_receipts_receipt_number;
      DROP INDEX IF EXISTS idx_receipts_created_at;
    `);

    // Remover colunas
    await queryRunner.query(`
      ALTER TABLE receipts 
      DROP COLUMN IF EXISTS subtotal,
      DROP COLUMN IF EXISTS delivery_fee,
      DROP COLUMN IF EXISTS discount,
      DROP COLUMN IF EXISTS issue_date,
      DROP COLUMN IF EXISTS updated_at,
      DROP COLUMN IF EXISTS deleted_at;
    `);
  }
}
