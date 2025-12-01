// ============================================
// SERVIÇO: CUSTOMER ADDRESS
// ============================================
// Responsável pela lógica de gerenciamento de endereços de clientes,
// incluindo criação, listagem, atualização e exclusão (soft delete).
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../order/entities/address.entity';
import { CommonUser } from '../../common-user/entities/common-user.entity';
import { CreateCustomerAddressDto } from '../dtos/create-customer-address.dto';

@Injectable()
export class CustomerAddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(CommonUser)
    private readonly userRepo: Repository<CommonUser>,
  ) {}

  // Remove caracteres inválidos do CEP
  private cleanCep(cep: string): string {
    return cep.replace('-', '').trim();
  }

  // Cria um novo endereço para o cliente
  async createAddress(customerId: number, dto: CreateCustomerAddressDto) {
    const user = await this.userRepo.findOne({ where: { id: customerId } });
    if (!user) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Se for endereço padrão, remove default dos outros
    if (dto.is_default) {
      await this.addressRepo.update(
        { common_user_id: customerId },
        { is_default: false },
      );
    }

    const address = this.addressRepo.create({
      street: dto.street,
      number: dto.number,
      complement: dto.complement,
      neighborhood: dto.neighborhood,
      city: dto.city,
      state: dto.state,
      zip_code: this.cleanCep(dto.cep),
      reference: dto.reference,
      delivery_instructions: dto.delivery_instructions,
      is_default: dto.is_default || false,
      common_user_id: customerId,
    });

    await this.addressRepo.save(address);

    return {
      ok: true,
      message: 'Endereço criado com sucesso',
      data: address,
    };
  }

  // Lista todos os endereços do cliente
  async findAllAddresses(customerId: number) {
    const user = await this.userRepo.findOne({ where: { id: customerId } });
    if (!user) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const addresses = await this.addressRepo.find({
      where: { common_user_id: customerId },
      order: { is_default: 'DESC' },
    });

    return {
      ok: true,
      count: addresses.length,
      data: addresses,
    };
  }

  // Atualiza um endereço existente do cliente
  async updateAddress(
    customerId: number,
    addressId: number,
    dto: CreateCustomerAddressDto,
  ) {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, common_user_id: customerId },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado para este cliente');
    }

    // Se for endereço padrão, remove default dos outros
    if (dto.is_default) {
      await this.addressRepo.update(
        { common_user_id: customerId },
        { is_default: false },
      );
    }

    address.street = dto.street;
    address.number = dto.number;
    address.complement = dto.complement;
    address.neighborhood = dto.neighborhood;
    address.city = dto.city;
    address.state = dto.state;
    address.zip_code = this.cleanCep(dto.cep);
    address.reference = dto.reference;
    address.delivery_instructions = dto.delivery_instructions;
    address.is_default = dto.is_default || false;

    await this.addressRepo.save(address);

    return {
      ok: true,
      message: 'Endereço atualizado com sucesso',
      data: address,
    };
  }

  // Deleta um endereço do cliente (soft delete)
  async removeAddress(customerId: number, addressId: number) {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, common_user_id: customerId },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado para este cliente');
    }

    // Valida se cliente tem mais de um endereço
    const count = await this.addressRepo.count({
      where: { common_user_id: customerId },
    });

    if (count === 1) {
      throw new BadRequestException(
        'Não é possível deletar o único endereço do cliente',
      );
    }

    await this.addressRepo.softRemove(address);

    return {
      ok: true,
      message: 'Endereço excluído com sucesso',
    };
  }
}
