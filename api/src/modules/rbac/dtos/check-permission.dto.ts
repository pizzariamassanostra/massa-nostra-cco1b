/**
 * ============================================
 * DTO: VERIFICAR PERMISSÃO
 * ============================================
 * Representa os dados necessários para verificar se um usuário possui
 * determinada permissão no sistema.
 */

import { IsNotEmpty, IsString } from 'class-validator';
import { PermissionEnum } from '../enums/permission.enum';

export class CheckPermissionDto {
  // Nome da permissão a ser verificada (obrigatório)
  @IsNotEmpty()
  @IsString()
  permission: PermissionEnum;
}
