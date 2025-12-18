// ============================================
// MÓDULO: APP MODULE
// ============================================
// Módulo raiz da aplicação NestJS
// Responsável por carregar configurações globais
// e registrar todos os módulos da aplicação
// ============================================

// ============================================
// IMPORTS: NestJS
// ============================================
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'dotenv';

// ============================================
// IMPORTS: MÓDULOS DA APLICAÇÃO
// ============================================
import { AuthModule } from './modules/auth/auth.module';
import { AdminUserModule } from './modules/admin-user/admin-user.module';
import { CommonUserModule } from './modules/common-user/common-user.module';
import { CustomerAddressModule } from './modules/customer-address/customer-address.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';

// ============================================
// CARREGAMENTO DO .ENV
// ============================================
config();

@Module({
  imports: [
    // ============================================
    // CONFIGURAÇÃO GLOBAL DE VARIÁVEIS DE AMBIENTE
    // ============================================
    ConfigModule.forRoot({
      isGlobal: true, // Disponibiliza variáveis globalmente
      envFilePath: '.env', // Caminho do arquivo .env
    }),

    // ============================================
    // AGENDAMENTO DE TAREFAS (CRON / INTERVAL)
    // ============================================
    ScheduleModule.forRoot(),

    // ============================================
    // CONFIGURAÇÃO: TYPEORM + SUPABASE (POOLER)
    // ============================================
    TypeOrmModule.forRoot({
      type: 'postgres', // Banco PostgreSQL

      // ============================================
      // CONEXÃO COM SUPABASE (POOLER)
      // ============================================
      host: process.env.DB_HOST, // Host do pooler Supabase
      port: parseInt(process.env.DB_PORT || '6543'), // Porta padrão do pooler
      username: process.env.DB_USERNAME, // Usuário do banco
      password: process.env.DB_PASSWORD, // Senha do banco
      database: process.env.DB_NAME || 'postgres', // Nome do banco

      // ============================================
      // ENTIDADES
      // ============================================
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Carrega entidades automaticamente

      // ============================================
      // CONFIGURAÇÕES IMPORTANTES
      // ============================================
      synchronize: false, // NUNCA usar true em produção
      logging: process.env.NODE_ENV === 'development', // Logs apenas em dev

      // ============================================
      // SSL (Obrigatório: Render + Supabase)
      // ============================================
      ssl: {
        rejectUnauthorized: false, // Aceita certificado autoassinado
        ca: process.env.SUPABASE_SSL_CERT, // Certificado customizado (se existir)
      },
    }),

    // ============================================
    // REGISTRO DOS MÓDULOS DA APLICAÇÃO
    // ============================================
    AuthModule,
    CommonUserModule,
    AdminUserModule,
    RbacModule,
    CustomerAddressModule,
    PaymentModule,
    ProductCategoryModule,
    ProductModule,
    OrderModule,
    ReceiptModule,
    NotificationModule,
    ReportsModule,
    SupplierModule,
    IngredientModule,
  ],
})
export class AppModule {}
