// ============================================
// INTERFACE: RESPONSE PIX MERCADO PAGO
// ============================================
// Resposta da criação de pagamento PIX
// ============================================

export interface MercadoPagoPixResponse {
  id: number; // ID do pagamento no Mercado Pago
  status: string; // pending, approved, rejected
  status_detail: string; // Detalhes do status
  transaction_details: TransactionDetails;
  point_of_interaction: PointOfInteraction;
}

interface TransactionDetails {
  net_received_amount: number;
  total_paid_amount: number;
  overpaid_amount: number;
  external_resource_url: string | null;
  installment_amount: number;
  financial_institution: string | null;
}

interface PointOfInteraction {
  type: string;
  sub_type: string | null;
  application_data: ApplicationData;
  transaction_data: TransactionData;
}

interface ApplicationData {
  name: string;
  version: string;
}

interface TransactionData {
  qr_code_base64: string; // QR Code em base64
  qr_code: string; // Código PIX copia e cola
  ticket_url: string; // URL do boleto (se aplicável)
}
