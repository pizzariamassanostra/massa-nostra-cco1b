// ============================================
// DATABASE CONFIG: POSTGRESQL + TYPEORM
// ============================================
// Configura e exporta a conexão com o banco de dados PostgreSQL
// utilizando variáveis de ambiente do arquivo .env.
// ============================================

import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  ssl: true, // garante conexão segura com Supabase
  extra: {
    family: 4, // força uso de IPv4
  },
});
