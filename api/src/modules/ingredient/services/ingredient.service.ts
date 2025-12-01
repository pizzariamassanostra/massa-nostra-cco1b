// ============================================
// SERVIÇO: INGREDIENTES
// ============================================
// Lógica de negócio para gestão de ingredientes
// CRUD + validações
// ============================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { CreateIngredientDto } from '../dtos/create-ingredient.dto';
import { UpdateIngredientDto } from '../dtos/update-ingredient.dto';
import { IngredientStatus } from '../enums/ingredient-status.enum';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  // ============================================
  // CRIAR INGREDIENTE
  // ============================================
  async create(dto: CreateIngredientDto): Promise<Ingredient> {
    // Validar EAN duplicado (se fornecido)
    if (dto.ean) {
      const existing = await this.ingredientRepo.findOne({
        where: { ean: dto.ean, deleted_at: null },
      });

      if (existing) {
        throw new ConflictException(`Ingrediente com EAN ${dto.ean} já existe`);
      }
    }

    // Gerar código interno único
    const internalCode = await this.generateInternalCode();

    // Criar ingrediente
    const ingredient = this.ingredientRepo.create({
      ...dto,
      internal_code: internalCode,
    });

    return this.ingredientRepo.save(ingredient);
  }

  // ============================================
  // GERAR CÓDIGO INTERNO ÚNICO
  // ============================================
  // Formato: ING-YYYYMMDD-XXX
  // ============================================
  private async generateInternalCode(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Buscar último código do dia
    const lastIngredient = await this.ingredientRepo
      .createQueryBuilder('ingredient')
      .where('ingredient.internal_code LIKE :pattern', {
        pattern: `ING-${dateStr}%`,
      })
      .orderBy('ingredient.id', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastIngredient) {
      const lastNumber = lastIngredient.internal_code.split('-').pop();
      sequence = parseInt(lastNumber || '0', 10) + 1;
    }

    return `ING-${dateStr}-${String(sequence).padStart(3, '0')}`;
  }

  // ============================================
  // LISTAR TODOS OS INGREDIENTES
  // ============================================
  async findAll(filters?: {
    status?: IngredientStatus;
    group?: string;
    search?: string;
  }): Promise<Ingredient[]> {
    const query = this.ingredientRepo
      .createQueryBuilder('ingredient')
      .leftJoinAndSelect('ingredient.category', 'category')
      .where('ingredient.deleted_at IS NULL');

    // Filtro por status
    if (filters?.status) {
      query.andWhere('ingredient.status = :status', { status: filters.status });
    }

    // Filtro por grupo
    if (filters?.group) {
      query.andWhere('ingredient.group = :group', { group: filters.group });
    }

    // Busca por nome ou código
    if (filters?.search) {
      query.andWhere(
        '(ingredient.name ILIKE :search OR ingredient.internal_code ILIKE :search OR ingredient.ean ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query.orderBy('ingredient.name', 'ASC');

    return query.getMany();
  }

  // ============================================
  // BUSCAR INGREDIENTE POR ID
  // ============================================
  async findOne(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepo.findOne({
      where: { id, deleted_at: null },
      relations: ['category', 'stocks'],
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingrediente #${id} não encontrado`);
    }

    return ingredient;
  }

  // ============================================
  // BUSCAR POR CÓDIGO INTERNO
  // ============================================
  async findByInternalCode(code: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepo.findOne({
      where: { internal_code: code, deleted_at: null },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingrediente ${code} não encontrado`);
    }

    return ingredient;
  }

  // ============================================
  // BUSCAR POR EAN
  // ============================================
  async findByEan(ean: string): Promise<Ingredient | null> {
    return this.ingredientRepo.findOne({
      where: { ean, deleted_at: null },
    });
  }

  // ============================================
  // ATUALIZAR INGREDIENTE
  // ============================================
  async update(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.findOne(id);

    // Validar EAN duplicado (se mudou)
    if (dto.ean && dto.ean !== ingredient.ean) {
      const existing = await this.findByEan(dto.ean);
      if (existing && existing.id !== id) {
        throw new ConflictException(`EAN ${dto.ean} já existe`);
      }
    }

    Object.assign(ingredient, dto);
    return this.ingredientRepo.save(ingredient);
  }

  // ============================================
  // DELETAR INGREDIENTE (SOFT DELETE)
  // ============================================
  async remove(id: number): Promise<void> {
    const ingredient = await this.findOne(id);

    // Verificar se tem estoque
    if (ingredient.stocks && ingredient.stocks.length > 0) {
      const totalStock = ingredient.stocks.reduce(
        (sum, stock) => sum + parseFloat(stock.quantity.toString()),
        0,
      );

      if (totalStock > 0) {
        throw new BadRequestException(
          'Não é possível excluir ingrediente com estoque',
        );
      }
    }

    ingredient.deleted_at = new Date();
    await this.ingredientRepo.save(ingredient);
  }

  // ============================================
  // ALTERAR STATUS
  // ============================================
  async changeStatus(
    id: number,
    status: IngredientStatus,
  ): Promise<Ingredient> {
    const ingredient = await this.findOne(id);
    ingredient.status = status;
    return this.ingredientRepo.save(ingredient);
  }

  // ============================================
  // LISTAR APENAS ATIVOS
  // ============================================
  async findActive(): Promise<Ingredient[]> {
    return this.ingredientRepo.find({
      where: { status: IngredientStatus.ACTIVE, deleted_at: null },
      order: { name: 'ASC' },
    });
  }
}
