// ============================================
// CONTROLLER: REVIEW
// ============================================
// Responsável pelos endpoints de avaliações de pedidos.
// Permite criar, consultar e listar avaliações,
// além de retornar estatísticas gerais.
// ============================================

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { JwtCustomerAuthGuard } from '../../../common/guards/jwt-customer-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Cria uma avaliação para um pedido entregue (requer autenticação)
  @Post('order/:orderId')
  @UseGuards(JwtCustomerAuthGuard)
  async createReview(
    @Param('orderId') orderId: string,
    @Body() dto: CreateReviewDto,
    @Request() req,
  ) {
    // Extrai ID do cliente do token JWT
    const customerId = req.user.id;

    const review = await this.reviewService.createReview(
      Number(orderId),
      Number(customerId),
      dto,
    );

    return {
      ok: true,
      message: 'Avaliação registrada com sucesso!',
      review,
    };
  }

  // Busca a avaliação de um pedido específico
  @Get('order/:orderId')
  async getReviewByOrder(@Param('orderId') orderId: string) {
    const review = await this.reviewService.getReviewByOrder(Number(orderId));

    return {
      ok: true,
      review,
    };
  }

  // Lista avaliações do cliente logado
  @Get('customer/:customerId')
  @UseGuards(JwtCustomerAuthGuard)
  async getCustomerReviews(
    @Param('customerId') customerId: string,
    @Request() req,
  ) {
    // Valida se o cliente está consultando suas próprias avaliações
    const loggedCustomerId = req.user.id;

    if (Number(customerId) !== loggedCustomerId) {
      throw new Error('Você só pode ver suas próprias avaliações');
    }

    const reviews = await this.reviewService.getCustomerReviews(
      Number(customerId),
    );

    return {
      ok: true,
      reviews,
    };
  }

  // Lista todas as avaliações com paginação (Admin)
  @Get()
  async getAllReviews(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const { reviews, total } = await this.reviewService.getAllReviews(
      Number(page),
      Number(limit),
    );

    return {
      ok: true,
      reviews,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  // Retorna estatísticas gerais de avaliações
  @Get('stats/average')
  async getAverageRating() {
    const stats = await this.reviewService.getAverageRating();

    return {
      ok: true,
      stats,
    };
  }
}
