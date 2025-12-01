// ============================================
// MÓDULO PRINCIPAL DA APLICAÇÃO
// ============================================
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'dotenv';

// ============================================
// IMPORTAR MÓDULOS DA APLICAÇÃO
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
// Carrega .env
// ============================================
config();

@Module({
  imports: [
    // ============================================
    // CONFIGURAÇÃO GLOBAL DO .ENV
    // ============================================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ScheduleModule.forRoot(),

    // ============================================
    // TYPEORM (PRODUÇÃO + SUPABASE POOLER)
    // ============================================
    TypeOrmModule.forRoot({
      type: 'postgres',

      // CONECTA NO SUPABASE (POOLER)
      host: process.env.DB_HOST, // aws-1-sa-east-1.pooler.supabase.com
      port: Number(process.env.DB_PORT), // 6543
      username: process.env.DB_USERNAME, // postgres.immtupjumavgpefcvzpg
      password: process.env.DB_PASSWORD, // a senha que você criou
      database: process.env.DB_DATABASE, // postgres

      // Carrega todas entidades automaticamente
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      // IMPORTANTE:
      // Nunca use synchronize em produção
      synchronize: process.env.NODE_ENV === 'development',

      logging: process.env.NODE_ENV === 'development',

      // Render + Supabase EXIGEM SSL
      ssl: { rejectUnauthorized: false },
    }),

    // ============================================
    // MÓDULOS DA APLICAÇÃO
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
