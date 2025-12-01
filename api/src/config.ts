// ============================================
// CONFIGURAÇÃO TYPEORM + SUPABASE
// ============================================
// Este arquivo configura a conexão com o banco PostgreSQL do Supabase
// usando TypeORM como ORM (Object-Relational Mapping)
// ============================================

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração da conexão com Supabase (PostgreSQL)
const config = new DataSource({
  type: 'postgres', // Tipo de banco (Supabase usa PostgreSQL)

  // Credenciais do Supabase
  host: process.env.DB_HOST, // db.immtupjumavgpefcvzpg.supabase.co
  port: Number(process.env.DB_PORT), // 5432
  username: process.env.DB_USERNAME, // postgres
  password: process.env.DB_PASSWORD, // Pizza@Massa@Nostra
  database: process.env.DB_NAME, // postgres
  // TypeORM vai buscar todos os arquivos .entity.ts ou .entity.js
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  synchronize: false,

  logging: process.env.NODE_ENV === 'development',

  // SSL necessário para Supabase
  ssl: {
    rejectUnauthorized: false, // Aceita certificados auto-assinados
  },
});

export default config;
