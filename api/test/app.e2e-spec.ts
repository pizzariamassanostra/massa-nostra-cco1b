// ============================================
// TESTE E2E: AppController
// ============================================
// Teste end-to-end da aplicação principal
// Valida se a rota raiz (GET /) está respondendo corretamente
// ============================================

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

// ============================================
// SUÍTE DE TESTES: AppController (e2e)
// ============================================
describe('AppController (e2e)', () => {
  let app: INestApplication; // Instância da aplicação NestJS

  // ============================================
  // SETUP: Inicialização da aplicação antes de cada teste
  // ============================================
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Importa o módulo principal da aplicação
    }).compile();

    app = moduleFixture.createNestApplication(); // Cria a aplicação Nest
    await app.init(); // Inicializa a aplicação
  });

  // ============================================
  // TESTE: Rota raiz (GET /)
  // ============================================
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/') // Chamada HTTP GET na rota raiz
      .expect(200) // Espera status HTTP 200
      .expect('Hello World!'); // Espera resposta padrão
  });
});
