// ============================================
// SCRIPT DE TESTE DE CONEXÃO - SUPABASE
// ============================================
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    console.log(' Conectando ao banco...');
    console.log('   Host:', process.env.DB_HOST);
    console.log('   Port:', process.env.DB_PORT);
    console.log('   User:', process.env.DB_USERNAME);
    console.log('   Database:', process.env.DB_DATABASE);

    await client.connect();
    console.log(' Conexão estabelecida!\n');

    const result = await client.query('SELECT version()');
    console.log(
      ' PostgreSQL:',
      result.rows[0].version.split(' ').slice(0, 2).join(' '),
    );

    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log(`\n Tabelas encontradas: ${tables.rows.length}`);
    if (tables.rows.length > 0) {
      tables.rows.forEach((row) => console.log('   ✓', row.tablename));
    } else {
      console.log('     Nenhuma tabela encontrada (banco vazio)');
    }

    await client.end();
    console.log('\n Teste concluído com sucesso!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n Erro de conexão: ');
    console.error('   Mensagem:', error.message);
    console.error('   Código:', error.code);
    console.error('\n Verifique: ');
    console.error('   1. Variáveis no . env estão corretas');
    console.error(
      '   2. IP está liberado no Supabase (Settings > Database > Connection Pooling)',
    );
    console.error('   3. Senha não contém caracteres especiais sem escape\n');
    process.exit(1);
  }
}

testConnection();
