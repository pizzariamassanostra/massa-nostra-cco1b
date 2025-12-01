// ============================================
// SERVIÇO: REVIEW
// ============================================
// Serviço responsável pela lógica de avaliações de pedidos,
// incluindo criação, listagem e cálculo de médias.
// ============================================

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderReview } from '../entities/review.entity';
import { Order } from '../entities/order.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(OrderReview)
    private readonly reviewRepository: Repository<OrderReview>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Cria uma avaliação para um pedido entregue
  async createReview(
    orderId: number,
    customerId: number,
    dto: CreateReviewDto,
  ): Promise<OrderReview> {
    // Valida se o pedido existe
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Valida se o pedido pertence ao cliente
    if (order.common_user_id !== customerId) {
      throw new BadRequestException('Este pedido não pertence a você');
    }

    // Valida se o pedido foi entregue
    if (order.status !== 'delivered') {
      throw new BadRequestException(
        `Só é possível avaliar pedidos entregues. Status atual: ${order.status}`,
      );
    }

    // Valida se já existe avaliação deste cliente para este pedido
    const existingReview = await this.reviewRepository.findOne({
      where: { order_id: orderId, customer_id: customerId },
    });

    if (existingReview) {
      throw new BadRequestException('Você já avaliou este pedido');
    }

    // Cria e salva a avaliação
    const review = this.reviewRepository.create({
      order_id: orderId,
      customer_id: customerId,
      overall_rating: dto.overall_rating,
      food_quality: dto.food_quality || dto.overall_rating,
      delivery_time: dto.delivery_time || dto.overall_rating,
      packaging: dto.packaging || dto.overall_rating,
      comment: dto.comment,
    });

    return this.reviewRepository.save(review);
  }

  // Busca a avaliação de um pedido específico
  async getReviewByOrder(orderId: number): Promise<OrderReview> {
    const review = await this.reviewRepository.findOne({
      where: { order_id: orderId },
      relations: ['customer'],
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return review;
  }

  // Lista todas as avaliações feitas por um cliente
  async getCustomerReviews(customerId: number): Promise<OrderReview[]> {
    return this.reviewRepository.find({
      where: { customer_id: customerId },
      relations: ['order'],
      order: { created_at: 'DESC' },
    });
  }

  // Lista todas as avaliações com paginação (Admin)
  async getAllReviews(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ reviews: OrderReview[]; total: number }> {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      relations: ['customer', 'order'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { reviews, total };
  }

  // Calcula a média de avaliações por critério
  async getAverageRating(): Promise<{
    overall: number;
    food_quality: number;
    delivery_time: number;
    packaging: number;
    total_reviews: number;
  }> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.overall_rating)', 'overall')
      .addSelect('AVG(review.food_quality)', 'food_quality')
      .addSelect('AVG(review.delivery_time)', 'delivery_time')
      .addSelect('AVG(review.packaging)', 'packaging')
      .addSelect('COUNT(review.id)', 'total_reviews')
      .getRawOne();

    return {
      overall: parseFloat(result.overall) || 0,
      food_quality: parseFloat(result.food_quality) || 0,
      delivery_time: parseFloat(result.delivery_time) || 0,
      packaging: parseFloat(result.packaging) || 0,
      total_reviews: parseInt(result.total_reviews) || 0,
    };
  }
}
