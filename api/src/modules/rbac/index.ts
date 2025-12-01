// ===========================================
// INDEX: RBAC
// Exports centralizados do módulo RBAC
// ===========================================

// Module
export * from './rbac.module';

// Entities
export * from './entities/role.entity';
export * from './entities/permission.entity';
export * from './entities/user-role.entity';

// Services
export * from './services/role.service';
export * from './services/permission.service';

// Controllers
export * from './controllers/role.controller';
export * from './controllers/permission.controller';

// Guards
export * from './guards/roles.guard';
export * from './guards/permissions.guard';

// Decorators
export * from './decorators/roles.decorator';
export * from './decorators/permissions.decorator';

// Enums
export * from './enums/role.enum';
export * from './enums/permission.enum';

// DTOs
export * from './dtos/create-role.dto';
export * from './dtos/update-role.dto';
export * from './dtos/assign-role.dto';

// Seed
export * from './seeds/rbac.seed';
