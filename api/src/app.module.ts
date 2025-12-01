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

config(); // Carrega .env manualmente

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
    // TYPEORM + SUPABASE
    // ============================================
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      // NUNCA usar synchronize em produção
      synchronize: process.env.NODE_ENV === 'development',

      logging: process.env.NODE_ENV === 'development',

      // OBRIGATÓRIO NO SUPABASE
      ssl: {
        rejectUnauthorized: false,
      },
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
