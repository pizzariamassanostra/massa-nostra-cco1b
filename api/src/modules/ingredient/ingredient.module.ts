// ============================================
// MÓDULO: INGREDIENTES E ESTOQUE
// ============================================
// Responsável por registrar entidades, serviços e controllers
// relacionados ao gerenciamento de ingredientes e estoque.
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ========== ENTIDADES ==========
import { Ingredient } from './entities/ingredient.entity';
import { Stock } from './entities/stock.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { StockAlert } from './entities/stock-alert.entity';

// ========== SERVIÇOS ==========
import { IngredientService } from './services/ingredient.service';
import { StockService } from './services/stock.service';
import { StockMovementService } from './services/stock-movement.service';

// ========== CONTROLLERS ==========
import { IngredientController } from './controllers/ingredient.controller';

@Module({
  imports: [
    // Registra entidades no contexto do TypeORM
    TypeOrmModule.forFeature([Ingredient, Stock, StockMovement, StockAlert]),
  ],
  controllers: [
    // Controller para endpoints relacionados a ingredientes
    IngredientController,
  ],
  providers: [
    // Serviços responsáveis pela lógica de negócio
    IngredientService,
    StockService,
    StockMovementService,
  ],
  exports: [
    // Exporta serviços para uso em outros módulos
    IngredientService,
    StockService,
    StockMovementService,
  ],
})
export class IngredientModule {}
