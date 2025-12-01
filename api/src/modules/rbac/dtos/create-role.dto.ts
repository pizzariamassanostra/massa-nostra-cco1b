/**
 * ============================================
 * DTO: CRIAR ROLE
 * ============================================
 * Representa os dados necessários para criar um novo role.
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { RoleEnum } from '../enums/role.enum';
import { PermissionEnum } from '../enums/permission.enum';

export class CreateRoleDto {
  // Nome único do role (obrigatório)
  @IsNotEmpty({ message: 'Nome do role é obrigatório' })
  @IsString()
  name: RoleEnum;

  // Nome de exibição (obrigatório)
  @IsNotEmpty({ message: 'Nome de exibição é obrigatório' })
  @IsString()
  display_name: string;

  // Descrição do role (opcional)
  @IsOptional()
  @IsString()
  description?: string;

  // Nível hierárquico (1–10, opcional)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  level?: number;

  // Indica se o role está ativo (opcional)
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // Lista de IDs das permissões associadas ao role (opcional)
  @IsOptional()
  @IsArray()
  permission_ids?: number[];
}
