// ============================================
// CONTROLLER: FORNECEDORES
// ============================================
// Endpoints REST para gestão de fornecedores
// Cotações, Pedidos de Compra e Avaliações
// Apenas ADMIN tem acesso (JwtAuthGuard)
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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupplierService } from '../services/supplier.service';
import { SupplierQuoteService } from '../services/supplier-quote.service';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { CreateSupplierDto } from '../dtos/create-supplier.dto';
import { UpdateSupplierDto } from '../dtos/update-supplier.dto';
import { CreateQuoteDto } from '../dtos/create-quote.dto';
import { CreatePurchaseOrderDto } from '../dtos/create-purchase-order.dto';
import { SupplierStatus } from '../enums/supplier-status.enum';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

// ============================================
// DECORADORES DO CONTROLLER
// ============================================
@ApiTags('Fornecedores') // Agrupa endpoints no Swagger
@ApiBearerAuth() // Exige token JWT em todas as rotas
@UseGuards(JwtAuthGuard) // Protege todas as rotas com autenticação
@Controller('supplier')
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly quoteService: SupplierQuoteService,
    private readonly purchaseOrderService: PurchaseOrderService,
  ) {}

  // ============================================
  // CRUD DE FORNECEDORES
  // ============================================

  // ============================================
  // POST /supplier
  // Cadastra um novo fornecedor no sistema
  // Body: CreateSupplierDto (razão social, CNPJ, endereço...)
  // Retorna: Fornecedor criado com status 'pre_registered'
  // ============================================
  @Post()
  @ApiOperation({ summary: 'Criar fornecedor' })
  async create(@Body() dto: CreateSupplierDto) {
    const supplier = await this.supplierService.create(dto);
    return {
      ok: true,
      message: 'Fornecedor cadastrado com sucesso',
      supplier,
    };
  }

  // ============================================
  // GET /supplier
  // Lista todos os fornecedores (não deletados)
  // Query Params:
  //  - status: SupplierStatus (filtrar por status)
  //  - cidade: string (filtrar por cidade)
  //  - estado: string (filtrar por UF)
  // Retorna: Array de fornecedores
  // ============================================
  @Get()
  @ApiOperation({ summary: 'Listar fornecedores' })
  async findAll(
    @Query('status') status?: SupplierStatus,
    @Query('cidade') cidade?: string,
    @Query('estado') estado?: string,
  ) {
    const suppliers = await this.supplierService.findAll({
      status,
      cidade,
      estado,
    });
    return {
      ok: true,
      suppliers,
    };
  }

  // ============================================
  // GET /supplier/active
  // Lista APENAS fornecedores com status 'active'
  // Usado para selecionar fornecedores em cotações
  // Retorna: Array de fornecedores ativos
  // ============================================
  @Get('active')
  @ApiOperation({ summary: 'Listar apenas fornecedores ativos' })
  async findActive() {
    const suppliers = await this.supplierService.findActive();
    return {
      ok: true,
      suppliers,
    };
  }

  // ============================================
  // COTAÇÕES (QUOTES)
  // ============================================
  // ============================================
  // POST /supplier/quote
  // Cria uma nova cotação para um fornecedor
  // Body: CreateQuoteDto (supplier_id, itens, prazo...)
  // Gera número único: COT-YYYYMMDD-XXX
  // Status inicial: 'pending'
  // Retorna: Cotação criada
  // ============================================
  @Post('quote')
  @ApiOperation({ summary: 'Criar cotação para fornecedor' })
  async createQuote(@Body() dto: CreateQuoteDto) {
    const quote = await this.quoteService.create(dto);
    return {
      ok: true,
      message: 'Cotação criada com sucesso',
      quote,
    };
  }

  // ============================================
  // GET /supplier/quotes (PLURAL)
  // Lista todas as cotações
  // Query Params:
  //  - supplier_id: number (filtrar por fornecedor)
  // Retorna: Array de cotações
  // ROTA EM PLURAL para evitar conflito com /:id
  // ============================================
  @Get('quotes')
  @ApiOperation({ summary: 'Listar cotações' })
  async findAllQuotes(@Query('supplier_id') supplierId?: number) {
    const quotes = await this.quoteService.findAll({ supplier_id: supplierId });
    return {
      ok: true,
      quotes,
    };
  }

  // ============================================
  // GET /supplier/quote/:id
  // Busca uma cotação específica por ID
  // Params: id (ID da cotação)
  // Retorna: Cotação com dados do fornecedor
  // ============================================
  @Get('quote/:id')
  @ApiOperation({ summary: 'Buscar cotação por ID' })
  async findOneQuote(@Param('id') id: number) {
    const quote = await this.quoteService.findOne(id);
    return {
      ok: true,
      quote,
    };
  }

  // ============================================
  // PUT /supplier/quote/:id/approve
  // Aprova uma cotação (muda status para 'approved')
  // Params: id (ID da cotação)
  // Retorna: Cotação aprovada
  // ============================================
  @Put('quote/:id/approve')
  @ApiOperation({ summary: 'Aprovar cotação' })
  async approveQuote(@Param('id') id: number) {
    const quote = await this.quoteService.approve(id);
    return {
      ok: true,
      message: 'Cotação aprovada',
      quote,
    };
  }

  // ============================================
  // PUT /supplier/quote/:id
  // Atualiza uma cotação (fornecedor responde)
  // Params: id (ID da cotação)
  // Body:
  //  - total_value: number (valor total da proposta)
  //  - delivery_days: number (prazo de entrega)
  //  - payment_days: number (prazo de pagamento)
  //  - notes: string (observações)
  // Status muda para 'received' automaticamente
  // Retorna: Cotação atualizada
  // ============================================
  @Put('quote/:id')
  @ApiOperation({ summary: 'Atualizar cotação (fornecedor responde)' })
  async updateQuote(
    @Param('id') id: number,
    @Body('total_value') totalValue?: number,
    @Body('delivery_days') deliveryDays?: number,
    @Body('payment_days') paymentDays?: number,
    @Body('notes') notes?: string,
  ) {
    const quote = await this.quoteService.update(id, {
      total_value: totalValue,
      delivery_days: deliveryDays,
      payment_days: paymentDays,
      notes,
    });
    return {
      ok: true,
      message: 'Cotação atualizada com sucesso',
      quote,
    };
  }

  // ============================================
  // PUT /supplier/quote/:id/cancel
  // Cancela uma cotação (muda status para 'cancelled')
  // Params: id (ID da cotação)
  // Body:
  //  - reason: string (motivo do cancelamento)
  // Retorna: Cotação cancelada
  // ============================================
  @Put('quote/:id/cancel')
  @ApiOperation({ summary: 'Cancelar cotação' })
  async cancelQuote(@Param('id') id: number, @Body('reason') reason?: string) {
    const quote = await this.quoteService.cancel(id, reason);
    return {
      ok: true,
      message: 'Cotação cancelada',
      quote,
    };
  }

  // ============================================
  // PEDIDOS DE COMPRA (PURCHASE ORDERS)
  // ============================================
  // POST /supplier/purchase-order
  // Cria um novo pedido de compra
  // Body: CreatePurchaseOrderDto
  // Gera número único: PO-YYYYMMDD-XXX
  // Status inicial: 'draft'
  // Retorna: Pedido criado
  // ============================================
  @Post('purchase-order')
  @ApiOperation({ summary: 'Criar pedido de compra' })
  async createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) {
    const order = await this.purchaseOrderService.create(dto);
    return {
      ok: true,
      message: 'Pedido de compra criado com sucesso',
      order,
    };
  }

  // ============================================
  // GET /supplier/purchase-order
  // Lista todos os pedidos de compra
  // Query Params:
  //  - supplier_id: number (filtrar por fornecedor)
  // Retorna: Array de pedidos
  // ============================================
  @Get('purchase-order')
  @ApiOperation({ summary: 'Listar pedidos de compra' })
  async findAllPurchaseOrders(@Query('supplier_id') supplierId?: number) {
    const orders = await this.purchaseOrderService.findAll({
      supplier_id: supplierId,
    });
    return {
      ok: true,
      orders,
    };
  }

  // ============================================
  // GET /supplier/purchase-order/:id
  // Busca um pedido de compra específico
  // Params: id (ID do pedido)
  // Retorna: Pedido com dados do fornecedor
  // ============================================
  @Get('purchase-order/:id')
  @ApiOperation({ summary: 'Buscar pedido de compra por ID' })
  async findOnePurchaseOrder(@Param('id') id: number) {
    const order = await this.purchaseOrderService.findOne(id);
    return {
      ok: true,
      order,
    };
  }

  // ============================================
  // PUT /supplier/purchase-order/:id/approve
  // Aprova um pedido de compra
  // Params: id (ID do pedido)
  // Body:
  //  - admin_id: number (ID do admin que aprovou)
  // Status: draft/pending_approval → approved
  // Retorna: Pedido aprovado
  // ============================================
  @Put('purchase-order/:id/approve')
  @ApiOperation({ summary: 'Aprovar pedido de compra' })
  async approvePurchaseOrder(
    @Param('id') id: number,
    @Body('admin_id') adminId: number,
  ) {
    const order = await this.purchaseOrderService.approve(id, adminId);
    return {
      ok: true,
      message: 'Pedido aprovado',
      order,
    };
  }

  // ============================================
  // PUT /supplier/purchase-order/:id/confirm
  // Confirma recebimento do pedido (fornecedor)
  // Params: id (ID do pedido)
  // Status: approved → confirmed
  // Retorna: Pedido confirmado
  // ============================================
  @Put('purchase-order/:id/confirm')
  @ApiOperation({ summary: 'Confirmar pedido de compra (fornecedor)' })
  async confirmPurchaseOrder(@Param('id') id: number) {
    const order = await this.purchaseOrderService.confirm(id);
    return {
      ok: true,
      message: 'Pedido confirmado',
      order,
    };
  }

  // ============================================
  // PUT /supplier/purchase-order/:id/in-transit
  // Marca pedido como em trânsito (a caminho)
  // Params: id (ID do pedido)
  // Status: confirmed → in_transit
  // Retorna: Pedido em trânsito
  // ============================================
  @Put('purchase-order/:id/in-transit')
  @ApiOperation({ summary: 'Marcar pedido em trânsito' })
  async markInTransit(@Param('id') id: number) {
    const order = await this.purchaseOrderService.markInTransit(id);
    return {
      ok: true,
      message: 'Pedido em trânsito',
      order,
    };
  }

  // ============================================
  // PUT /supplier/purchase-order/:id/delivered
  // Marca pedido como entregue
  // Params: id (ID do pedido)
  // Body:
  //  - delivery_date: Date (data real da entrega)
  // Status: in_transit → delivered
  // Retorna: Pedido entregue
  // ============================================
  @Put('purchase-order/:id/delivered')
  @ApiOperation({ summary: 'Marcar pedido como entregue' })
  async markDelivered(
    @Param('id') id: number,
    @Body('delivery_date') deliveryDate: Date,
  ) {
    const order = await this.purchaseOrderService.markDelivered(
      id,
      deliveryDate,
    );
    return {
      ok: true,
      message: 'Pedido marcado como entregue',
      order,
    };
  }

  // ============================================
  // PUT /supplier/purchase-order/:id/received
  // Marca pedido como recebido (conferido)
  // Params: id (ID do pedido)
  // Status: delivered → received
  // Pré-requisito para registrar nota fiscal
  // Retorna: Pedido recebido
  // ============================================
  @Put('purchase-order/:id/received')
  @ApiOperation({ summary: 'Marcar pedido como recebido (conferido)' })
  async markReceived(@Param('id') id: number) {
    const order = await this.purchaseOrderService.markReceived(id);
    return {
      ok: true,
      message: 'Pedido marcado como recebido',
      order,
    };
  }

  // ============================================
  // PUT /supplier/purchase-order/:id/invoice
  // Registra nota fiscal do pedido
  // Params: id (ID do pedido)
  // Body:
  //  - nfe_number: string (número da NF-e)
  //  - nfe_xml_url: string (URL do XML da NF)
  // Status: received → completed
  // Finaliza o pedido
  // Retorna: Pedido com NF registrada
  // ============================================
  @Put('purchase-order/:id/invoice')
  @ApiOperation({ summary: 'Registrar nota fiscal' })
  async registerInvoice(
    @Param('id') id: number,
    @Body('nfe_number') nfeNumber: string,
    @Body('nfe_xml_url') nfeXmlUrl?: string,
  ) {
    const order = await this.purchaseOrderService.registerInvoice(
      id,
      nfeNumber,
      nfeXmlUrl,
    );
    return {
      ok: true,
      message: 'Nota fiscal registrada',
      order,
    };
  }

  // ============================================
  // ROTAS COM PARÂMETRO :id
  // ============================================
  // para não capturar rotas específicas como
  // /active, /quotes, /purchase-order, etc
  // ============================================
  // GET /supplier/:id
  // Busca um fornecedor específico por ID
  // Params: id (ID do fornecedor)
  // Retorna: Fornecedor com cotações, pedidos e avaliações
  // ============================================
  @Get(':id')
  @ApiOperation({ summary: 'Buscar fornecedor por ID' })
  async findOne(@Param('id') id: number) {
    const supplier = await this.supplierService.findOne(id);
    return {
      ok: true,
      supplier,
    };
  }

  // ============================================
  // PUT /supplier/:id
  // Atualiza dados de um fornecedor
  // Params: id (ID do fornecedor)
  // Body: UpdateSupplierDto (campos opcionais)
  // Valida CNPJ duplicado se for alterado
  // Retorna: Fornecedor atualizado
  // ============================================
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar fornecedor' })
  async update(@Param('id') id: number, @Body() dto: UpdateSupplierDto) {
    const supplier = await this.supplierService.update(id, dto);
    return {
      ok: true,
      message: 'Fornecedor atualizado com sucesso',
      supplier,
    };
  }

  // ============================================
  // DELETE /supplier/:id
  // Deleta um fornecedor (soft delete)
  // Params: id (ID do fornecedor)
  // Marca deleted_at = NOW()
  // Não retorna conteúdo (204 No Content)
  // ============================================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar fornecedor (soft delete)' })
  async remove(@Param('id') id: number) {
    await this.supplierService.remove(id);
  }

  // ============================================
  // PUT /supplier/:id/status
  // Altera o status de um fornecedor
  // Params: id (ID do fornecedor)
  // Body:
  //  - status: SupplierStatus
  // Fluxo: pre_registered → under_review → active
  // Valida transições (ex: rejected não pode ir para active)
  // Retorna: Fornecedor com status atualizado
  // ============================================
  @Put(':id/status')
  @ApiOperation({ summary: 'Alterar status do fornecedor' })
  async changeStatus(
    @Param('id') id: number,
    @Body('status') status: SupplierStatus,
  ) {
    const supplier = await this.supplierService.changeStatus(id, status);
    return {
      ok: true,
      message: 'Status atualizado com sucesso',
      supplier,
    };
  }
}
