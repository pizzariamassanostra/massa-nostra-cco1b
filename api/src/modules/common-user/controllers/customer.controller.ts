// ============================================
// CONTROLLER: CUSTOMER
// ============================================
// Controller público com endpoints de autenticação e perfil de clientes.
// Inclui registro, login, consulta de perfil, atualização e exclusão de conta.
// ============================================

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service';
import { RegisterCustomerDto } from '../dtos/register-customer.dto';
import { LoginCustomerDto } from '../dtos/login-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { JwtCustomerAuthGuard } from '@/common/guards/jwt-customer-auth.guard';

@ApiTags('Clientes')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Registra novo cliente com validações
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Validação falhou' })
  async register(@Body() dto: RegisterCustomerDto) {
    const user = await this.customerService.register(dto);

    return {
      ok: true,
      message: 'Cadastro realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
        created_at: user.created_at,
      },
    };
  }

  // Autentica cliente com email ou telefone
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de cliente',
    description: 'Realizar login com email ou telefone',
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginCustomerDto) {
    const { user, access_token } = await this.customerService.login(dto);

    return {
      ok: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
      },
      access_token,
    };
  }

  // Busca dados do perfil do cliente autenticado
  @Get('profile')
  @UseGuards(JwtCustomerAuthGuard)
  @ApiOperation({ summary: 'Buscar perfil do cliente autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async getProfile(@Request() req) {
    const userId = req.user.id;
    const user = await this.customerService.getProfile(userId);

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
        birth_date: user.birth_date,
        phone_alternative: user.phone_alternative,
        accept_promotions: user.accept_promotions,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  // Atualiza dados do perfil do cliente
  @Put('profile')
  @UseGuards(JwtCustomerAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar perfil do cliente' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 400, description: 'Validação falhou' })
  async updateProfile(@Request() req, @Body() dto: UpdateCustomerDto) {
    const userId = req.user.id;
    const user = await this.customerService.updateProfile(userId, dto);

    return {
      ok: true,
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
        birth_date: user.birth_date,
        phone_alternative: user.phone_alternative,
        accept_promotions: user.accept_promotions,
        updated_at: user.updated_at,
      },
    };
  }

  // Deleta a conta do cliente (soft delete - LGPD)
  @Delete('account')
  @UseGuards(JwtCustomerAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir conta de cliente (LGPD)' })
  @ApiResponse({ status: 200, description: 'Conta excluída' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async deleteAccount(@Request() req) {
    const userId = req.user.id;
    await this.customerService.deleteAccount(userId);

    return {
      ok: true,
      message:
        'Conta excluída com sucesso. Seus dados foram mantidos para fins de histórico (LGPD).',
    };
  }
}
