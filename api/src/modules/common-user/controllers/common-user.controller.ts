// ============================================
// CONTROLLER: COMMON USER (ADMIN)
// ============================================
// Controller administrativo para gerenciar clientes comuns.
// Restrito a administradores, permite listar clientes com paginação.
// ============================================

import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { FindOneCommonUserService } from '../services/find-one-common-user.service';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { CommonUser } from '../entities/common-user.entity';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Clientes (Admin)')
@Controller('common-user')
export class CommonUserController {
  constructor(private readonly findOneCommonUser: FindOneCommonUserService) {}

  // Lista todos os clientes com paginação (somente admin)
  @Get('list')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os clientes (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async list(@Query() options: PaginationDto<CommonUser>) {
    const { commonUsers, count } = await this.findOneCommonUser.list({
      ...options,
      additionalSelects: ['created_at', 'updated_at'],
    });

    return {
      ok: true,
      commonUsers,
      count,
      page: options.page || 1,
      per_page: options.per_page || 10,
      total_pages: Math.ceil(count / (options.per_page || 10)),
    };
  }
}
