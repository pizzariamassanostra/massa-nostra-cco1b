// ============================================
// SCRIPT: SEED RBAC
// ============================================
// Responsável por inicializar a conexão com o banco
// e executar o seed de papéis e permissões (RBAC)
// ============================================

// ============================================
// IMPORTS: TypeORM
// ============================================
import { DataSource } from 'typeorm';

// ============================================
// IMPORTS: SEEDS
// ============================================
import { seedRBAC } from '../modules/rbac/seeds/rbac.seed';

// ============================================
// IMPORTS: ENV
// ============================================
import * as dotenv from 'dotenv';

// ============================================
// CARREGA VARIÁVEIS DE AMBIENTE (.env)
// ============================================
dotenv.config();

// ============================================
// CONFIGURAÇÃO: DATA SOURCE (POSTGRESQL)
// ============================================
// Utiliza URL única de conexão (ex.: Supabase / Render)
// ============================================
const AppDataSource = new DataSource({
  type: 'postgres', // Tipo do banco de dados
  url: process.env.DATABASE_URL, // URL de conexão do banco
  entities: ['dist/**/*.entity{.ts,.js}'], // Entidades compiladas
  synchronize: false, // Nunca sincronizar automaticamente em produção
  ssl: {
    rejectUnauthorized: false, // Aceita SSL sem validação de certificado
  },
});

// ============================================
// FUNÇÃO: bootstrap
// ============================================
// Inicializa a conexão com o banco,
// executa o seed de RBAC e encerra o processo
// ============================================
async function bootstrap() {
  try {
    // Log inicial
    console.log('Conectando ao banco de dados...');
    console.log('URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');

    // Inicializa conexão com o banco
    await AppDataSource.initialize();
    console.log('Conectado ao banco de dados');

    // Executa seed de RBAC (roles e permissões)
    await seedRBAC(AppDataSource);

    // Encerra conexão com o banco
    await AppDataSource.destroy();
    console.log('Seed concluído com sucesso!');

    // Finaliza processo com sucesso
    process.exit(0);
  } catch (error) {
    // Log de erro
    console.error('Erro ao executar seed:', error);

    // Finaliza processo com erro
    process.exit(1);
  }
}

// ============================================
// EXECUÇÃO DO SCRIPT
// ============================================
bootstrap();
