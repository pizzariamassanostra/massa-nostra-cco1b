// ============================================
// MÓDULO: ENDEREÇOS DE CLIENTES
// ============================================
// Responsável por gerenciar os endereços cadastrados pelos clientes,
// incluindo criação, atualização, listagem e exclusão.
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ========== CONTROLLERS ==========
import { CustomerAddressController } from './controllers/customer-address.controller';

// ========== SERVIÇO ==========
import { CustomerAddressService } from './services/customer-address.service';

// ========== ENTIDADES ==========
import { Address } from '../order/entities/address.entity';
import { CommonUser } from '../common-user/entities/common-user.entity';

@Module({
  imports: [
    // Registra entidades no contexto do TypeORM
    TypeOrmModule.forFeature([Address, CommonUser]),
  ],
  controllers: [
    // Controller para endpoints relacionados a endereços de clientes
    CustomerAddressController,
  ],
  providers: [
    // Serviço responsável pela lógica de negócio de endereços
    CustomerAddressService,
  ],
})
export class CustomerAddressModule {}
