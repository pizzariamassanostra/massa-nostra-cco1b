// ============================================
// MÓDULO: PRODUTOS
// ============================================
// Responsável por gerenciar os produtos do cardápio,
// incluindo variantes, bordas de pizza e recheios.
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades relacionadas ao domínio de produtos
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { PizzaCrust } from './entities/pizza-crust.entity';
import { CrustFilling } from './entities/crust-filling.entity';

// Controlador responsável por expor endpoints HTTP
import { ProductController } from './controllers/product.controller';

// Serviços responsáveis pela lógica de negócio
import { ProductService } from './services/product.service';
import { CrustService } from './services/crust.service';
import { FillingService } from './services/filling.service';

@Module({
  // Importa entidades para uso com o TypeORM dentro deste módulo
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      PizzaCrust,
      CrustFilling,
    ]),
  ],

  // Define os controladores que lidam com requisições HTTP
  controllers: [ProductController],

  // Define os serviços disponíveis dentro do módulo
  providers: [ProductService, CrustService, FillingService],

  // Exporta serviços para que possam ser utilizados em outros módulos
  exports: [ProductService, CrustService, FillingService],
})
export class ProductModule {}
