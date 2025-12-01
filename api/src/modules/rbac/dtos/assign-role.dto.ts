/**
 * ============================================
 * DTO: ATRIBUIR ROLE A USUÁRIO
 * ============================================
 * Representa os dados necessários para atribuir um ou mais roles a um usuário.
 */

import { IsNotEmpty, IsInt, IsArray, ArrayMinSize } from 'class-validator';

export class AssignRoleDto {
  // Identificador único do usuário (obrigatório)
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsInt()
  user_id: number;

  // Lista de IDs dos roles a serem atribuídos (mínimo de 1 obrigatório)
  @IsNotEmpty({ message: 'Pelo menos um role deve ser informado' })
  @IsArray()
  @ArrayMinSize(1)
  role_ids: number[];
}
