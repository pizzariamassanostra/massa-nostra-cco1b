// ===========================================
// TEMPLATE DE E-MAIL - COMPROVANTE DE PEDIDO
// Template HTML para envio de comprovante
// ===========================================

// Interface com dados do comprovante de pedido

export interface ReceiptEmailData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  deliveryToken: string;
  address?: string;
}

// Gera o HTML do e-mail de comprovante de pedido
export function generateReceiptEmailHTML(data: ReceiptEmailData): string {
  // Formata valores para moeda brasileira (R$)
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mapeia forma de pagamento para nome amigável ao cliente
  const paymentMethodNames = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    cash: 'Dinheiro',
    voucher: 'Vale Refeição',
  };

  const paymentMethodDisplay =
    paymentMethodNames[data.paymentMethod] || data.paymentMethod;

  // Gera linhas HTML dos itens do pedido
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong> x${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${formatCurrency(item.totalPrice)}
      </td>
    </tr>
  `,
    )
    .join('');

  // Template HTML completo do e-mail
  return `
<! DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprovante de Pedido</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Cabeçalho com logo da pizzaria -->
          <tr>
            <td style="background-color: #d32f2f; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">PIZZARIA MASSA NOSTRA</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">A melhor pizza da cidade! </p>
            </td>
          </tr>

          <!-- Mensagem de confirmação -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #333; margin: 0 0 10px 0;">Olá, ${data.customerName}!  </h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0;">
                Seu pedido foi <strong style="color: #4caf50;">confirmado com sucesso!</strong> 
              </p>
            </td>
          </tr>

          <!-- Seção com detalhes do pedido -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" style="background-color: #f9f9f9; border-radius: 6px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      <strong style="color: #333;">Número do Pedido:</strong> ${data.orderNumber}
                    </p>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                      <strong style="color: #333;">Data:</strong> ${data.orderDate}
                    </p>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                      <strong style="color: #333;">Status:</strong> <span style="color: #4caf50;">Confirmado</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Lista dos itens pedidos -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Itens do Pedido</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 6px; overflow: hidden;">
                ${itemsHTML}
              </table>
            </td>
          </tr>

          <!-- Seção de totais e valores -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px; border-radius: 6px;">
                <tr>
                  <td style="padding: 5px 0;">Subtotal:</td>
                  <td style="padding: 5px 0; text-align: right;">${formatCurrency(data.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">Taxa de Entrega:</td>
                  <td style="padding: 5px 0; text-align: right;">${formatCurrency(data.deliveryFee)}</td>
                </tr>
                ${
                  data.discount > 0
                    ? `
                <tr>
                  <td style="padding: 5px 0; color: #4caf50;">Desconto:</td>
                  <td style="padding: 5px 0; text-align: right; color: #4caf50;">- ${formatCurrency(data.discount)}</td>
                </tr>
                `
                    : ''
                }
                <tr style="border-top: 2px solid #d32f2f;">
                  <td style="padding: 15px 0 5px 0; font-size: 18px; font-weight: bold; color: #d32f2f;">TOTAL:</td>
                  <td style="padding: 15px 0 5px 0; text-align: right; font-size: 18px; font-weight: bold; color: #d32f2f;">
                    ${formatCurrency(data.total)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Forma de pagamento e token de entrega -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #856404;">
                      <strong>Forma de Pagamento:</strong> ${paymentMethodDisplay}
                    </p>
                    ${
                      data.deliveryToken
                        ? `
                    <p style="margin: 10px 0 0 0; color: #856404;">
                      <strong>Token de Entrega:</strong> 
                      <span style="font-size: 24px; font-weight: bold; color: #d32f2f;">${data.deliveryToken}</span>
                    </p>
                    <p style="margin: 5px 0 0 0; color: #856404; font-size: 12px;">
                      Informe este código ao entregador para confirmar o recebimento
                    </p>
                    `
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Endereço de entrega do pedido -->
          ${
            data.address
              ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Endereço de Entrega</h3>
              <p style="margin: 0; color: #666; line-height: 1.5;">${data.address}</p>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Informação sobre comprovante em PDF -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #e3f2fd; border: 1px solid #2196f3; border-radius: 6px; padding: 15px; text-align: center;">
                <p style="margin: 0; color: #1976d2;">
                  <strong>Comprovante em anexo (PDF)</strong>
                </p>
              </div>
            </td>
          </tr>

          <!-- Rodapé com informações da pizzaria -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Obrigado pela preferência!  Volte sempre!
              </p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                <strong>Pizzaria Massa Nostra</strong><br>
                Este é um e-mail automático, não é necessário responder. 
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
