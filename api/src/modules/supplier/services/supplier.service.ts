// ============================================
// SERVIÇO: FORNECEDORES
// ============================================
// Lógica de negócio para gestão de fornecedores
// CRUD + validações
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { CreateSupplierDto } from '../dtos/create-supplier.dto';
import { UpdateSupplierDto } from '../dtos/update-supplier.dto';
import { SupplierStatus } from '../enums/supplier-status.enum';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  // ============================================
  // CRIAR FORNECEDOR
  // ============================================
  // Validações:
  // - CNPJ único (não pode duplicar)
  // - CPF válido (formato)
  // - Status inicial: 'pre_registered'
  // ============================================
  async create(dto: CreateSupplierDto): Promise<Supplier> {
    // ============================================
    // VALIDAR CNPJ DUPLICADO
    // ============================================
    const existingSupplier = await this.supplierRepo.findOne({
      where: { cnpj: dto.cnpj, deleted_at: null },
    });

    if (existingSupplier) {
      throw new ConflictException(
        `Fornecedor com CNPJ ${dto.cnpj} já cadastrado`,
      );
    }

    // ============================================
    // VALIDAR FORMATO DO CNPJ (14 dígitos)
    // ============================================
    const cnpjNumeros = dto.cnpj.replace(/\D/g, ''); // Remove pontuação
    if (cnpjNumeros.length !== 14) {
      throw new BadRequestException('CNPJ inválido (deve ter 14 dígitos)');
    }

    // ============================================
    // VALIDAR FORMATO DO CEP (8 dígitos)
    // ============================================
    const cepNumeros = dto.cep.replace(/\D/g, '');
    if (cepNumeros.length !== 8) {
      throw new BadRequestException('CEP inválido (deve ter 8 dígitos)');
    }

    // ============================================
    // VALIDAR ESTADO (2 letras maiúsculas)
    // ============================================
    if (!/^[A-Z]{2}$/.test(dto.estado)) {
      throw new BadRequestException(
        'Estado inválido (deve ser 2 letras maiúsculas, ex: SP, MG)',
      );
    }

    // ============================================
    // CRIAR FORNECEDOR
    // ============================================
    const supplier = this.supplierRepo.create({
      ...dto,
      cnpj: cnpjNumeros,
      cep: cepNumeros,
      status: dto.status || SupplierStatus.PRE_REGISTERED,
    });

    return this.supplierRepo.save(supplier);
  }

  // ============================================
  // LISTAR TODOS OS FORNECEDORES
  // ============================================
  // Filtros opcionais:
  // - status (active, inactive...)
  // - cidade
  // - estado
  // ============================================
  async findAll(filters?: {
    status?: SupplierStatus;
    cidade?: string;
    estado?: string;
  }): Promise<Supplier[]> {
    const query = this.supplierRepo
      .createQueryBuilder('supplier')
      .where('supplier.deleted_at IS NULL'); // Apenas não deletados

    // Aplicar filtros (se fornecidos)
    if (filters?.status) {
      query.andWhere('supplier.status = :status', { status: filters.status });
    }

    if (filters?.cidade) {
      query.andWhere('supplier.cidade ILIKE :cidade', {
        cidade: `%${filters.cidade}%`,
      });
    }

    if (filters?.estado) {
      query.andWhere('supplier.estado = :estado', { estado: filters.estado });
    }

    // Ordenar por razão social
    query.orderBy('supplier.razao_social', 'ASC');

    return query.getMany();
  }

  // ============================================
  // BUSCAR FORNECEDOR POR ID
  // ============================================
  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({
      where: { id, deleted_at: null },
      relations: ['quotes', 'purchase_orders', 'evaluations'],
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor #${id} não encontrado`);
    }

    return supplier;
  }

  // ============================================
  // BUSCAR FORNECEDOR POR CNPJ
  // ============================================
  async findByCnpj(cnpj: string): Promise<Supplier | null> {
    const cnpjNumeros = cnpj.replace(/\D/g, '');

    return this.supplierRepo.findOne({
      where: { cnpj: cnpjNumeros, deleted_at: null },
    });
  }

  // ============================================
  // ATUALIZAR FORNECEDOR
  // ============================================
  async update(id: number, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);

    // Se estiver tentando alterar CNPJ, validar duplicidade
    if (dto.cnpj && dto.cnpj !== supplier.cnpj) {
      const cnpjNumeros = dto.cnpj.replace(/\D/g, '');
      const existing = await this.findByCnpj(cnpjNumeros);

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `CNPJ ${dto.cnpj} já cadastrado para outro fornecedor`,
        );
      }

      dto.cnpj = cnpjNumeros; // Salvar apenas números
    }

    // Atualizar campos
    Object.assign(supplier, dto);

    return this.supplierRepo.save(supplier);
  }

  // ============================================
  // DELETAR FORNECEDOR (SOFT DELETE)
  // ============================================
  async remove(id: number): Promise<void> {
    const supplier = await this.findOne(id);

    // Soft delete (marca deleted_at)
    supplier.deleted_at = new Date();
    await this.supplierRepo.save(supplier);
  }

  // ============================================
  // REATIVAR FORNECEDOR
  // ============================================
  async reactivate(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({
      where: { id },
      withDeleted: true, // Buscar até deletados
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor #${id} não encontrado`);
    }

    // Reativar
    supplier.deleted_at = null;
    supplier.status = SupplierStatus.ACTIVE;

    return this.supplierRepo.save(supplier);
  }

  // ============================================
  // ALTERAR STATUS DO FORNECEDOR
  // ============================================
  async changeStatus(id: number, newStatus: SupplierStatus): Promise<Supplier> {
    const supplier = await this.findOne(id);

    // Validar transições de status
    // Exemplo: não pode ir de 'rejected' para 'active' diretamente
    if (
      supplier.status === SupplierStatus.REJECTED &&
      newStatus === SupplierStatus.ACTIVE
    ) {
      throw new BadRequestException(
        'Fornecedor reprovado não pode ser ativado diretamente. Altere para under_review primeiro.',
      );
    }

    supplier.status = newStatus;
    return this.supplierRepo.save(supplier);
  }

  // ============================================
  // LISTAR APENAS FORNECEDORES ATIVOS
  // ============================================
  async findActive(): Promise<Supplier[]> {
    return this.supplierRepo.find({
      where: { status: SupplierStatus.ACTIVE, deleted_at: null },
      order: { razao_social: 'ASC' },
    });
  }

  // ============================================
  // CALCULAR MÉDIA DE AVALIAÇÕES
  // ============================================
  async calculateAverageRating(id: number): Promise<number> {
    const supplier = await this.supplierRepo.findOne({
      where: { id },
      relations: ['evaluations'],
    });

    if (
      !supplier ||
      !supplier.evaluations ||
      supplier.evaluations.length === 0
    ) {
      return 0;
    }

    const sum = supplier.evaluations.reduce(
      (acc, evaluation) =>
        acc + parseFloat(evaluation.overall_rating.toString()),
      0,
    );

    const average = sum / supplier.evaluations.length;

    // Atualizar nota no fornecedor
    supplier.nota_avaliacao = parseFloat(average.toFixed(2));
    await this.supplierRepo.save(supplier);

    return average;
  }
}
