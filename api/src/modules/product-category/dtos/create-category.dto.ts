// ============================================
// DTO: CRIAR CATEGORIA
// ============================================
// Representa os dados necessários para criar uma nova categoria
// ============================================

import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateCategoryDto {
  // Nome da categoria (obrigatório)
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  // Slug único da categoria (obrigatório)
  @IsString({ message: 'Slug é obrigatório' })
  slug: string;

  // Descrição da categoria (opcional)
  @IsOptional()
  @IsString()
  description?: string;

  // URL da imagem representativa da categoria (opcional)
  @IsOptional()
  @IsString()
  image_url?: string;

  // Ordem de exibição da categoria (opcional)
  @IsOptional()
  @IsInt()
  sort_order?: number;

  // Status da categoria (active ou inactive, opcional)
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
