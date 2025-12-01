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
import { CustomerAddressModule } from './modules/customer-address/customer-address.module'; // 👈 ADICIONE ESTA LINHA
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

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    // AUTENTICAÇÃO E USUÁRIOS
    AuthModule,
    CommonUserModule,
    AdminUserModule,
    RbacModule,
    CustomerAddressModule,

    // PAGAMENTOS
    PaymentModule,

    // PRODUTOS
    ProductCategoryModule,
    ProductModule,

    // PEDIDOS
    OrderModule,

    // COMPROVANTES
    ReceiptModule,

    // NOTIFICAÇÕES
    NotificationModule,

    // RELATÓRIOS
    ReportsModule,

    // INSÚMOS
    SupplierModule,
    IngredientModule,
  ],
})
export class AppModule {}
