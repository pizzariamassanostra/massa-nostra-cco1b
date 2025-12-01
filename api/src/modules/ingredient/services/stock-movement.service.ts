// ============================================
// SERVIÇO: MOVIMENTAÇÃO DE ESTOQUE
// ============================================
// Registra todas as entradas e saídas
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from '../entities/stock-movement.entity';
import { Stock } from '../entities/stock.entity';
import { Ingredient } from '../entities/ingredient.entity';
import { StockService } from './stock.service';
import { StockEntryDto } from '../dtos/stock-entry.dto';
import { StockExitDto } from '../dtos/stock-exit.dto';
import { StockAdjustmentDto } from '../dtos/stock-adjustment.dto';
import { MovementType } from '../enums/movement-type.enum';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly movementRepo: Repository<StockMovement>,

    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,

    private readonly stockService: StockService,
  ) {}

  // ============================================
  // ENTRADA DE ESTOQUE (COMPRA)
  // ============================================
  async entry(dto: StockEntryDto, userId: number): Promise<StockMovement> {
    // Validar ingrediente
    const ingredient = await this.ingredientRepo.findOne({
      where: { id: dto.ingredient_id },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `Ingrediente #${dto.ingredient_id} não encontrado`,
      );
    }

    // Buscar ou criar lote de estoque
    const stock = await this.stockService.createStock({
      ingredient_id: dto.ingredient_id,
      quantity: dto.quantity,
      unit_cost: dto.unit_cost,
      batch_number: dto.batch_number,
      manufacturing_date: dto.manufacturing_date
        ? new Date(dto.manufacturing_date)
        : undefined,
      expiry_date: dto.expiry_date ? new Date(dto.expiry_date) : undefined,
      location: dto.location,
    });

    // Gerar número da movimentação
    const movementNumber = await this.generateMovementNumber();

    // Calcular valores
    const totalValue = dto.quantity * dto.unit_cost;

    // Registrar movimentação
    const movement = this.movementRepo.create({
      movement_number: movementNumber,
      type: MovementType.PURCHASE,
      ingredient_id: dto.ingredient_id,
      stock_id: stock.id,
      quantity: dto.quantity,
      unit_cost: dto.unit_cost,
      total_value: totalValue,
      balance_before: 0,
      balance_after: dto.quantity,
      supplier_id: dto.supplier_id,
      invoice_number: dto.invoice_number,
      user_id: userId,
      notes: dto.notes,
      movement_date: new Date(),
    });

    return this.movementRepo.save(movement);
  }

  // ============================================
  // SAÍDA DE ESTOQUE (CONSUMO/VENDA)
  // ============================================
  async exit(dto: StockExitDto, userId: number): Promise<StockMovement> {
    // Buscar estoque
    const stocks = await this.stockService.findByIngredient(dto.ingredient_id);

    if (stocks.length === 0) {
      throw new NotFoundException(
        `Nenhum estoque encontrado para ingrediente #${dto.ingredient_id}`,
      );
    }

    // Se não especificou lote, usar FIFO (primeiro a vencer)
    const stock = dto.stock_id
      ? stocks.find((s) => s.id === dto.stock_id)
      : stocks[0];

    if (!stock) {
      throw new NotFoundException(`Lote de estoque não encontrado`);
    }

    const currentQuantity = parseFloat(stock.quantity.toString());

    // Subtrair quantidade
    await this.stockService.subtractQuantity(stock.id, dto.quantity);

    // Gerar número da movimentação
    const movementNumber = await this.generateMovementNumber();

    // Registrar movimentação
    const movement = this.movementRepo.create({
      movement_number: movementNumber,
      type: dto.type,
      ingredient_id: dto.ingredient_id,
      stock_id: stock.id,
      quantity: dto.quantity,
      unit_cost: parseFloat(stock.unit_cost.toString()),
      total_value: dto.quantity * parseFloat(stock.unit_cost.toString()),
      balance_before: currentQuantity,
      balance_after: currentQuantity - dto.quantity,
      order_id: dto.order_id,
      user_id: userId,
      reason: dto.reason,
      notes: dto.notes,
      movement_date: new Date(),
    });

    return this.movementRepo.save(movement);
  }

  // ============================================
  // AJUSTE DE ESTOQUE (INVENTÁRIO)
  // ============================================
  async adjustment(
    dto: StockAdjustmentDto,
    userId: number,
  ): Promise<StockMovement> {
    // Buscar estoque
    const stocks = await this.stockService.findByIngredient(dto.ingredient_id);

    if (stocks.length === 0) {
      throw new NotFoundException(
        `Nenhum estoque encontrado para ingrediente #${dto.ingredient_id}`,
      );
    }

    const stock = dto.stock_id
      ? stocks.find((s) => s.id === dto.stock_id)
      : stocks[0];

    if (!stock) {
      throw new NotFoundException(`Lote de estoque não encontrado`);
    }

    const currentQuantity = parseFloat(stock.quantity.toString());
    const difference = dto.new_quantity - currentQuantity;

    // Atualizar quantidade
    await this.stockService.updateQuantity(stock.id, dto.new_quantity);

    // Gerar número da movimentação
    const movementNumber = await this.generateMovementNumber();

    // Determinar tipo (entrada ou saída)
    const type =
      difference > 0 ? MovementType.ADJUSTMENT_IN : MovementType.ADJUSTMENT_OUT;

    // Registrar movimentação
    const movement = this.movementRepo.create({
      movement_number: movementNumber,
      type,
      ingredient_id: dto.ingredient_id,
      stock_id: stock.id,
      quantity: Math.abs(difference),
      unit_cost: parseFloat(stock.unit_cost.toString()),
      total_value:
        Math.abs(difference) * parseFloat(stock.unit_cost.toString()),
      balance_before: currentQuantity,
      balance_after: dto.new_quantity,
      user_id: userId,
      reason: dto.reason,
      notes: dto.notes,
      movement_date: new Date(),
    });

    return this.movementRepo.save(movement);
  }

  // ============================================
  // GERAR NÚMERO DA MOVIMENTAÇÃO
  // ============================================
  private async generateMovementNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    const lastMovement = await this.movementRepo
      .createQueryBuilder('movement')
      .where('movement.movement_number LIKE :pattern', {
        pattern: `MOV-${dateStr}%`,
      })
      .orderBy('movement.id', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastMovement) {
      const lastNumber = lastMovement.movement_number.split('-').pop();
      sequence = parseInt(lastNumber || '0', 10) + 1;
    }

    return `MOV-${dateStr}-${String(sequence).padStart(3, '0')}`;
  }

  // ============================================
  // LISTAR MOVIMENTAÇÕES
  // ============================================
  async findAll(filters?: {
    ingredient_id?: number;
    type?: MovementType;
    start_date?: Date;
    end_date?: Date;
  }): Promise<StockMovement[]> {
    const query = this.movementRepo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.ingredient', 'ingredient')
      .leftJoinAndSelect('movement.stock', 'stock')
      .leftJoinAndSelect('movement.supplier', 'supplier')
      .leftJoinAndSelect('movement.user', 'user');

    if (filters?.ingredient_id) {
      query.andWhere('movement.ingredient_id = :ingredient_id', {
        ingredient_id: filters.ingredient_id,
      });
    }

    if (filters?.type) {
      query.andWhere('movement.type = :type', { type: filters.type });
    }

    if (filters?.start_date) {
      query.andWhere('movement.movement_date >= :start_date', {
        start_date: filters.start_date,
      });
    }

    if (filters?.end_date) {
      query.andWhere('movement.movement_date <= :end_date', {
        end_date: filters.end_date,
      });
    }

    query.orderBy('movement.movement_date', 'DESC');

    return query.getMany();
  }

  // ============================================
  // BUSCAR MOVIMENTAÇÃO POR ID
  // ============================================
  async findOne(id: number): Promise<StockMovement> {
    const movement = await this.movementRepo.findOne({
      where: { id },
      relations: ['ingredient', 'stock', 'supplier', 'user'],
    });

    if (!movement) {
      throw new NotFoundException(`Movimentação #${id} não encontrada`);
    }

    return movement;
  }
}
