// ============================================
// MÓDULO: FORNECEDORES
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades relacionadas ao domínio de fornecedores
import { Supplier } from './entities/supplier.entity';
import { SupplierQuote } from './entities/supplier-quote.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SupplierEvaluation } from './entities/supplier-evaluation.entity';

// Serviços responsáveis pela lógica de negócio
import { SupplierService } from './services/supplier.service';
import { SupplierQuoteService } from './services/supplier-quote.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { SupplierEvaluationService } from './services/supplier-evaluation.service';

// Controlador responsável por expor endpoints HTTP
import { SupplierController } from './controllers/supplier.controller';

@Module({
  // Importa entidades para uso com o TypeORM dentro deste módulo
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      SupplierQuote,
      PurchaseOrder,
      SupplierEvaluation,
    ]),
  ],

  // Define os controladores que lidam com requisições HTTP
  controllers: [SupplierController],

  // Define os serviços disponíveis dentro do módulo
  providers: [
    SupplierService,
    SupplierQuoteService,
    PurchaseOrderService,
    SupplierEvaluationService,
  ],

  // Exporta serviços para que possam ser utilizados em outros módulos
  exports: [
    SupplierService,
    SupplierQuoteService,
    PurchaseOrderService,
    SupplierEvaluationService,
  ],
})
export class SupplierModule {}
