// ============================================
// SERVIÇO: COMPROVANTES
// ============================================
// Geração de comprovantes de compra em PDF
// Cria snapshot do pedido e gera PDF formatado
// COM ENVIO AUTOMÁTICO POR E-MAIL
// ============================================

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../entities/receipt.entity';

// Usar path relativo
import { Order } from '../../order/entities/order.entity';

// Usar paths relativos para serviços de e-mail
import { EmailService } from '../../notification/services/email.service';
import {
  generateReceiptEmailHTML,
  ReceiptEmailData,
} from '../../notification/templates/receipt-email.template';

const PDFDocument = require('pdfkit');

@Injectable()
export class ReceiptService {
  // Logger para rastreamento
  private readonly logger = new Logger(ReceiptService.name);

  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    // Injetar EmailService
    private readonly emailService: EmailService,
  ) {}

  // ============================================
  // GERAR COMPROVANTE APÓS PAGAMENTO
  // ============================================
  // Cria um novo comprovante com snapshot do pedido
  // Se já existir, retorna o existente
  // Envia e-mail automaticamente
  // ============================================
  async generateReceipt(
    orderId: number,
    sendEmail: boolean = true, // Parâmetro para controlar envio
  ): Promise<Receipt> {
    this.logger.log(`Gerando comprovante para pedido #${orderId}`);

    // Buscar pedido completo com todas as relações necessárias
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: [
        'user', // Dados do cliente
        'address', // Endereço de entrega
        'items', // Itens do pedido
        'items.product', // Produto de cada item
        'items.variant', // Variação (tamanho) de cada item
        'items.crust', // Borda
        'items.filling', // Recheio
      ],
    });

    // Validar se pedido existe
    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} não encontrado`);
    }

    // Verificar se já existe comprovante para este pedido
    let receipt = await this.receiptRepo.findOne({
      where: { order_id: orderId },
    });

    // Se já existe e não foi enviado por e-mail, enviar agora
    if (receipt) {
      this.logger.warn(`Comprovante já existe para pedido #${orderId}`);

      // Se deve enviar e-mail e ainda não foi enviado
      if (sendEmail && !receipt.was_emailed && order.user?.email) {
        await this.sendReceiptEmail(receipt, order);
      }

      return receipt;
    }

    // Gerar número único do comprovante
    const receiptNumber = await this.generateReceiptNumber();

    // Criar objeto comprovante com snapshot do pedido
    receipt = this.receiptRepo.create({
      // Relacionamento
      order_id: orderId,

      // Número único
      receipt_number: receiptNumber,

      // Dados do cliente (snapshot)
      customer_name: order.user.name,
      customer_cpf: order.user.cpf || null,
      customer_email: order.user.email || null,

      // Itens em formato JSON
      items_json: JSON.stringify(
        order.items.map((item) => ({
          product_name: item.product.name,
          variant_name: item.variant?.size || item.variant?.label || 'Padrão',
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          total_price: Number(item.subtotal),
        })),
      ),

      // Valores do pedido
      subtotal: Number(order.subtotal),
      delivery_fee: Number(order.delivery_fee),
      discount: Number(order.discount),
      total: Number(order.total),

      // Forma de pagamento
      payment_method: order.payment_method,

      // Data de emissão
      issue_date: new Date(),

      // Campos de controle de e-mail
      was_emailed: false,
      emailed_at: null,
    });

    // Salvar no banco de dados
    receipt = await this.receiptRepo.save(receipt);

    this.logger.log(`Comprovante ${receiptNumber} gerado com sucesso`);

    // Enviar e-mail se solicitado
    if (sendEmail && order.user?.email) {
      await this.sendReceiptEmail(receipt, order);
    } else if (sendEmail && !order.user?.email) {
      this.logger.warn(`Cliente sem e-mail - Comprovante não enviado`);
    }

    return receipt;
  }

  // ============================================
  // ENVIAR COMPROVANTE POR E-MAIL
  // ============================================
  // Envia o comprovante em PDF por e-mail
  // Usa o template HTML formatado
  // Marca o comprovante como enviado
  // ============================================
  private async sendReceiptEmail(
    receipt: Receipt,
    order: any,
  ): Promise<boolean> {
    try {
      const customerEmail = receipt.customer_email || order.user?.email;

      // Validar e-mail
      if (!customerEmail) {
        this.logger.warn('Cliente sem e-mail cadastrado');
        return false;
      }

      this.logger.log(`Enviando comprovante para ${customerEmail}`);

      // Gerar PDF do comprovante
      const pdfBuffer = await this.generatePDF(receipt.id);

      // Preparar dados para o template de e-mail
      const emailData: ReceiptEmailData = {
        customerName: receipt.customer_name,
        orderNumber: `#${order.id}`,
        orderDate: new Date(receipt.issue_date).toLocaleString('pt-BR'),
        items: JSON.parse(receipt.items_json).map((item: any) => ({
          name: `${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''}`,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          totalPrice: item.total_price,
        })),
        subtotal: parseFloat(receipt.subtotal.toString()),
        deliveryFee: parseFloat(receipt.delivery_fee.toString()),
        discount: parseFloat(receipt.discount.toString()),
        total: parseFloat(receipt.total.toString()),
        paymentMethod: receipt.payment_method,
        deliveryToken: order.delivery_token || '',
        address: order.address ? this.formatAddress(order.address) : undefined,
      };

      // Gerar HTML formatado do e-mail
      const htmlContent = generateReceiptEmailHTML(emailData);

      // Enviar e-mail com PDF anexo
      const sent = await this.emailService.sendReceiptEmail(
        customerEmail,
        `#${order.id}`,
        htmlContent,
        pdfBuffer,
      );

      // Se enviado com sucesso, marcar no banco
      if (sent) {
        receipt.was_emailed = true;
        receipt.emailed_at = new Date();
        await this.receiptRepo.save(receipt);

        this.logger.log(`Comprovante enviado para ${customerEmail}`);
      }

      return sent;
    } catch (error) {
      this.logger.error(`Erro ao enviar comprovante por e-mail:`, error);
      return false;
    }
  }

  // ============================================
  // FORMATAR ENDEREÇO PARA E-MAIL
  // ============================================
  // Converte objeto de endereço em string formatada
  // ============================================
  private formatAddress(address: any): string {
    const parts = [
      `${address.street}, ${address.number}`,
      address.complement,
      address.neighborhood,
      `${address.city}/${address.state}`,
      `CEP: ${address.zip_code}`,
    ];

    return parts.filter(Boolean).join(', ');
  }

  // ============================================
  // GERAR NÚMERO ÚNICO DO COMPROVANTE
  // ============================================
  // Formato: REC-YYYYMMDD-XXXX
  // Exemplo: REC-20251126-0001
  // Sequência reinicia a cada dia
  // @returns Promise<string>
  // ============================================
  private async generateReceiptNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Buscar último comprovante do dia
    const lastReceipt = await this.receiptRepo
      .createQueryBuilder('receipt')
      .where('receipt.receipt_number LIKE :pattern', {
        pattern: `REC-${dateStr}%`,
      })
      .orderBy('receipt.id', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastReceipt) {
      const lastNumber = lastReceipt.receipt_number.split('-').pop();
      sequence = parseInt(lastNumber || '0', 10) + 1;
    }

    // Retornar número formatado
    return `REC-${dateStr}-${String(sequence).padStart(4, '0')}`;
  }

  // ============================================
  // BUSCAR COMPROVANTE POR PEDIDO
  // ============================================
  // orderId - ID do pedido
  // Promise<Receipt>
  // NotFoundException se não encontrar
  // ============================================
  async findByOrder(orderId: number): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { order_id: orderId },
      relations: ['order'],
    });

    if (!receipt) {
      throw new NotFoundException(
        `Comprovante para pedido #${orderId} não encontrado`,
      );
    }

    return receipt;
  }

  // ============================================
  // BUSCAR COMPROVANTE POR NÚMERO
  // ============================================
  // receiptNumber - Número do comprovante (REC-YYYYMMDD-XXXX)
  // Promise<Receipt>
  // NotFoundException se não encontrar
  // ============================================
  async findByNumber(receiptNumber: string): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { receipt_number: receiptNumber },
      relations: ['order'],
    });

    if (!receipt) {
      throw new NotFoundException(
        `Comprovante ${receiptNumber} não encontrado`,
      );
    }

    return receipt;
  }

  // ============================================
  // GERAR PDF DO COMPROVANTE
  // ============================================
  // Gera PDF formatado com dados do comprovante
  // Mantém toda a formatação original
  // receiptId - ID do comprovante
  // Promise<Buffer> - Buffer do PDF gerado
  // NotFoundException se comprovante não existir
  // ============================================
  async generatePDF(receiptId: number): Promise<Buffer> {
    // Buscar comprovante
    const receipt = await this.receiptRepo.findOne({
      where: { id: receiptId },
      relations: ['order'],
    });

    if (!receipt) {
      throw new NotFoundException(`Comprovante #${receiptId} não encontrado`);
    }

    // Retornar Promise com Buffer do PDF
    return new Promise((resolve, reject) => {
      try {
        // Criar documento PDF com configurações
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `Comprovante ${receipt.receipt_number}`,
            Author: 'Pizzaria Massa Nostra',
            Subject: 'Comprovante de Compra',
            Creator: 'Sistema Pizzaria Massa Nostra',
          },
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // ============================================
        // CABEÇALHO
        // ============================================
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('PIZZARIA MASSA NOSTRA', { align: 'center' });

        doc
          .fontSize(10)
          .font('Helvetica')
          .text('CNPJ: 12.345.678/0001-90', { align: 'center' })
          .text('Avenida Exemplo, 1000 - Centro - Montes Claros/MG', {
            align: 'center',
          })
          .text('Telefone: (38) 3221-0000', { align: 'center' })
          .moveDown(2);

        // ============================================
        // TÍTULO
        // ============================================
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('COMPROVANTE DE COMPRA', { align: 'center' })
          .moveDown(1);

        // ============================================
        // INFORMAÇÕES DO COMPROVANTE
        // ============================================
        doc.fontSize(10).font('Helvetica');

        const y = doc.y;
        doc.text(`Número: ${receipt.receipt_number}`, 50, y);
        doc.text(
          `Data: ${new Date(receipt.issue_date).toLocaleString('pt-BR')}`,
          300,
          y,
          { align: 'right' },
        );
        doc.moveDown(2);

        // ============================================
        // DADOS DO CLIENTE
        // ============================================
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('DADOS DO CLIENTE')
          .moveDown(0.5);

        doc.fontSize(10).font('Helvetica');
        doc.text(`Nome: ${receipt.customer_name}`);

        if (receipt.customer_cpf) {
          doc.text(`CPF: ${receipt.customer_cpf}`);
        }
        if (receipt.customer_email) {
          doc.text(`Email: ${receipt.customer_email}`);
        }
        doc.moveDown(2);

        // ============================================
        // TABELA DE ITENS
        // ============================================
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('ITENS DO PEDIDO')
          .moveDown(0.5);

        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Qtd', 300, tableTop, { width: 50, align: 'center' });
        doc.text('Valor Un. ', 350, tableTop, { width: 80, align: 'right' });
        doc.text('Total', 450, tableTop, { width: 90, align: 'right' });

        doc
          .moveTo(50, tableTop + 15)
          .lineTo(540, tableTop + 15)
          .stroke();

        const items = JSON.parse(receipt.items_json);
        let yPos = tableTop + 25;

        doc.fontSize(9).font('Helvetica');

        items.forEach((item: any) => {
          const itemName = `${item.product_name} (${item.variant_name})`;

          doc.text(itemName, 50, yPos, { width: 240 });
          doc.text(item.quantity.toString(), 300, yPos, {
            width: 50,
            align: 'center',
          });
          doc.text(
            item.unit_price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            350,
            yPos,
            { width: 80, align: 'right' },
          );
          doc.text(
            item.total_price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            450,
            yPos,
            { width: 90, align: 'right' },
          );

          yPos += 20;
        });

        doc.moveTo(50, yPos).lineTo(540, yPos).stroke();
        yPos += 15;

        // ============================================
        // TOTAIS
        // ============================================
        doc.fontSize(10).font('Helvetica');

        doc.text('Subtotal:', 350, yPos);
        doc.text(
          parseFloat(receipt.subtotal.toString()).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          450,
          yPos,
          { width: 90, align: 'right' },
        );
        yPos += 15;

        doc.text('Taxa de Entrega:', 350, yPos);
        doc.text(
          parseFloat(receipt.delivery_fee.toString()).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          450,
          yPos,
          { width: 90, align: 'right' },
        );
        yPos += 15;

        if (parseFloat(receipt.discount.toString()) > 0) {
          doc.fillColor('red');
          doc.text('Desconto:', 350, yPos);
          doc.text(
            `-${parseFloat(receipt.discount.toString()).toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              },
            )}`,
            450,
            yPos,
            { width: 90, align: 'right' },
          );
          doc.fillColor('black');
          yPos += 15;
        }

        doc.moveTo(350, yPos).lineTo(540, yPos).stroke();
        yPos += 10;

        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('TOTAL:', 350, yPos);
        doc.text(
          parseFloat(receipt.total.toString()).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          450,
          yPos,
          { width: 90, align: 'right' },
        );

        yPos += 30;

        // ============================================
        // FORMA DE PAGAMENTO
        // ============================================
        doc.fontSize(10).font('Helvetica');

        const paymentMethodMap: Record<string, string> = {
          pix: 'PIX',
          credit_card: 'Cartão de Crédito',
          debit_card: 'Cartão de Débito',
          cash: 'Dinheiro',
          voucher: 'Vale Refeição',
        };

        doc.text(
          `Forma de Pagamento: ${
            paymentMethodMap[receipt.payment_method] ||
            receipt.payment_method.toUpperCase()
          }`,
          50,
          yPos,
        );

        // ============================================
        // RODAPÉ
        // ============================================
        doc
          .fontSize(8)
          .font('Helvetica')
          .text('Obrigado pela preferência! Volte sempre! ', 50, 700, {
            align: 'center',
          })
          .text('Este documento não possui valor fiscal', {
            align: 'center',
          })
          .text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, {
            align: 'center',
          });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============================================
  // REEMITIR COMPROVANTE
  // ============================================
  // Busca comprovante existente ou gera um novo
  // orderId - ID do pedido
  // Promise<Receipt>
  // ============================================
  async reissue(orderId: number): Promise<Receipt> {
    const existing = await this.receiptRepo.findOne({
      where: { order_id: orderId },
    });

    if (existing) {
      return existing;
    }

    return this.generateReceipt(orderId);
  }

  // ============================================
  // REENVIAR E-MAIL DO COMPROVANTE
  // ============================================
  // Reenvia o comprovante por e-mail
  // Útil se o cliente não recebeu ou perdeu
  //
  // orderId - ID do pedido
  // Promise<boolean> - true se enviado
  // ============================================
  async resendEmail(orderId: number): Promise<boolean> {
    this.logger.log(`Reenviando comprovante para pedido #${orderId}`);

    const receipt = await this.findByOrder(orderId);
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: [
        'user',
        'address',
        'items',
        'items.product',
        'items.variant',
        'items.crust',
        'items.filling',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} não encontrado`);
    }

    return await this.sendReceiptEmail(receipt, order);
  }
}
