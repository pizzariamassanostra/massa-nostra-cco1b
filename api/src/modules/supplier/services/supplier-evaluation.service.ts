// ============================================
// SERVIÇO: AVALIAÇÕES DE FORNECEDORES
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entidades utilizadas pelo serviço
import { SupplierEvaluation } from '../entities/supplier-evaluation.entity';
import { Supplier } from '../entities/supplier.entity';

// DTO para transferência de dados de avaliação
import { SupplierEvaluationDto } from '../dtos/supplier-evaluation.dto';

@Injectable()
export class SupplierEvaluationService {
  constructor(
    // Repositório para manipulação das avaliações
    @InjectRepository(SupplierEvaluation)
    private readonly evaluationRepo: Repository<SupplierEvaluation>,

    // Repositório para validação e acesso aos fornecedores
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  /**
   * Cria uma nova avaliação de fornecedor
   * @param dto Dados da avaliação recebidos via DTO
   * @param evaluatedBy ID do usuário que realizou a avaliação
   * @returns Avaliação persistida no banco
   */
  async create(
    dto: SupplierEvaluationDto,
    evaluatedBy: number,
  ): Promise<SupplierEvaluation> {
    // Verifica se o fornecedor existe
    const supplier = await this.supplierRepo.findOne({
      where: { id: dto.supplier_id },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor #${dto.supplier_id} não encontrado`,
      );
    }

    // Calcula a média geral das notas
    const overallRating =
      (dto.quality_rating +
        dto.delivery_rating +
        dto.price_rating +
        dto.service_rating) /
      4;

    // Cria a entidade de avaliação com os dados fornecidos
    const evaluation = this.evaluationRepo.create({
      supplier_id: dto.supplier_id,
      quality_rating: dto.quality_rating,
      delivery_rating: dto.delivery_rating,
      price_rating: dto.price_rating,
      service_rating: dto.service_rating,
      overall_rating: parseFloat(overallRating.toFixed(2)), // arredonda para 2 casas decimais
      comments: dto.comments,
      evaluated_by: evaluatedBy,
    });

    // Persiste a avaliação no banco
    return this.evaluationRepo.save(evaluation);
  }

  /**
   * Busca todas as avaliações de um fornecedor específico
   * @param supplierId ID do fornecedor
   * @returns Lista de avaliações ordenadas por data de criação (mais recentes primeiro)
   */
  async findBySupplier(supplierId: number): Promise<SupplierEvaluation[]> {
    return this.evaluationRepo.find({
      where: { supplier_id: supplierId },
      order: { created_at: 'DESC' },
    });
  }
}
