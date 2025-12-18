// ============================================
// CONFIGURAÇÃO: TYPEORM + SUPABASE
// ============================================
// Arquivo responsável por configurar a conexão
// com o banco PostgreSQL do Supabase via TypeORM
// ============================================

// ============================================
// IMPORTS: TypeORM
// ============================================
import { DataSource } from 'typeorm';

// ============================================
// IMPORTS: Variáveis de Ambiente
// ============================================
import * as dotenv from 'dotenv';

// ============================================
// CARREGAMENTO DAS VARIÁVEIS DE AMBIENTE
// ============================================
dotenv.config();

// ============================================
// CONFIGURAÇÃO: DataSource (TypeORM)
// ============================================
const config = new DataSource({
  type: 'postgres', // Tipo de banco (Supabase utiliza PostgreSQL)

  // ============================================
  // CREDENCIAIS DO BANCO (Supabase)
  // ============================================
  host: process.env.DB_HOST, // Host do banco
  port: Number(process.env.DB_PORT), // Porta de conexão (ex: 5432)
  username: process.env.DB_USERNAME, // Usuário do banco
  password: process.env.DB_PASSWORD, // Senha do banco
  database: process.env.DB_NAME, // Nome do banco

  // ============================================
  // ENTIDADES
  // ============================================
  // TypeORM carrega automaticamente arquivos *.entity.ts ou *.entity.js
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // ============================================
  // CONFIGURAÇÕES GERAIS
  // ============================================
  synchronize: false, // Nunca usar true em produção
  logging: process.env.NODE_ENV === 'development', // Log apenas em desenvolvimento

  // ============================================
  // SSL (Obrigatório no Supabase)
  // ============================================
  ssl: {
    rejectUnauthorized: false, // Aceita certificados autoassinados
  },
});

// ============================================
// EXPORTAÇÃO: DataSource
// ============================================
export default config;
