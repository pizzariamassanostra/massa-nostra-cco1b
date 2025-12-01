// ============================================
// MIGRATION: TABELAS DE FORNECEDORES
// ============================================
// Cria todas as tabelas do módulo supplier
// ============================================

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSupplierTables1732542000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // TABELA: suppliers (FORNECEDORES)
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'suppliers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          // DADOS FISCAIS
          {
            name: 'razao_social',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '18',
            isUnique: true,
          },
          {
            name: 'inscricao_estadual',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          // CONTATO
          {
            name: 'email',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'telefone_principal',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'whatsapp_disponivel',
            type: 'boolean',
            default: true,
          },
          {
            name: 'telefone_alternativo',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'site',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          // ENDEREÇO
          {
            name: 'cep',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'rua',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'numero',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'cidade',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '2',
          },
          {
            name: 'ponto_referencia',
            type: 'text',
            isNullable: true,
          },
          // DADOS BANCÁRIOS
          {
            name: 'banco',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'agencia',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'conta',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'tipo_conta',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'pix',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          // INFORMAÇÕES COMERCIAIS
          {
            name: 'produtos_servicos',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'condicoes_comerciais',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'prazo_entrega_dias',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'prazo_pagamento_dias',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'desconto_padrao',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          // STATUS E AVALIAÇÃO
          {
            name: 'status',
            type: 'enum',
            enum: [
              'pre_registered',
              'under_review',
              'active',
              'inactive',
              'blocked',
              'rejected',
            ],
            default: "'pre_registered'",
          },
          {
            name: 'nota_avaliacao',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'observacoes_internas',
            type: 'text',
            isNullable: true,
          },
          // AUDITORIA
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
    // TABELA: supplier_quotes (COTAÇÕES)
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'supplier_quotes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'supplier_id',
            type: 'int',
          },
          {
            name: 'quote_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'items_json',
            type: 'text',
          },
          {
            name: 'total_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'delivery_days',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'payment_days',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'pending',
              'sent',
              'received',
              'under_analysis',
              'approved',
              'cancelled',
              'converted',
            ],
            default: "'pending'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'validity_date',
            type: 'date',
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // ============================================
    // TABELA: (PEDIDOS DE COMPRA)
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'purchase_orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'supplier_id',
            type: 'int',
          },
          {
            name: 'order_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'items_json',
            type: 'text',
          },
          {
            name: 'total_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'payment_method',
            type: 'enum',
            enum: [
              'pix',
              'dinheiro',
              'cartao_debito',
              'cartao_credito',
              'boleto',
              'transferencia',
              'cheque',
            ],
          },
          {
            name: 'expected_delivery_date',
            type: 'date',
          },
          {
            name: 'actual_delivery_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'draft',
              'pending_approval',
              'approved',
              'confirmed',
              'in_transit',
              'delivered',
              'received',
              'completed',
              'cancelled',
              'partial',
            ],
            default: "'draft'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'approved_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'nfe_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'nfe_xml_url',
            type: 'varchar',
            length: '500',
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // ============================================
    // TABELA: (AVALIAÇÕES)
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'supplier_evaluations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'supplier_id',
            type: 'int',
          },
          {
            name: 'quality_rating',
            type: 'int',
          },
          {
            name: 'delivery_rating',
            type: 'int',
          },
          {
            name: 'price_rating',
            type: 'int',
          },
          {
            name: 'service_rating',
            type: 'int',
          },
          {
            name: 'overall_rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
          },
          {
            name: 'comments',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'evaluated_by',
            type: 'int',
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

    // ============================================
    // FOREIGN KEYS
    // ============================================
    await queryRunner.createForeignKey(
      'supplier_quotes',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suppliers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'purchase_orders',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suppliers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'supplier_evaluations',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suppliers',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('supplier_evaluations');
    await queryRunner.dropTable('purchase_orders');
    await queryRunner.dropTable('supplier_quotes');
    await queryRunner.dropTable('suppliers');
  }
}
