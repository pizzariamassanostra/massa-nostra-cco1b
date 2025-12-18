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
import { JwtCustomerAuthGuard } from '../../../common/guards/jwt-customer-auth.guard';

@Controller('order/address')
@UseGuards(JwtCustomerAuthGuard)
export class CustomerAddressController {
  constructor(private readonly service: CustomerAddressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() dto: CreateCustomerAddressDto) {
    const userId = req.user?. id || req.user?.sub;
    if (!userId) throw new Error('Usuário não autenticado');
    return this.service.createAddress(userId, dto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id || req.user?.sub;
    return this.service.findAllAddresses(userId);
  }

  @Get(':addressId')
  async findOne(@Request() req, @Param('addressId', ParseIntPipe) addressId: number) {
    const userId = req.user?.id || req.user?.sub;
    return this.service.findOneAddress(userId, addressId);
  }

  @Put(':addressId')
  async update(@Request() req, @Param('addressId', ParseIntPipe) addressId: number, @Body() dto: CreateCustomerAddressDto) {
    const userId = req.user?.id || req.user?.sub;
    return this. service.updateAddress(userId, addressId, dto);
  }

  @Delete(':addressId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('addressId', ParseIntPipe) addressId: number) {
    const userId = req.user?. id || req.user?.sub;
    return this.service.removeAddress(userId, addressId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findAllAddresses(userId);
  }
}
