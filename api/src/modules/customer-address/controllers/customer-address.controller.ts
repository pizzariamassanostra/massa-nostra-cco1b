// ============================================
// CONTROLLER: CUSTOMER ADDRESS
// ============================================
// Responsável pelos endpoints de gerenciamento de endereços de clientes,
// incluindo criação, listagem, atualização e exclusão (soft delete).
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
} from '@nestjs/common';
import { CustomerAddressService } from '../services/customer-address.service';
import { CreateCustomerAddressDto } from '../dtos/create-customer-address.dto';

@Controller('customer/:id/address')
export class CustomerAddressController {
  constructor(private readonly service: CustomerAddressService) {}

  // Cria um novo endereço para o cliente
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) customerId: number,
    @Body() dto: CreateCustomerAddressDto,
  ) {
    return this.service.createAddress(customerId, dto);
  }

  // Lista todos os endereços do cliente
  @Get()
  async findAll(@Param('id', ParseIntPipe) customerId: number) {
    return this.service.findAllAddresses(customerId);
  }

  // Atualiza um endereço existente
  @Put(':addressId')
  async update(
    @Param('id', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() dto: CreateCustomerAddressDto,
  ) {
    return this.service.updateAddress(customerId, addressId, dto);
  }

  // Deleta um endereço do cliente (soft delete)
  @Delete(':addressId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    return this.service.removeAddress(customerId, addressId);
  }
}
