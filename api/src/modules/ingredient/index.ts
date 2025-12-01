// ============================================
// INDEX: INGREDIENTES E ESTOQUE
// ============================================
// Exporta todos os recursos do módulo
// ============================================

export * from './ingredient.module';

// Entities
export * from './entities/ingredient.entity';
export * from './entities/stock.entity';
export * from './entities/stock-movement.entity';
export * from './entities/stock-alert.entity';

// Services
export * from './services/ingredient.service';
export * from './services/stock.service';
export * from './services/stock-movement.service';

// DTOs
export * from './dtos/create-ingredient.dto';
export * from './dtos/update-ingredient.dto';
export * from './dtos/stock-entry.dto';
export * from './dtos/stock-exit.dto';
export * from './dtos/stock-adjustment.dto';

// Enums
export * from './enums/ingredient-status.enum';
export * from './enums/ingredient-group.enum';
export * from './enums/unit-measure.enum';
export * from './enums/movement-type.enum';
export * from './enums/alert-type.enum';

// Interfaces
export * from './interfaces/stock-summary.interface';
