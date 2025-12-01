// ============================================
// CONTROLLER: COMPROVANTES
// Endpoints de comprovantes
// ============================================

import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ReceiptService } from '../services/receipt.service';
import { JwtFlexibleAuthGuard } from '@/common/guards/jwt-flexible-auth.guard';
import { EmailService } from '@/modules/notification/services/email.service';

@Controller('receipt')
@UseGuards(JwtFlexibleAuthGuard)
export class ReceiptController {
  constructor(
    private readonly receiptService: ReceiptService,
    private readonly emailService: EmailService,
  ) {}

  // ============================================
  // GET /receipt/order/:orderId
  // Buscar comprovante por ID do pedido
  // ============================================
  @Get('order/:orderId')
  async getByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    const receipt = await this.receiptService.findByOrder(orderId);

    return {
      ok: true,
      receipt: {
        id: receipt.id,
        receipt_number: receipt.receipt_number,
        customer_name: receipt.customer_name,
        total: receipt.total,
        payment_method: receipt.payment_method,
        issue_date: receipt.issue_date,
        created_at: receipt.created_at,
      },
    };
  }

  // ============================================
  // GET /receipt/order/:orderId/pdf
  // Baixar PDF do comprovante
  // ============================================
  @Get('order/:orderId/pdf')
  async getReceiptPdf(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    try {
      const receipt = await this.receiptService.findByOrder(orderId);
      const pdfBuffer = await this.receiptService.generatePDF(receipt.id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="comprovante-${receipt.receipt_number}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }

  // ============================================
  // GET /receipt/number/:receiptNumber
  // Buscar por número do comprovante
  // ============================================
  @Get('number/:receiptNumber')
  async getByReceiptNumber(@Param('receiptNumber') receiptNumber: string) {
    const receipt = await this.receiptService.findByNumber(receiptNumber);

    return {
      ok: true,
      receipt: {
        id: receipt.id,
        receipt_number: receipt.receipt_number,
        customer_name: receipt.customer_name,
        total: receipt.total,
        payment_method: receipt.payment_method,
        created_at: receipt.created_at,
      },
    };
  }

  // ============================================
  // GET /receipt/reissue/:orderId
  // Reemitir comprovante
  // ============================================
  @Get('reissue/:orderId')
  async reissue(@Param('orderId', ParseIntPipe) orderId: number) {
    const receipt = await this.receiptService.reissue(orderId);

    return {
      ok: true,
      message: 'Comprovante reemitido com sucesso',
      receipt: {
        receipt_number: receipt.receipt_number,
        total: receipt.total,
      },
    };
  }

  // ============================================
  // GET /receipt/test/pdf-email/:orderId
  // Teste: gerar PDF e enviar por email
  // ============================================
  @Get('test/pdf-email/:orderId')
  async testPDFEmail(@Param('orderId', ParseIntPipe) orderId: number) {
    try {
      const receipt = await this.receiptService.findByOrder(orderId);

      // Gerar o PDF do comprovante
      const pdfBuffer = await this.receiptService.generatePDF(receipt.id);

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Comprovante de Pedido #${receipt.receipt_number}</h2>
          <p>Olá <strong>${receipt.customer_name}</strong>,</p>
          <p>Segue em anexo o comprovante referente ao seu pedido.</p>
          <ul>
            <li><strong>Número do comprovante:</strong> ${receipt.receipt_number}</li>
            <li><strong>Valor total:</strong> R$ ${Number(receipt.total).toFixed(2)}</li>
            <li><strong>Método de pagamento:</strong> ${receipt.payment_method}</li>
            <li><strong>Emitido em:</strong> ${receipt.issue_date ?? receipt.created_at}</li>
          </ul>
          <p>Obrigado pela preferência! — Pizzaria Massa Nostra</p>
        </div>
      `;

      await this.emailService.sendReceiptEmail(
        receipt.customer_email,
        receipt.receipt_number,
        htmlContent,
        pdfBuffer,
      );

      return {
        ok: true,
        message: 'PDF gerado e email enviado com sucesso!',
        receipt_number: receipt.receipt_number,
        sent_to: receipt.customer_email,
      };
    } catch (error) {
      console.error('Erro ao gerar PDF e enviar email:', error);
      throw error;
    }
  }
}
