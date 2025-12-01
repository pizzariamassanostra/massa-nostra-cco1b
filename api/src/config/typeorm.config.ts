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
  // Tipo de banco de dados utilizado
  type: 'postgres',

  // Host do servidor PostgreSQL (variável de ambiente)
  host: process.env.DB_HOST,

  // Porta do PostgreSQL (variável de ambiente, convertida para número)
  port: Number(process.env.DB_PORT),

  // Usuário do banco de dados (variável de ambiente)
  username: process.env.DB_USERNAME,

  // Senha do banco de dados (variável de ambiente)
  password: process.env.DB_PASSWORD,

  // Nome do banco de dados (variável de ambiente)
  database: process.env.DB_DATABASE,

  // Padrão de busca para arquivos de entidades TypeORM
  entities: ['src/**/*.entity.ts'],

  // Padrão de busca para arquivos de migrations
  migrations: ['src/migrations/*.ts'],

  // Desabilita sincronização automática de schema (usar migrations em produção)
  synchronize: false,

  // Habilita logs de queries SQL executadas no banco
  logging: true,
});
