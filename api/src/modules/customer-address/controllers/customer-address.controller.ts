// ============================================
// CONTROLLER: CUSTOMER ADDRESS
// ============================================
// - Rota alterada para /order/address
// - Adicionado JwtAuthGuard
// - Pega user_id do token JWT automaticamente
// ============================================

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerAddressService } from '../services/customer-address.service';
import { CreateCustomerAddressDto } from '../dtos/create-customer-address.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'; // ADICIONADO

@Controller('order/address') // ROTA CORRIGIDA (antes era customer/: id/address)
@UseGuards(JwtAuthGuard) // PROTEGE TODAS AS ROTAS COM JWT
export class CustomerAddressController {
  constructor(private readonly service: CustomerAddressService) {}

  // ============================================
  // CRIAR ENDEREÇO (PEGA USER_ID DO TOKEN JWT)
  // ============================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() dto: CreateCustomerAddressDto) {
    console.log('CREATE ADDRESS - Token User:', req.user); // LOG PARA DEBUG

    // PEGA ID DO USUÁRIO LOGADO DO TOKEN JWT
    const userId = req.user?.id || req.user?.sub;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    return this.service.createAddress(userId, dto);
  }

  // ============================================
  // LISTAR ENDEREÇOS DO USUÁRIO LOGADO
  // ============================================
  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id || req.user?.sub;
    return this.service.findAllAddresses(userId);
  }

  // ============================================
  // BUSCAR ENDEREÇO ESPECÍFICO
  // ============================================
  @Get(':addressId')
  async findOne(
    @Request() req,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    const userId = req.user?.id || req.user?.sub;
    return this.service.findOneAddress(userId, addressId);
  }

  // ============================================
  // ATUALIZAR ENDEREÇO
  // ============================================
  @Put(': addressId')
  async update(
    @Request() req,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() dto: CreateCustomerAddressDto,
  ) {
    const userId = req.user?.id || req.user?.sub;
    return this.service.updateAddress(userId, addressId, dto);
  }

  // ============================================
  // DELETAR ENDEREÇO
  // ============================================
  @Delete(': addressId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    const userId = req.user?.id || req.user?.sub;
    return this.service.removeAddress(userId, addressId);
  }

  // ============================================
  // BUSCAR ENDEREÇOS DE CLIENTE ESPECÍFICO (ADMIN)
  // ============================================
  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findAllAddresses(userId);
  }
}
