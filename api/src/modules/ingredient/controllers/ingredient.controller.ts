// ============================================
// CONTROLLER: INGREDIENTES E ESTOQUE
// ============================================
// Endpoints REST para gestão de ingredientes
// e controle de estoque
// ============================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IngredientService } from '../services/ingredient.service';
import { StockService } from '../services/stock.service';
import { StockMovementService } from '../services/stock-movement.service';
import { CreateIngredientDto } from '../dtos/create-ingredient.dto';
import { UpdateIngredientDto } from '../dtos/update-ingredient.dto';
import { StockEntryDto } from '../dtos/stock-entry.dto';
import { StockExitDto } from '../dtos/stock-exit.dto';
import { StockAdjustmentDto } from '../dtos/stock-adjustment.dto';
import { IngredientStatus } from '../enums/ingredient-status.enum';
import { MovementType } from '../enums/movement-type.enum';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Ingredientes e Estoque')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ingredient')
export class IngredientController {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly stockService: StockService,
    private readonly movementService: StockMovementService,
  ) {}

  // ============================================
  // CRUD DE INGREDIENTES
  // ============================================

  // ============================================
  // POST /ingredient
  // Cadastra um novo ingrediente no sistema
  // Body: CreateIngredientDto
  // Retorna: Ingrediente criado com código interno único
  // ============================================
  @Post()
  @ApiOperation({ summary: 'Criar ingrediente' })
  async create(@Body() dto: CreateIngredientDto) {
    const ingredient = await this.ingredientService.create(dto);
    return {
      ok: true,
      message: 'Ingrediente cadastrado com sucesso',
      ingredient,
    };
  }

  // ============================================
  // GET /ingredient
  // Lista todos os ingredientes (não deletados)
  // Query Params (opcionais):
  //  - status: IngredientStatus (filtrar por status)
  //  - group: IngredientGroup (filtrar por grupo)
  //  - search: string (buscar por nome, código, EAN)
  // Retorna: Array de ingredientes
  // ============================================
  @Get()
  @ApiOperation({ summary: 'Listar ingredientes' })
  async findAll(
    @Query('status') status?: IngredientStatus,
    @Query('group') group?: string,
    @Query('search') search?: string,
  ) {
    const ingredients = await this.ingredientService.findAll({
      status,
      group,
      search,
    });
    return {
      ok: true,
      ingredients,
    };
  }

  // ============================================
  // GET /ingredient/active
  // Lista APENAS ingredientes ativos
  // Usado para seleção em receitas e pedidos
  // Retorna: Array de ingredientes ativos
  // ============================================
  @Get('active')
  @ApiOperation({ summary: 'Listar apenas ingredientes ativos' })
  async findActive() {
    const ingredients = await this.ingredientService.findActive();
    return {
      ok: true,
      ingredients,
    };
  }

  // ============================================
  // CONTROLE DE ESTOQUE
  // ============================================

  // ============================================
  // POST /ingredient/stock/entry
  // Registra entrada de mercadoria (compra)
  // Body: StockEntryDto
  // Cria lote de estoque e registra movimentação
  // Retorna: Movimentação criada
  // ============================================
  @Post('stock/entry')
  @ApiOperation({ summary: 'Entrada de estoque (compra)' })
  async stockEntry(@Body() dto: StockEntryDto, @Request() req) {
    const userId = req.user?.id || 1; // ID do usuário logado
    const movement = await this.movementService.entry(dto, userId);
    return {
      ok: true,
      message: 'Entrada de estoque registrada com sucesso',
      movement,
    };
  }

  // ============================================
  // POST /ingredient/stock/exit
  // Registra saída de mercadoria (consumo/venda)
  // Body: StockExitDto
  // Usa FIFO (primeiro a vencer) se não especificar lote
  // Retorna: Movimentação criada
  // ============================================
  @Post('stock/exit')
  @ApiOperation({ summary: 'Saída de estoque (consumo/venda)' })
  async stockExit(@Body() dto: StockExitDto, @Request() req) {
    const userId = req.user?.id || 1;
    const movement = await this.movementService.exit(dto, userId);
    return {
      ok: true,
      message: 'Saída de estoque registrada com sucesso',
      movement,
    };
  }

  // ============================================
  // POST /ingredient/stock/adjustment
  // Ajusta estoque (inventário/correção)
  // Body: StockAdjustmentDto
  // Corrige divergências entre físico e sistema
  // Retorna: Movimentação criada
  // ============================================
  @Post('stock/adjustment')
  @ApiOperation({ summary: 'Ajuste de estoque (inventário)' })
  async stockAdjustment(@Body() dto: StockAdjustmentDto, @Request() req) {
    const userId = req.user?.id || 1;
    const movement = await this.movementService.adjustment(dto, userId);
    return {
      ok: true,
      message: 'Ajuste de estoque registrado com sucesso',
      movement,
    };
  }

  // ============================================
  // GET /ingredient/stock/summary/:ingredientId
  // Retorna resumo completo do estoque de um ingrediente
  // Params: ingredientId (ID do ingrediente)
  // Retorna: StockSummary (quantidade total, disponível,
  //          alertas, vencimentos, etc)
  // ============================================
  @Get('stock/summary/:ingredientId')
  @ApiOperation({ summary: 'Resumo de estoque do ingrediente' })
  async getStockSummary(@Param('ingredientId') ingredientId: number) {
    const summary = await this.stockService.getStockSummary(ingredientId);
    return {
      ok: true,
      summary,
    };
  }

  // ============================================
  // GET /ingredient/stock/:ingredientId
  // Lista todos os lotes de estoque de um ingrediente
  // Params: ingredientId (ID do ingrediente)
  // Ordenado por FIFO (primeiro a vencer)
  // Retorna: Array de lotes (Stock[])
  // ============================================
  @Get('stock/:ingredientId')
  @ApiOperation({ summary: 'Listar lotes de estoque' })
  async getStockByIngredient(@Param('ingredientId') ingredientId: number) {
    const stocks = await this.stockService.findByIngredient(ingredientId);
    return {
      ok: true,
      stocks,
    };
  }

  // ============================================
  // MOVIMENTAÇÕES
  // ============================================
  // GET /ingredient/movements
  // Lista todas as movimentações de estoque
  // Query Params (opcionais):
  //  - ingredient_id: number (filtrar por ingrediente)
  //  - type: MovementType (filtrar por tipo)
  //  - start_date: Date (data inicial)
  //  - end_date: Date (data final)
  // Retorna: Array de movimentações
  // ============================================
  @Get('movements')
  @ApiOperation({ summary: 'Listar movimentações de estoque' })
  async findAllMovements(
    @Query('ingredient_id') ingredientId?: number,
    @Query('type') type?: MovementType,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    const movements = await this.movementService.findAll({
      ingredient_id: ingredientId,
      type,
      start_date: startDate ? new Date(startDate) : undefined,
      end_date: endDate ? new Date(endDate) : undefined,
    });
    return {
      ok: true,
      movements,
    };
  }

  // ============================================
  // GET /ingredient/movement/:id
  // Busca uma movimentação específica
  // Params: id (ID da movimentação)
  // Retorna: Movimentação com todas as relações
  // ============================================
  @Get('movement/:id')
  @ApiOperation({ summary: 'Buscar movimentação por ID' })
  async findOneMovement(@Param('id') id: number) {
    const movement = await this.movementService.findOne(id);
    return {
      ok: true,
      movement,
    };
  }

  // ============================================
  // ALERTAS
  // ============================================
  // GET /ingredient/alerts
  // Lista todos os alertas ativos
  // (estoque baixo, vencimentos, etc)
  // Retorna: Array de alertas não resolvidos
  // ============================================
  @Get('alerts')
  @ApiOperation({ summary: 'Listar alertas ativos' })
  async getAlerts() {
    const alerts = await this.stockService.getActiveAlerts();
    return {
      ok: true,
      alerts,
    };
  }

  // ============================================
  // PUT /ingredient/alert/:id/resolve
  // Marca um alerta como resolvido
  // Params: id (ID do alerta)
  // Retorna: Alerta atualizado
  // ============================================
  @Put('alert/:id/resolve')
  @ApiOperation({ summary: 'Resolver alerta' })
  async resolveAlert(@Param('id') id: number, @Request() req) {
    const userId = req.user?.id || 1;
    const alert = await this.stockService.resolveAlert(id, userId);
    return {
      ok: true,
      message: 'Alerta resolvido',
      alert,
    };
  }

  // ============================================
  // ROTAS COM PARÂMETRO :id
  // ============================================
  // GET /ingredient/:id
  // Busca um ingrediente específico por ID
  // Params: id (ID do ingrediente)
  // Retorna: Ingrediente com estoque e categoria
  // ============================================
  @Get(':id')
  @ApiOperation({ summary: 'Buscar ingrediente por ID' })
  async findOne(@Param('id') id: number) {
    const ingredient = await this.ingredientService.findOne(id);
    return {
      ok: true,
      ingredient,
    };
  }

  // ============================================
  // PUT /ingredient/:id
  // Atualiza dados de um ingrediente
  // Params: id (ID do ingrediente)
  // Body: UpdateIngredientDto (campos opcionais)
  // Retorna: Ingrediente atualizado
  // ============================================
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar ingrediente' })
  async update(@Param('id') id: number, @Body() dto: UpdateIngredientDto) {
    const ingredient = await this.ingredientService.update(id, dto);
    return {
      ok: true,
      message: 'Ingrediente atualizado com sucesso',
      ingredient,
    };
  }

  // ============================================
  // DELETE /ingredient/:id
  // Deleta um ingrediente (soft delete)
  // Params: id (ID do ingrediente)
  // Valida se não tem estoque antes de deletar
  // Não retorna conteúdo (204 No Content)
  // ============================================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar ingrediente (soft delete)' })
  async remove(@Param('id') id: number) {
    await this.ingredientService.remove(id);
  }

  // ============================================
  // PUT /ingredient/:id/status
  // Altera o status de um ingrediente
  // Params: id (ID do ingrediente)
  // Body: { status: IngredientStatus }
  // Retorna: Ingrediente com status atualizado
  // ============================================
  @Put(':id/status')
  @ApiOperation({ summary: 'Alterar status do ingrediente' })
  async changeStatus(
    @Param('id') id: number,
    @Body('status') status: IngredientStatus,
  ) {
    const ingredient = await this.ingredientService.changeStatus(id, status);
    return {
      ok: true,
      message: 'Status atualizado com sucesso',
      ingredient,
    };
  }
}
