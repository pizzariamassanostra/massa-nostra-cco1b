// ============================================
// SERVIÇO: VALIDAÇÃO DE WEBHOOK
// ============================================
// Valida webhooks do Mercado Pago
// ============================================

import ApiError from '@/common/error/entities/api-error.entity';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import * as tsse from 'tsse';

@Injectable()
export class ValidateWebhookService {
  // ============================================
  // VALIDA ASSINATURA DO WEBHOOK
  // ============================================
  async validateWebhook(
    headerToken: string,
    queryDataId: string,
    headerRequestId: string,
  ): Promise<boolean> {
    // Pega o secret do webhook configurado no Mercado Pago
    const ourToken = process.env.WEBHOOK_SECRET;

    // Separa o timestamp e o token da assinatura
    const initialSplit = headerToken.split(',v1=');
    const token = initialSplit[1];
    const timestamp = initialSplit[0].replace('ts=', '');

    // Monta o template de validação conforme documentação do Mercado Pago
    const template = `id:${queryDataId};request-id:${headerRequestId};ts:${timestamp};`;

    // Gera hash HMAC SHA256 com nosso secret
    const hash = createHmac('sha256', ourToken).update(template).digest('hex');

    // Compara de forma segura contra timing attacks
    const isSignatureValid = await tsse(hash, token);

    if (!isSignatureValid) {
      throw new ApiError('invalid-signature', 'Assinatura inválida', 400);
    }

    return isSignatureValid;
  }
}
