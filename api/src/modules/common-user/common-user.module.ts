// ============================================
// MÓDULO: CLIENTES (COMMON USERS)
// ============================================
// Responsável pela gestão de clientes comuns,
// incluindo cadastro, autenticação e consultas.
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// ========== ENTIDADES ==========
import { CommonUser } from './entities/common-user.entity';

// ========== CONTROLLERS ==========
import { CommonUserController } from './controllers/common-user.controller';
import { CustomerController } from './controllers/customer.controller';

// ========== REPOSITÓRIOS ==========
import { CommonUserRepository } from './repositories/common-user.repository';

// ========== SERVIÇOS ==========
import { FindOneCommonUserService } from './services/find-one-common-user.service';
import { CustomerService } from './services/customer.service';
import { CreateCommonUserService } from './services/create-common-user.service';

@Module({
  imports: [
    // Registra entidade CommonUser no contexto do TypeORM
    TypeOrmModule.forFeature([CommonUser]),

    // Configuração do JWT para autenticação de clientes
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [
    // Controllers responsáveis por endpoints de clientes
    CommonUserController,
    CustomerController,
  ],
  providers: [
    // Repositório e serviços de lógica de negócio
    CommonUserRepository,
    FindOneCommonUserService,
    CreateCommonUserService,
    CustomerService,
  ],
  exports: [
    // Exporta serviços para uso em outros módulos
    FindOneCommonUserService,
    CreateCommonUserService,
    CustomerService,
  ],
})
export class CommonUserModule {}
