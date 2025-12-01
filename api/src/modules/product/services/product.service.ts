// ============================================
// SERVIÇO: PRODUCT
// ============================================
// Serviço responsável pela lógica de negócio dos produtos do cardápio
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Busca todos os produtos com filtros opcionais e relações carregadas
  async findAllWithFilters(filters: { status?: string; type?: string }) {
    return this.productRepository.find({
      where: { ...filters },
      relations: ['category', 'variants'],
      order: { sort_order: 'ASC' },
    });
  }

  // Busca produtos ativos de uma categoria específica
  async findByCategory(categoryId: number) {
    return this.productRepository.find({
      where: { category_id: categoryId, status: 'active' },
      relations: ['category', 'variants'],
      order: { sort_order: 'ASC' },
    });
  }

  // Busca um produto pelo ID com suas relações
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'variants'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  // Busca um produto pelo slug (URL amigável)
  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['category', 'variants'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  // Cria um novo produto no banco de dados
  async create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  // Atualiza um produto existente
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  // Deleta um produto (soft delete - mantém histórico no banco)
  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.softDelete(id);
  }

  // Obtém todas as variações de um produto específico
  async getVariants(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product.variants;
  }
}
