// ============================================
// MODULO: RELATÓRIOS
// ============================================
// Módulo de relatórios gerenciais e analytics
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ============================================
// ENTITIES
// ============================================
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { CommonUser } from '../common-user/entities/common-user.entity';

// ============================================
// CONTROLLERS
// ============================================
import { ReportsController } from './controllers/reports.controller';

// ============================================
// SERVICES
// ============================================
import { ReportsService } from './services/reports.service';

@Module({
  // ============================================
  // IMPORTS
  // ============================================
  imports: [TypeOrmModule.forFeature([Order, OrderItem, CommonUser])],

  // ============================================
  // CONTROLLERS
  // ============================================
  controllers: [ReportsController],

  // ============================================
  // PROVIDERS
  // ============================================
  providers: [ReportsService],

  // ============================================
  // EXPORTS
  // ============================================
  exports: [ReportsService],
})
export class ReportsModule {}
