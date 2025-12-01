import { DataSource } from 'typeorm';
import { seedRBAC } from '../modules/rbac/seeds/rbac.seed';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente definidas no arquivo .env
dotenv.config();

// Configuração da conexão com o banco de dados PostgreSQL
const AppDataSource = new DataSource({
  type: 'postgres', // Tipo de banco utilizado
  url: process.env.DATABASE_URL, // URL de conexão obtida das variáveis de ambiente
  entities: ['dist/**/*.entity{.ts,.js}'], // Caminho das entidades compiladas
  synchronize: false, // Evita sincronização automática (boa prática em produção)
  ssl: {
    rejectUnauthorized: false, // Permite conexões SSL mesmo sem certificado confiável
  },
});

// Função principal responsável por inicializar a conexão e executar o seed
async function bootstrap() {
  try {
    console.log('Conectando ao banco de dados...');
    console.log('URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');

    await AppDataSource.initialize(); // Inicializa a conexão com o banco
    console.log('Conectado ao banco de dados');

    await seedRBAC(AppDataSource); // Executa o seed de RBAC (roles e permissões)

    await AppDataSource.destroy(); // Fecha a conexão após o seed
    console.log('Seed concluído com sucesso!');
    process.exit(0); // Finaliza o processo com sucesso
  } catch (error) {
    console.error('Erro ao executar seed:', error); // Log de erro em caso de falha
    process.exit(1); // Finaliza o processo com código de erro
  }
}

// Executa a função principal
bootstrap();
