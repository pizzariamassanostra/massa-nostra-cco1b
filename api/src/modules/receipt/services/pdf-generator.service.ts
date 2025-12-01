// ============================================
// SERVIÇO: GERADOR DE PDF
// ============================================
// Serviço de geração de comprovantes em PDF
// ============================================

import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { CloudinaryService } from '@/common/libs/cloudinary/cloudinary.service';

interface ReceiptData {
  receiptNumber: string;
  orderNumber: number;
  customerName: string;
  customerCpf?: string;
  customerEmail?: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  createdAt: Date;
}

@Injectable()
export class PdfGeneratorService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // ============================================
  // GERAR PDF DO COMPROVANTE
  // ============================================
  async generateReceipt(data: ReceiptData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // CABEÇALHO
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('PIZZARIA MASSA NOSTRA', { align: 'center' });

        doc
          .fontSize(10)
          .font('Helvetica')
          .text('Rua das Pizzas, 123 - Centro', { align: 'center' })
          .text('Tel: (11) 98765-4321', { align: 'center' })
          .text('CNPJ: 12.345.678/0001-90', { align: 'center' })
          .moveDown(2);

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('COMPROVANTE DE PEDIDO', { align: 'center' })
          .moveDown(1);

        doc.fontSize(10).font('Helvetica');
        doc.text(`Comprovante: ${data.receiptNumber}`, 50);
        doc.text(`Pedido: #${data.orderNumber}`);
        doc.text(
          `Data: ${data.createdAt.toLocaleDateString('pt-BR')} ${data.createdAt.toLocaleTimeString('pt-BR')}`,
        );
        doc.moveDown(1);

        doc.font('Helvetica-Bold').text('DADOS DO CLIENTE:');
        doc.font('Helvetica');
        doc.text(`Nome: ${data.customerName}`);
        if (data.customerCpf) doc.text(`CPF: ${data.customerCpf}`);
        if (data.customerEmail) doc.text(`Email: ${data.customerEmail}`);
        doc.text(`Telefone: ${data.customerPhone || 'N/A'}`);
        doc.moveDown(1);

        doc.font('Helvetica-Bold').text('ITENS DO PEDIDO:');
        doc.moveDown(0.5);

        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Qtd', 300, tableTop);
        doc.text('Valor Unit.', 350, tableTop);
        doc.text('Total', 450, tableTop);

        doc
          .moveTo(50, tableTop + 15)
          .lineTo(550, tableTop + 15)
          .stroke();
        doc.moveDown(1);

        doc.font('Helvetica');
        data.items.forEach((item) => {
          const y = doc.y;
          doc.text(item.name, 50, y, { width: 240 });
          doc.text(item.quantity.toString(), 300, y);
          doc.text(`R$ ${item.unit_price.toFixed(2)}`, 350, y);
          doc.text(`R$ ${item.total_price.toFixed(2)}`, 450, y);
          doc.moveDown(0.5);
        });

        doc.moveDown(1);

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        const totalsX = 350;
        doc.text('Subtotal:', totalsX);
        doc.text(`R$ ${data.subtotal.toFixed(2)}`, 450, doc.y - 12);

        doc.text('Taxa de Entrega:', totalsX);
        doc.text(`R$ ${data.deliveryFee.toFixed(2)}`, 450, doc.y - 12);

        doc.moveDown(0.5);
        doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.text('TOTAL:', totalsX);
        doc.text(`R$ ${data.total.toFixed(2)}`, 450, doc.y - 14);

        doc.moveDown(2);

        doc.fontSize(10).font('Helvetica');
        doc.text(`Forma de Pagamento: ${data.paymentMethod.toUpperCase()}`);

        doc.moveDown(2);

        doc.fontSize(8).font('Helvetica-Oblique');
        doc.text('Obrigado pela preferência!', { align: 'center' });
        doc.text('Pizzaria Massa Nostra - A melhor pizza da região!', {
          align: 'center',
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============================================
  // GERAR E FAZER UPLOAD PARA CLOUDINARY
  // ============================================
  async generateAndUpload(data: ReceiptData): Promise<string> {
    console.log(`Gerando PDF do comprovante...`);
    const pdfBuffer = await this.generateReceipt(data);
    console.log(`PDF gerado com ${pdfBuffer.length} bytes`);

    console.log(`Fazendo upload para Cloudinary...`);
    const result = await this.cloudinaryService.uploadPdf(
      pdfBuffer,
      data.receiptNumber,
    );
    console.log(`Upload concluído: ${result.secure_url}`);

    return result.secure_url;
  }
}
