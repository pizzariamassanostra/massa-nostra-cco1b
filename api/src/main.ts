// ============================================
// API - PIZZARIA MASSA NOSTRA
// ============================================
// Arquivo principal da aplicação NestJS
// Configura CORS, validação, filtros, Swagger...
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

// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // ============================================
  // CRIA INSTÂNCIA DO NEST
  // ============================================
  const app = await NestFactory.create(AppModule);

  // ============================================
  // LIMITES DE PAYLOAD
  // ============================================
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // ============================================
  // VALIDAÇÃO GLOBAL (DTOs)
  // ============================================
  app.useGlobalPipes(new AppValidationPipe());

  // ============================================
  // FILTRO GLOBAL DE ERROS
  // ============================================
  app.useGlobalFilters(new ApiErrorFilter());

  // ============================================
  // CORS — AJUSTADO PARA PRODUÇÃO NO RENDER
  // ============================================
  app.enableCors({
    origin: [
      'http://localhost:3000', // Front local
      'http://localhost:3001', // API local
      'http://localhost:5173', // Front Vite
      'https://massa-nostra-cco1b.onrender.com', // FRONT PRODUÇÃO
      process.env.FRONTEND_URL_PRODUCTION, // Caso exista variável no .env
    ].filter(Boolean), // remove indefinidos

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
  });

  // ============================================
  // SWAGGER
  // ============================================
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pizzaria Massa Nostra API')
    .setDescription('API completa de delivery de pizzaria')
    .setVersion('1.0.0')
    .addTag('auth', 'Autenticação e login')
    .addTag('categories', 'Categorias de produtos')
    .addTag('products', 'Produtos do cardápio')
    .addTag('orders', 'Pedidos')
    .addTag('addresses', 'Endereços')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // ============================================
  // INICIA SERVIDOR
  // ============================================
  const port = process.env.PORT || 3001;

  console.log('\nPizzaria Massa Nostra API');
  console.log('═══════════════════════════════════');
  console.log(`Servidor iniciando na porta ${port}...`);
  console.log(`URL local: http://localhost:${port}`);
  console.log(`Swagger:   http://localhost:${port}/api-docs`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════\n');

  await app.listen(port);

  console.log('API rodando com sucesso!\n');
}

// ============================================
// EXECUTA A APLICAÇÃO
// ============================================
bootstrap();
