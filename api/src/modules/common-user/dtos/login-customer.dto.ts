// ============================================
// DTO: LOGIN CUSTOMER
// ============================================
// Responsável por autenticar o cliente utilizando
// email ou telefone junto com a senha cadastrada.
// ============================================

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCustomerDto {
  // Email ou telefone do cliente (10-11 dígitos ou formato de email)
  @ApiProperty({
    description: 'Email ou Telefone do cliente (10-11 dígitos ou email)',
    example: 'email@provedor.com ou 38999999999',
  })
  @IsString({ message: 'Email ou telefone deve ser um texto' })
  @IsNotEmpty({ message: 'Email ou telefone é obrigatório' })
  username: string;

  // Senha cadastrada pelo cliente
  @ApiProperty({
    description: 'Senha cadastrada',
    example: 'SenhaForte123',
  })
  @IsString({ message: 'Senha deve ser um texto' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}
