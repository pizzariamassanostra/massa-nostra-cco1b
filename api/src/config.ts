// ============================================
// CONFIGURAÇÃO DO TYPEORM - PIZZARIA MASSA NOSTRA
// ============================================
// CORREÇÃO:  Removido espaço extra na linha migrations
// ============================================

import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

// ============================================
// VALIDAR VARIÁVEIS OBRIGATÓRIAS
// ============================================
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável ${envVar} não encontrada no .env`);
  }
}

// ============================================
// LOG DE CONFIGURAÇÃO (apenas dev)
// ============================================
if (process.env.NODE_ENV !== 'production') {
  console.log(' Configuração do banco: ');
  console.log('   Host:', process.env.DB_HOST);
  console.log('   Port:', process.env.DB_PORT);
  console.log('   User:', process.env.DB_USERNAME);
  console.log('   Database:', process.env.DB_DATABASE);
  console.log('   SSL:  Habilitado');
}

// ============================================
// CONFIGURAÇÃO DO DATASOURCE
// ============================================
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '6543', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  // SSL obrigatório para Supabase
  ssl: {
    rejectUnauthorized: false,
  },

  // Entidades
  entities: [join(__dirname, 'modules', '**', 'entities', '*.entity.{ts,js}')],

  // Migrations - CORRIGIDO: removido espaço antes de {ts,js}
  migrations: [join(__dirname, 'migrations', '*. {ts,js}')],

  // Configurações
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  migrationsRun: false,

  // Pool de conexões
  extra: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
};

// ============================================
// DATASOURCE PARA MIGRATIONS
// ============================================
const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
