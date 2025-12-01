// ============================================
// SERVIÇO: CATEGORIAS DE PRODUTOS
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../entities/product-category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,
  ) {}

  // ============================================
  // LISTAR TODAS AS CATEGORIAS
  // ============================================
  async findAll(): Promise<ProductCategory[]> {
    return this.categoryRepo.find({
      where: { deleted_at: null },
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  // ============================================
  // LISTAR APENAS CATEGORIAS ATIVAS
  // ============================================
  async findActive(): Promise<ProductCategory[]> {
    return this.categoryRepo.find({
      where: { status: 'active', deleted_at: null },
      order: { sort_order: 'ASC' },
    });
  }

  // ============================================
  // BUSCAR UMA CATEGORIA POR ID
  // ============================================
  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.categoryRepo.findOne({
      where: { id, deleted_at: null },
    });

    if (!category) {
      throw new NotFoundException(`Categoria #${id} não encontrada`);
    }

    return category;
  }

  // ============================================
  // BUSCAR POR SLUG
  // ============================================
  async findBySlug(slug: string): Promise<ProductCategory> {
    const category = await this.categoryRepo.findOne({
      where: { slug, deleted_at: null },
    });

    if (!category) {
      throw new NotFoundException(`Categoria "${slug}" não encontrada`);
    }

    return category;
  }

  // ============================================
  // CRIAR CATEGORIA
  // ============================================
  async create(dto: CreateCategoryDto): Promise<ProductCategory> {
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  // ============================================
  // ATUALIZAR CATEGORIA
  // ============================================
  async update(id: number, dto: UpdateCategoryDto): Promise<ProductCategory> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  // ============================================
  // SOFT DELETE (Inativar)
  // ============================================
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.softDelete(id);
  }
}
