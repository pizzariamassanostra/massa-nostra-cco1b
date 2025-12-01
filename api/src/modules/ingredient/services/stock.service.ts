// ============================================
// SERVIÇO: CONTROLE DE ESTOQUE
// ============================================
// Gerencia entradas, saídas e consultas de estoque
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { Ingredient } from '../entities/ingredient.entity';
import { StockAlert } from '../entities/stock-alert.entity';
import { StockSummary } from '../interfaces/stock-summary.interface';
import { AlertType } from '../enums/alert-type.enum';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,

    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,

    @InjectRepository(StockAlert)
    private readonly alertRepo: Repository<StockAlert>,
  ) {}

  // ============================================
  // BUSCAR ESTOQUE POR INGREDIENTE
  // ============================================
  async findByIngredient(ingredientId: number): Promise<Stock[]> {
    return this.stockRepo.find({
      where: { ingredient_id: ingredientId },
      relations: ['ingredient'],
      order: { expiry_date: 'ASC' }, // FIFO: primeiro a vencer
    });
  }

  // ============================================
  // BUSCAR ESTOQUE POR ID
  // ============================================
  async findOne(id: number): Promise<Stock> {
    const stock = await this.stockRepo.findOne({
      where: { id },
      relations: ['ingredient'],
    });

    if (!stock) {
      throw new NotFoundException(`Estoque #${id} não encontrado`);
    }

    return stock;
  }

  // ============================================
  // CRIAR LOTE DE ESTOQUE
  // ============================================
  async createStock(data: {
    ingredient_id: number;
    quantity: number;
    unit_cost: number;
    batch_number?: string;
    manufacturing_date?: Date;
    expiry_date?: Date;
    location?: string;
    minimum_quantity?: number;
    maximum_quantity?: number;
  }): Promise<Stock> {
    // Validar ingrediente
    const ingredient = await this.ingredientRepo.findOne({
      where: { id: data.ingredient_id },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `Ingrediente #${data.ingredient_id} não encontrado`,
      );
    }

    // Calcular valor total
    const totalValue = data.quantity * data.unit_cost;

    const stock = this.stockRepo.create({
      ...data,
      total_value: totalValue,
    });

    const savedStock = await this.stockRepo.save(stock);

    // Verificar alertas
    await this.checkAlerts(savedStock);

    return savedStock;
  }

  // ============================================
  // ATUALIZAR QUANTIDADE DO ESTOQUE
  // ============================================
  async updateQuantity(stockId: number, newQuantity: number): Promise<Stock> {
    const stock = await this.findOne(stockId);

    if (newQuantity < 0) {
      throw new BadRequestException('Quantidade não pode ser negativa');
    }

    stock.quantity = newQuantity;
    stock.total_value = newQuantity * parseFloat(stock.unit_cost.toString());

    const updatedStock = await this.stockRepo.save(stock);

    // Verificar alertas
    await this.checkAlerts(updatedStock);

    return updatedStock;
  }

  // ============================================
  // ADICIONAR QUANTIDADE (ENTRADA)
  // ============================================
  async addQuantity(stockId: number, quantity: number): Promise<Stock> {
    const stock = await this.findOne(stockId);
    const newQuantity = parseFloat(stock.quantity.toString()) + quantity;
    return this.updateQuantity(stockId, newQuantity);
  }

  // ============================================
  // SUBTRAIR QUANTIDADE (SAÍDA)
  // ============================================
  async subtractQuantity(stockId: number, quantity: number): Promise<Stock> {
    const stock = await this.findOne(stockId);
    const newQuantity = parseFloat(stock.quantity.toString()) - quantity;

    if (newQuantity < 0) {
      throw new BadRequestException('Estoque insuficiente');
    }

    return this.updateQuantity(stockId, newQuantity);
  }

  // ============================================
  // OBTER RESUMO DE ESTOQUE
  // ============================================
  async getStockSummary(ingredientId: number): Promise<StockSummary> {
    const stocks = await this.findByIngredient(ingredientId);

    if (stocks.length === 0) {
      const ingredient = await this.ingredientRepo.findOne({
        where: { id: ingredientId },
      });

      return {
        ingredient_id: ingredientId,
        ingredient_name: ingredient?.name || 'Desconhecido',
        total_quantity: 0,
        reserved_quantity: 0,
        available_quantity: 0,
        minimum_quantity: 0,
        maximum_quantity: 0,
        total_value: 0,
        needs_restock: true,
        has_expired_stock: false,
        near_expiry_count: 0,
      };
    }

    const totalQuantity = stocks.reduce(
      (sum, s) => sum + parseFloat(s.quantity.toString()),
      0,
    );

    const reservedQuantity = stocks.reduce(
      (sum, s) => sum + parseFloat(s.reserved_quantity.toString()),
      0,
    );

    const availableQuantity = totalQuantity - reservedQuantity;

    const totalValue = stocks.reduce(
      (sum, s) => sum + parseFloat(s.total_value.toString()),
      0,
    );

    const minQuantity = Math.min(
      ...stocks.map((s) => parseFloat(s.minimum_quantity.toString())),
    );

    const maxQuantity = Math.max(
      ...stocks.map((s) => parseFloat(s.maximum_quantity.toString())),
    );

    // Verificar vencimentos
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const hasExpired = stocks.some(
      (s) => s.expiry_date && new Date(s.expiry_date) < today,
    );

    const nearExpiryCount = stocks.filter(
      (s) =>
        s.expiry_date &&
        new Date(s.expiry_date) >= today &&
        new Date(s.expiry_date) <= sevenDaysFromNow,
    ).length;

    return {
      ingredient_id: ingredientId,
      ingredient_name: stocks[0].ingredient.name,
      total_quantity: totalQuantity,
      reserved_quantity: reservedQuantity,
      available_quantity: availableQuantity,
      minimum_quantity: minQuantity,
      maximum_quantity: maxQuantity,
      total_value: totalValue,
      needs_restock: availableQuantity <= minQuantity,
      has_expired_stock: hasExpired,
      near_expiry_count: nearExpiryCount,
    };
  }

  // ============================================
  // VERIFICAR E CRIAR ALERTAS
  // ============================================
  private async checkAlerts(stock: Stock): Promise<void> {
    const quantity = parseFloat(stock.quantity.toString());
    const minQuantity = parseFloat(stock.minimum_quantity.toString());
    const maxQuantity = parseFloat(stock.maximum_quantity.toString());

    // Alerta de estoque baixo
    if (quantity <= minQuantity && quantity > 0) {
      await this.createAlert({
        type: AlertType.LOW_STOCK,
        ingredient_id: stock.ingredient_id,
        stock_id: stock.id,
        title: `Estoque baixo`,
        message: `Estoque de ${stock.ingredient?.name || 'ingrediente'} está abaixo do mínimo`,
        current_quantity: quantity,
        threshold: minQuantity,
      });
    }

    // Alerta de estoque zerado
    if (quantity === 0) {
      await this.createAlert({
        type: AlertType.OUT_OF_STOCK,
        ingredient_id: stock.ingredient_id,
        stock_id: stock.id,
        title: `Estoque zerado`,
        message: `${stock.ingredient?.name || 'Ingrediente'} sem estoque`,
        current_quantity: 0,
        threshold: minQuantity,
      });
    }

    // Alerta de estoque alto
    if (quantity >= maxQuantity && maxQuantity > 0) {
      await this.createAlert({
        type: AlertType.OVERSTOCK,
        ingredient_id: stock.ingredient_id,
        stock_id: stock.id,
        title: `Estoque alto`,
        message: `Estoque de ${stock.ingredient?.name || 'ingrediente'} acima do máximo`,
        current_quantity: quantity,
        threshold: maxQuantity,
      });
    }

    // Alerta de vencimento
    if (stock.expiry_date) {
      const today = new Date();
      const expiryDate = new Date(stock.expiry_date);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Vencido
      if (daysUntilExpiry < 0) {
        await this.createAlert({
          type: AlertType.EXPIRED,
          ingredient_id: stock.ingredient_id,
          stock_id: stock.id,
          title: `Produto vencido`,
          message: `Lote ${stock.batch_number || ''} de ${stock.ingredient?.name || 'ingrediente'} está vencido`,
          current_quantity: quantity,
          threshold: null,
        });
      }

      // Próximo ao vencimento (7 dias)
      if (daysUntilExpiry >= 0 && daysUntilExpiry <= 7) {
        await this.createAlert({
          type: AlertType.NEAR_EXPIRY,
          ingredient_id: stock.ingredient_id,
          stock_id: stock.id,
          title: `Próximo ao vencimento`,
          message: `Lote ${stock.batch_number || ''} de ${stock.ingredient?.name || 'ingrediente'} vence em ${daysUntilExpiry} dias`,
          current_quantity: quantity,
          threshold: null,
        });
      }
    }
  }

  // ============================================
  // CRIAR ALERTA
  // ============================================
  private async createAlert(data: {
    type: AlertType;
    ingredient_id: number;
    stock_id?: number;
    title: string;
    message: string;
    current_quantity?: number;
    threshold?: number;
  }): Promise<void> {
    // Verificar se já existe alerta similar não resolvido
    const existing = await this.alertRepo.findOne({
      where: {
        type: data.type,
        ingredient_id: data.ingredient_id,
        stock_id: data.stock_id,
        is_resolved: false,
      },
    });

    if (existing) {
      return;
    }

    const alert = this.alertRepo.create({
      ...data,
      priority: this.getAlertPriority(data.type),
    });

    await this.alertRepo.save(alert);
  }

  // ============================================
  // DEFINIR PRIORIDADE DO ALERTA
  // ============================================
  private getAlertPriority(type: AlertType): string {
    switch (type) {
      case AlertType.EXPIRED:
      case AlertType.OUT_OF_STOCK:
        return 'critical';
      case AlertType.NEAR_EXPIRY:
      case AlertType.LOW_STOCK:
        return 'high';
      case AlertType.OVERSTOCK:
        return 'medium';
      default:
        return 'low';
    }
  }

  // ============================================
  // LISTAR ALERTAS ATIVOS
  // ============================================
  async getActiveAlerts(): Promise<StockAlert[]> {
    return this.alertRepo.find({
      where: { is_resolved: false },
      relations: ['ingredient', 'stock'],
      order: { created_at: 'DESC' },
    });
  }

  // ============================================
  // RESOLVER ALERTA
  // ============================================
  async resolveAlert(alertId: number, userId: number): Promise<StockAlert> {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });

    if (!alert) {
      throw new NotFoundException(`Alerta #${alertId} não encontrado`);
    }

    alert.is_resolved = true;
    alert.resolved_at = new Date();
    alert.resolved_by = userId;

    return this.alertRepo.save(alert);
  }
}
