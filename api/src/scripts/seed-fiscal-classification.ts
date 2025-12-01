// ============================================
// SCRIPT: POPULAR CLASSIFICAÇÃO FISCAL
// ============================================
// Popula NCM, CEST e CFOP dos ingredientes
// Baseado na tabela da Receita Federal
// ============================================

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * TABELA DE CLASSIFICAÇÃO FISCAL
 *
 * NCM: Nomenclatura Comum (8 dígitos)
 * CEST: Código Especificador da Substituição Tributária (7 dígitos)
 * CFOP: Código Fiscal de Operações e Prestações (4 dígitos)
 */
const FISCAL_CLASSIFICATION = {
  // ============================================
  // INGREDIENTES BÁSICOS
  // ============================================
  'Farinha de Trigo': {
    ncm: '1101. 00.10',
    cest: '17. 001.00',
    cfop: '5.102',
  },
  'Queijo Mussarela': {
    ncm: '0406.  10. 00',
    cest: '17.002.00',
    cfop: '5.102',
  },
  Tomate: {
    ncm: '0702.00.00',
    cest: '17.003.00',
    cfop: '5.101',
  },
  Presunto: {
    ncm: '1601.00.00',
    cest: '17.004.00',
    cfop: '5.102',
  },
  Calabresa: {
    ncm: '1601.00.00',
    cest: '17.004.00',
    cfop: '5.102',
  },
  'Frango Desfiado': {
    ncm: '0207.14.00',
    cest: '17.005.00',
    cfop: '5.102',
  },
  Bacon: {
    ncm: '0210.12.00',
    cest: '17.006.00',
    cfop: '5.102',
  },
  Catupiry: {
    ncm: '0406.30.00',
    cest: '17.007.00',
    cfop: '5.102',
  },
  Azeitona: {
    ncm: '2005.70.00',
    cest: '17.008.00',
    cfop: '5.102',
  },
  'Palmito em Conserva': {
    ncm: '2008.91.00',
    cest: '17.009.00',
    cfop: '5.102',
  },
  'Milho Verde': {
    ncm: '2005.80.00',
    cest: '17.010.00',
    cfop: '5.102',
  },
  Ervilha: {
    ncm: '2005.40.00',
    cest: '17.011.00',
    cfop: '5.102',
  },
  Champignon: {
    ncm: '0709.51.00',
    cest: '17.012.00',
    cfop: '5.102',
  },
  Brócolis: {
    ncm: '0704.10.00',
    cest: '17.013.00',
    cfop: '5.102',
  },
  'Molho de Tomate': {
    ncm: '2103.20.10',
    cest: '17.014.00',
    cfop: '5.102',
  },
  Azeite: {
    ncm: '1509.10.00',
    cest: '17.015.00',
    cfop: '5.102',
  },
  Orégano: {
    ncm: '0910.99.90',
    cest: '17.016.00',
    cfop: '5.102',
  },
  'Manjericão Fresco': {
    ncm: '1211.90.90',
    cest: '17.017.00',
    cfop: '5.102',
  },
  Alho: {
    ncm: '0703.20.90',
    cest: '17.018.00',
    cfop: '5.102',
  },
  Cebola: {
    ncm: '0703.10.10',
    cest: '17.019.00',
    cfop: '5.102',
  },
  Pimentão: {
    ncm: '0709.60.00',
    cest: '17.020.00',
    cfop: '5.102',
  },
  Ovos: {
    ncm: '0407.21.00',
    cest: '17.021.00',
    cfop: '5.102',
  },
  'Cream Cheese': {
    ncm: '0406.30.00',
    cest: '17.022.00',
    cfop: '5.102',
  },
  'Chocolate ao Leite': {
    ncm: '1806.32.10',
    cest: '17.023.00',
    cfop: '5.102',
  },
  'Doce de Leite': {
    ncm: '0402.91.00',
    cest: '17.024.00',
    cfop: '5.102',
  },
};

async function seedFiscalClassification() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Conectado ao banco de dados');

    const queryRunner = dataSource.createQueryRunner();

    for (const [name, classification] of Object.entries(
      FISCAL_CLASSIFICATION,
    )) {
      const result = await queryRunner.query(
        `UPDATE ingredients 
         SET ncm = $1, cest = $2, cfop = $3, updated_at = NOW()
         WHERE name ILIKE $4`,
        [
          classification.ncm,
          classification.cest,
          classification.cfop,
          `%${name}%`,
        ],
      );

      if (result[1] > 0) {
        console.log(`${name}: NCM ${classification.ncm}`);
      } else {
        console.log(`${name}: Ingrediente não encontrado`);
      }
    }

    console.log('\nClassificação fiscal populada com sucesso!');

    await dataSource.destroy();
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

// Executar script
seedFiscalClassification();
