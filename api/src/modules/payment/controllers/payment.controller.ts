// ============================================
// CONTROLLER: PAGAMENTOS
// ============================================
// Endpoints de pagamento e geração de QR Code PIX
// ============================================

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { JwtCustomerAuthGuard } from '@/common/guards/jwt-customer-auth.guard';
import { Order } from '@/modules/order/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPaymentService } from '../services/find-one-payment.service';

// ============================================
// INTERFACE: REQUEST COM USUÁRIO AUTENTICADO
// ============================================
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    sub: string;
  };
}

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly queryPaymentService: QueryPaymentService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // ============================================
  // FUNÇÃO PRIVADA: Gerar QR Code Base64
  // ============================================
  // Converte código PIX em imagem QR Code base64
  private async generateQrCodeBase64(pixCode: string): Promise<string> {
    try {
      const QRCode = require('qrcode');
      const base64 = await QRCode.toDataURL(pixCode);
      // Remove o prefixo 'data:image/png;base64,' para retornar apenas o base64
      return base64.replace('data:image/png;base64,', '');
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      // Retorna placeholder em caso de erro
      return 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAA';
    }
  }

  // ============================================
  // ENDPOINT: GERAR QR CODE PIX
  // ============================================
  // POST /payment/pix
  //
  // AUTENTICAÇÃO: Requer JWT do cliente
  // REQUEST BODY: {
  //   orderId: number,
  //   amount: number (em centavos),
  //   email: string
  // }
  //
  // RESPONSE: {
  //   ok: boolean,
  //   message: string,
  //   pix: {
  //     qr_code: string (código copiável),
  //     qr_code_base64: string (imagem),
  //     payment_id: string,
  //     ticket_url: string,
  //     status: string
  //   }
  // }
  //
  // FLUXO:
  // 1. Cliente seleciona PIX e confirma pedido
  // 2. Frontend chama este endpoint com ID do pedido
  // 3. Gera QR Code no MercadoPago
  // 4. Retorna QR Code em 2 formatos (código + imagem base64)
  // 5. Cliente escaneia ou copia o código
  // 6. Webhook confirma pagamento automaticamente
  // ============================================
  @Post('pix')
  @UseGuards(JwtCustomerAuthGuard)
  async generatePixQrCode(
    @Body() data: { orderId: number; amount: number; email: string },
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      // ============================================
      // VALIDAÇÃO: Dados obrigatórios
      // ============================================
      if (!data.orderId || !data.amount || !data.email) {
        return {
          ok: false,
          message:
            'Dados incompletos: orderId, amount e email são obrigatórios',
        };
      }

      // ============================================
      // VALIDAÇÃO: Pedido existe e pertence ao usuário
      // ============================================
      const order = await this.orderRepository.findOne({
        where: {
          id: data.orderId,
          common_user_id: parseInt(req.user.id, 10),
        },
      });

      if (!order) {
        return {
          ok: false,
          message: 'Pedido não encontrado ou não pertence a você',
        };
      }

      // ============================================
      // GERAR CÓDIGO PIX (simulado)
      // ============================================
      // Em produção, viria do Mercado Pago
      const pixCode =
        '00020126580014br.gov.bcb.brcode0136123e4567-e12b-12d1-a456-426655440000520400005303986540510.005802BR5913Fulano de Tal6009BRASILIA62410503***63047B6D';

      // ============================================
      // GERAR QR CODE BASE64
      // ============================================
      const qrCodeBase64 = await this.generateQrCodeBase64(pixCode);

      // ============================================
      // CRIAR PAGAMENTO NO BANCO DE DADOS
      // ============================================
      // Quando salva pagamento:
      const payment = this.paymentRepository.create({
        common_user_id: Number(req.user.id),
        order_id: data.orderId,
        value: data.amount,
        status: 'pending',
        mercadopago_id: `pix_${data.orderId}_${Date.now()}`,
        pix_code: pixCode,
        pix_qr_code: qrCodeBase64,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // ============================================
      // RESPOSTA COM DADOS DO PIX
      // ============================================
      return {
        ok: true,
        message: 'QR Code PIX gerado com sucesso',
        pix: {
          qr_code: pixCode,
          qr_code_base64: qrCodeBase64,
          payment_id: savedPayment.id,
          ticket_url: 'https://www.mercadopago.com.br',
          status: 'pending',
        },
      };
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      return {
        ok: false,
        message: 'Erro ao gerar QR Code PIX',
        error: error.message,
      };
    }
  }

  @Get('/find-one/:paymentId')
  async findOne(@Param('paymentId') paymentId: string) {
    try {
      const payment = await this.queryPaymentService.findOne({
        where: [{ id: paymentId }],
        relations: ['commonUser'],
      });

      if (!payment) {
        return {
          ok: false,
          message: 'Pagamento não encontrado',
          payment: null,
        };
      }

      return {
        ok: true,
        payment,
      };
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      return {
        ok: false,
        message: 'Erro ao buscar pagamento',
        error: error.message,
      };
    }
  }

  // ============================================
  // ENDPOINT: LISTAR PAGAMENTOS
  // ============================================
  // GET /payment/list
  @Get('/list')
  async listPayments() {
    const result = await this.queryPaymentService.list({
      page: 1,
      per_page: 10,
      relations: ['commonUser'],
    });

    return {
      ok: true,
      ...result,
    };
  }
}
