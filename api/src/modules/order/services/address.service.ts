// ============================================
// SERVIÇO: ENDEREÇOS DE ENTREGA
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dtos/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  // ============================================
  // LISTAR ENDEREÇOS DO CLIENTE
  // ============================================
  async findByUser(userId: number): Promise<Address[]> {
    return this.addressRepo.find({
      where: { common_user_id: userId, deleted_at: null },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  // ============================================
  // BUSCAR ENDEREÇO POR ID
  // ============================================
  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepo.findOne({
      where: { id, deleted_at: null },
    });

    if (!address) {
      throw new NotFoundException(`Endereço #${id} não encontrado`);
    }

    return address;
  }

  // ============================================
  // CRIAR ENDEREÇO
  // ============================================
  async create(userId: number, dto: CreateAddressDto): Promise<Address> {
    // Se for endereço padrão, desmarcar outros
    if (dto.is_default) {
      await this.addressRepo.update(
        { common_user_id: userId },
        { is_default: false },
      );
    }

    const address = this.addressRepo.create({
      common_user_id: userId,
      ...dto,
    });

    return this.addressRepo.save(address);
  }

  // ============================================
  // ATUALIZAR ENDEREÇO
  // ============================================
  async update(id: number, dto: CreateAddressDto): Promise<Address> {
    const address = await this.findOne(id);

    if (dto.is_default) {
      await this.addressRepo.update(
        { common_user_id: address.common_user_id },
        { is_default: false },
      );
    }

    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  // ============================================
  // DELETAR ENDEREÇO (SOFT DELETE)
  // ============================================
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.addressRepo.softDelete(id);
  }
}
