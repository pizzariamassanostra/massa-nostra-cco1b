// ============================================
// API - PIZZARIA MASSA NOSTRA
// ============================================
// Este é o arquivo principal que inicializa a aplicação NestJS
// Configura porta, CORS, validação, filtros de erro, Swagger...
// ============================================

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/app-validation.pipe';
import { ApiErrorFilter } from './common/pipes/filter-error.pipe';
import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

// Importa Express para configurações avançadas
import { json, urlencoded } from 'express';

// Importa Swagger para documentação da API
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // ============================================
  // CRIA INSTÂNCIA DA APLICAÇÃO NESTJS
  // ============================================
  const app = await NestFactory.create(AppModule);

  // ============================================
  // CONFIGURAÇÃO DE TAMANHO DE PAYLOAD
  // ============================================
  // Permite envio de arquivos grandes (até 10MB)
  // Necessário para upload de imagens de produtos
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Valida DTOs automaticamente em todas as rotas
  app.useGlobalPipes(new AppValidationPipe());

  // ============================================
  // FILTRO DE ERROS GLOBAL
  // ============================================
  // Captura e formata erros de forma padronizada
  app.useGlobalFilters(new ApiErrorFilter());

  // Permite que o frontend acesse a API e preflight requests
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend local
      'http://localhost:3001', // API local
      process.env.FRONTEND_URL_PRODUCTION, // Frontend produção (quando subir)
    ].filter(Boolean), // Remove valores undefined
    credentials: true, // Permite cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
  });

  // ============================================
  // SWAGGER DOCUMENTATION
  // ============================================
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pizzaria Massa Nostra API')
    .setDescription('API completa de delivery de pizzaria')
    .setVersion('1.0.0')
    .addTag('auth', 'Autenticação e login')
    .addTag('categories', 'Categorias de produtos')
    .addTag('products', 'Produtos do cardápio')
    .addTag('orders', 'Pedidos')
    .addTag('addresses', 'Endereços de entrega')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // ============================================
  // INICIALIZAÇÃO DO SERVIDOR
  // ============================================
  const port = process.env.PORT || 3001; // Porta padrão 3001

  console.log('\nPizzaria Massa Nostra API');
  console.log('═══════════════════════════════════');
  console.log(`Servidor iniciando na porta ${port}...`);
  console.log(`URL: http://localhost:${port}`);
  console.log(`Swagger Docs: http://localhost:${port}/api-docs`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('Banco: Supabase (PostgreSQL)');
  console.log('═══════════════════════════════════\n');

  // Inicia o servidor
  await app.listen(port);

  console.log('API rodando com sucesso!\n');
}

// ============================================
// EXECUTA FUNÇÃO BOOTSTRAP
// ============================================
bootstrap();
