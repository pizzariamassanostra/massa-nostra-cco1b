// ============================================
// CONTROLLER: PEDIDOS E ENDEREÇOS
// ============================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { AddressService } from '../services/address.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtCustomerAuthGuard } from '../../../common/guards/jwt-customer-auth.guard';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
  ) {}

  // CRIAR PEDIDO
  // Cliente cria um novo pedido
  // O ID do cliente é extraído automaticamente do token JWT
  @Post()
  @UseGuards(JwtCustomerAuthGuard)
  async createOrder(@Body() dto: CreateOrderDto, @Request() req) {
    // Extrair ID do cliente do token JWT
    const customerId = req.user.id;

    console.log('=== CRIAR PEDIDO ===');
    console.log('Customer ID (do JWT):', customerId);
    console.log('Dados do pedido:', dto);

    // Criar objeto completo do pedido
    const orderData = {
      common_user_id: customerId,
      address_id: dto.address_id,
      items: dto.items,
      payment_method: dto.payment_method,
      notes: dto.notes,
    };

    // Chamar o service correto
    const order = await this.orderService.create(orderData);

    return {
      ok: true,
      message: 'Pedido criado com sucesso',
      order,
    };
  }

  // ============================================
  // LISTAR PEDIDOS DO CLIENTE LOGADO (NOVO)
  // IMPORTANTE: DEVE VIR ANTES DE @Get(':id')
  // ============================================
  @Get('my-orders')
  @UseGuards(JwtCustomerAuthGuard)
  async getMyOrders(@Request() req) {
    const customerId = req.user.id;
    const orders = await this.orderService.findByUser(customerId);
    return {
      ok: true,
      orders,
      total: orders.length,
    };
  }

  // ============================================
  // BUSCAR PEDIDO POR ID
  // ============================================
  @Get(':id')
  async findOrder(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id);
    return {
      ok: true,
      order,
    };
  }

  // ============================================
  // LISTAR PEDIDOS DO CLIENTE
  // ============================================
  @Get('user/:userId')
  async findUserOrders(@Param('userId', ParseIntPipe) userId: number) {
    const orders = await this.orderService.findByUser(userId);
    return {
      ok: true,
      orders,
      total: orders.length,
    };
  }

  // ============================================
  // LISTAR TODOS OS PEDIDOS (ADMIN)
  // ============================================
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllOrders() {
    const orders = await this.orderService.findAll();
    return {
      ok: true,
      orders,
      total: orders.length,
    };
  }

  // ============================================
  // ATUALIZAR STATUS DO PEDIDO (ADMIN)
  // ============================================
  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    const order = await this.orderService.updateStatus(id, dto, req.user?.id);
    return {
      ok: true,
      message: 'Status atualizado com sucesso',
      order,
    };
  }

  // ============================================
  // VALIDAR TOKEN DE ENTREGA
  // ============================================
  @Post(':id/validate-token')
  async validateToken(
    @Param('id', ParseIntPipe) id: number,
    @Body('token') token: string,
  ) {
    const valid = await this.orderService.validateDeliveryToken(id, token);
    return {
      ok: true,
      valid,
      message: valid ? 'Token válido! Pedido entregue.' : 'Token inválido!',
    };
  }

  // ============================================
  // CANCELAR PEDIDO
  // ============================================
  @Post(':id/cancel')
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
  ) {
    const order = await this.orderService.cancel(id, reason);
    return {
      ok: true,
      message: 'Pedido cancelado',
      order,
    };
  }

  // ============================================
  // CRIAR ENDEREÇO
  // ============================================
  @Post('address')
  async createAddress(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateAddressDto,
  ) {
    const address = await this.addressService.create(userId, dto);
    return {
      ok: true,
      message: 'Endereço criado com sucesso',
      address,
    };
  }

  // ============================================
  // LISTAR ENDEREÇOS DO CLIENTE
  // ============================================
  @Get('address/user/:userId')
  async findUserAddresses(@Param('userId', ParseIntPipe) userId: number) {
    const addresses = await this.addressService.findByUser(userId);
    return {
      ok: true,
      addresses,
      total: addresses.length,
    };
  }

  // ============================================
  // ATUALIZAR ENDEREÇO
  // ============================================
  @Put('address/:id')
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAddressDto,
  ) {
    const address = await this.addressService.update(id, dto);
    return {
      ok: true,
      message: 'Endereço atualizado',
      address,
    };
  }

  // ============================================
  // DELETAR ENDEREÇO
  // ============================================
  @Delete('address/:id')
  async deleteAddress(@Param('id', ParseIntPipe) id: number) {
    await this.addressService.remove(id);
    return {
      ok: true,
      message: 'Endereço removido',
    };
  }
}
