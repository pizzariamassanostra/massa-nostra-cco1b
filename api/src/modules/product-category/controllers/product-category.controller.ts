// ============================================
// CONTROLLER: CATEGORIAS DE PRODUTOS
// ============================================
// Endpoints para gerenciar categorias do cardápio
// ============================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { ProductCategoryService } from '../services/product-category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  // ============================================
  // LISTAR TODAS AS CATEGORIAS (PÚBLICO)
  // ============================================
  @Get()
  async findAll() {
    const categories = await this.categoryService.findAll();
    return {
      ok: true,
      categories,
      total: categories.length,
    };
  }

  // ============================================
  // LISTAR APENAS CATEGORIAS ATIVAS (PÚBLICO)
  // ============================================
  @Get('active')
  async findActive() {
    const categories = await this.categoryService.findActive();
    return {
      ok: true,
      categories,
      total: categories.length,
    };
  }

  // ============================================
  // BUSCAR UMA CATEGORIA POR ID (PÚBLICO)
  // ============================================
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne(id);
    return {
      ok: true,
      category,
    };
  }

  // ============================================
  // BUSCAR CATEGORIA POR SLUG (PÚBLICO)
  // ============================================
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const category = await this.categoryService.findBySlug(slug);
    return {
      ok: true,
      category,
    };
  }

  // ============================================
  // CRIAR CATEGORIA (ADMIN)
  // ============================================
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoryService.create(dto);
    return {
      ok: true,
      message: 'Categoria criada com sucesso',
      category,
    };
  }

  // ============================================
  // ATUALIZAR CATEGORIA (ADMIN)
  // ============================================
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(id, dto);
    return {
      ok: true,
      message: 'Categoria atualizada com sucesso',
      category,
    };
  }

  // ============================================
  // DELETAR CATEGORIA (ADMIN)
  // ============================================
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.remove(id);
    return {
      ok: true,
      message: 'Categoria removida com sucesso',
    };
  }
}
