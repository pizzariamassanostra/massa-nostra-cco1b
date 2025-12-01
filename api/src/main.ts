// ============================================
// API - PIZZARIA MASSA NOSTRA
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
  // NECESSÁRIO PARA PRODUÇÃO NO RENDER
  // ============================================
  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().set('trust proxy', true);

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
  // CORS — CONFIGURAÇÃO ROBUSTA
  // ============================================
  app.enableCors({
    origin: [
      'https://massa-nostra-cco1b.onrender.com',
      'https://massa-nostra-cco1b-1.onrender.com',
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL_PRODUCTION,
      'http://localhost:3000', // Para desenvolvimento local
      '*', // Temporário, remover em produção
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
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
  console.log(
    `URL da API: ${process.env.FRONTEND_URL_PRODUCTION || 'Não configurado'}`,
  );
  console.log(`Swagger:   /api-docs`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════\n');

  // Escuta na porta especificada
  await app.listen(port, '0.0.0.0');

  console.log('API rodando com sucesso!\n');
}

// ============================================
// EXECUTA A APLICAÇÃO
// ============================================
bootstrap();
