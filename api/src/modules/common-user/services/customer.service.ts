// ============================================
// SERVIÇO: CLIENTES (CUSTOMER)
// ============================================
// Lógica de negócio para registro, login e gestão de clientes
// ============================================

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonUserRepository } from '../repositories/common-user.repository';
import { RegisterCustomerDto } from '../dtos/register-customer.dto';
import { LoginCustomerDto } from '../dtos/login-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CommonUser } from '../entities/common-user.entity';
import {
  hashPassword,
  validatePassword,
} from '@/common/functions/hash-password';
import { validateCPF, formatCPF } from '@/common/functions/validate-cpf';
import ApiError from '@/common/error/entities/api-error.entity';

@Injectable()
export class CustomerService {
  constructor(
    private readonly userRepository: CommonUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // ============================================
  // GERAR TOKEN JWT PARA CLIENTE
  // ============================================
  private generateToken(user: CommonUser): string {
    const payload = {
      id: user.id,
      type: 'customer',
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
    return this.jwtService.sign(payload);
  }

  // ============================================
  // REGISTRAR NOVO CLIENTE
  // ============================================
  async register(dto: RegisterCustomerDto): Promise<CommonUser> {
    // Validação de CPF
    if (dto.cpf) {
      if (!validateCPF(dto.cpf)) {
        throw new BadRequestException('CPF inválido');
      }

      const existingCpf = await this.userRepository.findOne({
        where: [{ cpf: formatCPF(dto.cpf) }],
      });

      if (existingCpf) {
        throw new BadRequestException('CPF já cadastrado');
      }
    }

    // Validação de telefone único
    const formattedPhone = dto.phone.replace(/\D/g, '');
    const existingPhone = await this.userRepository.findOne({
      where: [{ phone: formattedPhone }],
    });

    if (existingPhone) {
      throw new BadRequestException('Telefone já cadastrado');
    }

    // Validação de email único
    if (dto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: [{ email: dto.email.toLowerCase() }],
      });

      if (existingEmail) {
        throw new BadRequestException('Email já cadastrado');
      }
    }

    // Validação de termos de uso (LGPD)
    if (!dto.accept_terms) {
      throw new BadRequestException(
        'É obrigatório aceitar os termos de uso para se cadastrar',
      );
    }

    // Criar hash da senha
    const passwordHash = await hashPassword(dto.password);

    // Criar usuário no banco
    const newUser = new CommonUser();
    newUser.name = dto.name;
    newUser.cpf = dto.cpf ? formatCPF(dto.cpf) : null;
    newUser.birth_date = dto.birth_date ? new Date(dto.birth_date) : null;
    newUser.phone = formattedPhone;
    newUser.phone_alternative =
      dto.phone_alternative?.replace(/\D/g, '') || null;
    newUser.email = dto.email?.toLowerCase() || null;
    newUser.password_hash = passwordHash;
    newUser.accept_terms = dto.accept_terms;
    newUser.accept_promotions = dto.accept_promotions || false;

    const savedUser = await this.userRepository.create(newUser);

    delete savedUser.password_hash;
    return savedUser;
  }

  // ============================================
  // LOGIN DE CLIENTE
  // ============================================
  async login(dto: LoginCustomerDto): Promise<{
    user: CommonUser;
    access_token: string;
  }> {
    const { username, password } = dto;
    const formattedPhone = username.replace(/\D/g, '');

    const user = await this.userRepository.findOne({
      where: [{ email: username.toLowerCase() }, { phone: formattedPhone }],
      with_password_hash: true,
    });

    if (!user) {
      throw new UnauthorizedException('Email/telefone ou senha incorretos');
    }

    if (!user.password_hash) {
      throw new UnauthorizedException(
        'Usuário sem senha cadastrada. Por favor, redefina sua senha.',
      );
    }

    const isPasswordValid = await validatePassword(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email/telefone ou senha incorretos');
    }

    const access_token = this.generateToken(user);

    delete user.password_hash;
    return { user, access_token };
  }

  // ============================================
  // BUSCAR PERFIL DO CLIENTE
  // ============================================
  async getProfile(userId: number): Promise<CommonUser> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    if (!user) {
      throw new ApiError('user-not-found', 'Usuário não encontrado', 404);
    }

    delete user.password_hash;
    return user;
  }

  // ============================================
  // ATUALIZAR PERFIL DO CLIENTE
  // ============================================
  async updateProfile(
    userId: number,
    dto: UpdateCustomerDto,
  ): Promise<CommonUser> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    if (!user) {
      throw new ApiError('user-not-found', 'Usuário não encontrado', 404);
    }

    const updateData: Partial<CommonUser> = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.birth_date) updateData.birth_date = new Date(dto.birth_date);
    if (dto.phone_alternative)
      updateData.phone_alternative = dto.phone_alternative.replace(/\D/g, '');
    if (dto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: [{ email: dto.email.toLowerCase() }],
      });

      if (existingEmail && existingEmail.id !== userId) {
        throw new BadRequestException('Email já está em uso');
      }

      updateData.email = dto.email.toLowerCase();
    }

    if (dto.password) {
      updateData.password_hash = await hashPassword(dto.password);
    }

    const updatedUser = await this.userRepository.update(userId, updateData);

    delete updatedUser.password_hash;
    return updatedUser;
  }

  // ============================================
  // EXCLUIR CONTA (SOFT DELETE)
  // ============================================
  async deleteAccount(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    if (!user) {
      throw new ApiError('user-not-found', 'Usuário não encontrado', 404);
    }

    await this.userRepository.update(userId, {
      deleted_at: new Date(),
    } as any);
  }
}
