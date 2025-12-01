# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 6: PAGAMENTOS

---

## Sistema de Pagamentos

**Pizzaria Massa Nostra - Módulo de Integração de Pagamentos**

---

## 🎯 Visão Geral

O módulo de pagamentos gerencia toda a integração com gateways de pagamento da Pizzaria Massa Nostra, com foco na integração com Mercado Pago.  Implementa processamento de pagamentos via PIX, cartão de crédito/débito, dinheiro e vale-refeição, além de webhook para confirmação automática de pagamentos.

---

## ✨ Funcionalidades

### ✅ 1. Integração Mercado Pago
- Criação de pagamento PIX
- Pagamento com cartão de crédito
- Pagamento com cartão de débito
- QR Code PIX dinâmico
- Webhook de confirmação

### ✅ 2. Formas de Pagamento
- **PIX** - QR Code gerado automaticamente
- **Cartão de Crédito** - Parcelamento até 12x
- **Cartão de Débito** - Débito à vista
- **Dinheiro** - Pagamento na entrega
- **Vale-Refeição** - Voucher de alimentação

### ✅ 3. Gestão de Pagamentos
- Buscar pagamento por ID
- Listar todos os pagamentos
- Verificar status de pagamento
- Histórico de transações
- Reembolso (estorno)

### ✅ 4. Webhook Mercado Pago
- Receber notificações automáticas
- Atualizar status do pedido
- Confirmar pagamento automaticamente
- Gerar comprovante após confirmação
- Notificar cliente

### ✅ 5.  Segurança
- Validação de assinatura do webhook
- Criptografia de dados sensíveis
- Tokens de acesso seguros
- Logs de auditoria

---

## 🛣️ Endpoints da API

### **1. Buscar Pagamento por ID**

```http
GET /payment/find-one/{paymentId}
Authorization: Bearer {admin_token}
```

**Exemplo:**
```http
GET /payment/find-one/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "order_id": 1,
    "payment_method": "pix",
    "amount": "95.00",
    "status": "approved",
    "external_payment_id": "12345678901",
    "qr_code": "00020126580014br.gov.bcb.pix.. .",
    "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA.. .",
    "payment_link": "https://www.mercadopago.com. br/.. .",
    "pix_expiration_date": "2025-11-26T02:00:00. 000Z",
    "created_at": "2025-11-26T00:00:00.000Z",
    "updated_at": "2025-11-26T00:15:00.000Z"
  }
}
```

**Campos do Pagamento:**
- `id` - ID interno do pagamento
- `order_id` - ID do pedido vinculado
- `payment_method` - Forma de pagamento
- `amount` - Valor total
- `status` - Status do pagamento
- `external_payment_id` - ID do Mercado Pago
- `qr_code` - Código PIX (copia e cola)
- `qr_code_base64` - QR Code em imagem base64
- `payment_link` - Link de pagamento
- `pix_expiration_date` - Validade do PIX

---

### **2. Listar Todos os Pagamentos**

```http
GET /payment/list
Authorization: Bearer {admin_token}
```

**Filtros Disponíveis:**
- `? status=approved` - Filtrar por status
- `?payment_method=pix` - Filtrar por método
- `?order_id=1` - Filtrar por pedido
- `?date=2025-11-26` - Filtrar por data

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "payment_method": "pix",
      "amount": "95.00",
      "status": "approved",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "order_id": 2,
      "payment_method": "credit_card",
      "amount": "150.00",
      "status": "pending",
      "created_at": "2025-11-26T00:30:00.000Z"
    }
  ]
}
```

**Status Possíveis:**
- `pending` - Aguardando pagamento
- `approved` - Pagamento aprovado
- `rejected` - Pagamento rejeitado
- `cancelled` - Pagamento cancelado
- `refunded` - Pagamento reembolsado

---

### **3. Webhook Mercado Pago**

```http
POST /webhook/mercadopago
Content-Type: application/json
X-Signature: {signature}
X-Request-Id: {request_id}

{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "12345678901"
  },
  "date_created": "2025-11-26T00:15:00.000Z",
  "id": 123456789,
  "live_mode": true,
  "type": "payment",
  "user_id": "987654321"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Webhook processado com sucesso"
}
```

**Comportamento do Webhook:**

1. ✅ Recebe notificação do Mercado Pago
2. ✅ Valida assinatura (segurança)
3. ✅ Busca dados do pagamento na API do MP
4. ✅ Atualiza status do pagamento no banco
5. ✅ Atualiza status do pedido (`confirmed`)
6. ✅ Gera comprovante automaticamente
7. ✅ Envia notificação ao cliente (email/SMS)
8. ✅ Registra log de auditoria

**Tipos de Notificação:**
- `payment. created` - Pagamento criado
- `payment.updated` - Pagamento atualizado
- `payment.approved` - Pagamento aprovado
- `payment.rejected` - Pagamento rejeitado
- `payment.cancelled` - Pagamento cancelado

---

## 📁 Estrutura de Arquivos

```
src/modules/payment/
├── controllers/
│   └── payment.controller.ts           # 2 endpoints REST
├── services/
│   ├── payment.service.ts              # Lógica de pagamentos
│   └── mercadopago.service.ts          # Integração MP
├── entities/
│   └── payment. entity.ts               # Entidade de pagamento
├── dto/
│   ├── create-payment. dto.ts           # DTO de criação
│   └── webhook-mercadopago.dto.ts      # DTO de webhook
├── webhook/
│   └── webhook. controller.ts           # Webhook MP
├── payment.module.ts                   # Módulo NestJS
└── index.ts                            # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `payments`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do pagamento |
| order_id | INTEGER | FK para orders (UNIQUE) |
| payment_method | VARCHAR(50) | Forma de pagamento |
| amount | DECIMAL(10,2) | Valor total |
| status | VARCHAR(50) | Status do pagamento |
| external_payment_id | VARCHAR(200) | ID do Mercado Pago |
| qr_code | TEXT | Código PIX (copia e cola) |
| qr_code_base64 | TEXT | QR Code em base64 |
| payment_link | VARCHAR(500) | Link de pagamento |
| pix_expiration_date | TIMESTAMP | Validade do PIX |
| metadata | JSONB | Dados adicionais (MP) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| deleted_at | TIMESTAMP | Soft delete |

**Índices:**
- `idx_payments_order` (order_id) - UNIQUE
- `idx_payments_external` (external_payment_id)
- `idx_payments_status` (status)
- `idx_payments_method` (payment_method)

**Constraints:**
- `UNIQUE` em order_id (um pedido = um pagamento)
- `FOREIGN KEY` para orders

**SQL de Criação:**
```sql
CREATE TABLE public.payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL UNIQUE,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  external_payment_id VARCHAR(200),
  qr_code TEXT,
  qr_code_base64 TEXT,
  payment_link VARCHAR(500),
  pix_expiration_date TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  CONSTRAINT fk_payments_order 
    FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE RESTRICT
);

CREATE UNIQUE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_external ON public.payments(external_payment_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_method ON public.payments(payment_method);

COMMENT ON TABLE public.payments IS 'Pagamentos dos pedidos';
COMMENT ON COLUMN public.payments. external_payment_id IS 'ID do pagamento no Mercado Pago';
COMMENT ON COLUMN public.payments.qr_code IS 'Código PIX para copia e cola';
COMMENT ON COLUMN public.payments.metadata IS 'Dados adicionais do gateway de pagamento';
```

---

## 🔐 Integração Mercado Pago

### **Configuração de Credenciais**

```env
# Mercado Pago - Sandbox (Testes)
MERCADOPAGO_ACCESS_TOKEN_SANDBOX=TEST-1234567890-112233-abcdef... 
MERCADOPAGO_PUBLIC_KEY_SANDBOX=TEST-abc123... 

# Mercado Pago - Produção
MERCADOPAGO_ACCESS_TOKEN_PROD=APP_USR-1234567890-112233-abcdef... 
MERCADOPAGO_PUBLIC_KEY_PROD=APP_USR-abc123... 

# Webhook
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret_here
MERCADOPAGO_WEBHOOK_URL=https://api.massanostra.com/webhook/mercadopago
```

### **Inicialização do SDK**

```typescript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: 'unique_key_here'
  }
});

const payment = new Payment(client);
```

---

## 💳 Fluxos de Pagamento

### **1. Pagamento PIX**

```typescript
// 1. Cliente cria pedido
POST /order → order_id: 1, total: 95.00

// 2. Sistema cria pagamento PIX no Mercado Pago
const paymentData = {
  transaction_amount: 95.00,
  description: 'Pedido #1 - Pizzaria Massa Nostra',
  payment_method_id: 'pix',
  payer: {
    email: 'joao@email.com',
    first_name: 'João',
    last_name: 'Silva',
    identification: {
      type: 'CPF',
      number: '12345678900'
    }
  }
};

// 3.  Mercado Pago retorna QR Code
{
  "id": 12345678901,
  "status": "pending",
  "point_of_interaction": {
    "transaction_data": {
      "qr_code": "00020126580014br.gov.bcb.pix...",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA.. .",
      "ticket_url": "https://www.mercadopago.com.br/..."
    }
  }
}

// 4. Cliente escaneia QR Code ou copia código

// 5. Mercado Pago envia webhook
POST /webhook/mercadopago
{
  "action": "payment.updated",
  "data": { "id": "12345678901" }
}

// 6. Sistema atualiza status
payment.status = 'approved'
order.status = 'confirmed'

// 7.  Comprovante gerado automaticamente
```

---

### **2. Pagamento Cartão de Crédito**

```typescript
const paymentData = {
  transaction_amount: 95.00,
  token: 'card_token_id',  // Token do cartão (gerado no frontend)
  description: 'Pedido #1',
  installments: 3,         // Parcelamento
  payment_method_id: 'visa',
  payer: {
    email: 'joao@email.com',
    identification: {
      type: 'CPF',
      number: '12345678900'
    }
  }
};

// Resposta:
{
  "id": 12345678902,
  "status": "approved",      // ou "rejected"
  "status_detail": "accredited",
  "installments": 3,
  "installment_amount": 31.67
}
```

---

### **3. Pagamento em Dinheiro**

```typescript
// Não precisa integração com gateway
// Marcado como "pending" até a entrega

// Ao validar token de entrega:
POST /order/1/validate-token
{
  "token": "123456",
  "payment_confirmed": true  // Motoboy confirma recebimento
}

// Sistema atualiza:
payment.status = 'approved'
order.status = 'delivered'
```

---

## 📝 DTOs (Data Transfer Objects)

### **CreatePaymentDto**

```typescript
import { 
  IsNotEmpty, 
  IsNumber, 
  IsString,
  IsOptional,
  Min
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty({ message: 'ID do pedido é obrigatório' })
  order_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Forma de pagamento é obrigatória' })
  payment_method: string;  // pix, credit_card, debit_card, cash, voucher

  @IsNumber()
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount: number;

  @IsOptional()
  @IsString()
  card_token?: string;  // Token do cartão (se crédito/débito)

  @IsOptional()
  @IsNumber()
  installments?: number;  // Parcelamento (se crédito)
}
```

### **WebhookMercadoPagoDto**

```typescript
export class WebhookMercadoPagoDto {
  @IsString()
  action: string;  // payment.created, payment.updated, etc

  @IsString()
  api_version: string;

  @IsNotEmpty()
  data: {
    id: string;  // ID do pagamento no MP
  };

  @IsString()
  date_created: string;

  @IsNumber()
  id: number;

  @IsBoolean()
  live_mode: boolean;

  @IsString()
  type: string;  // payment

  @IsString()
  user_id: string;
}
```

---

## 🧪 Testes Completos

### **TESTE 1: Buscar Pagamento por ID**

**Request:**
```http
GET http://localhost:3001/payment/find-one/1
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "order_id": 1,
    "payment_method": "pix",
    "amount": "95.00",
    "status": "approved",
    "external_payment_id": "12345678901",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Status:**  200 OK

---

### **TESTE 2: Listar Todos os Pagamentos**

**Request:**
```http
GET http://localhost:3001/payment/list
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "payment_method": "pix",
      "amount": "95.00",
      "status": "approved"
    },
    {
      "id": 2,
      "order_id": 2,
      "payment_method": "credit_card",
      "amount": "150.00",
      "status": "pending"
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 3: Filtrar Pagamentos Aprovados**

**Request:**
```http
GET http://localhost:3001/payment/list?status=approved
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "status": "approved",
      "amount": "95.00"
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 4: Webhook - Pagamento Aprovado**

**Request:**
```http
POST http://localhost:3001/webhook/mercadopago
Content-Type: application/json
X-Signature: sha256=abc123...
X-Request-Id: unique-request-id

{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "12345678901"
  },
  "date_created": "2025-11-26T00:15:00.000Z",
  "id": 123456789,
  "live_mode": false,
  "type": "payment",
  "user_id": "987654321"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Webhook processado com sucesso"
}
```

**Status:**  200 OK

**Validações no Banco:**
```sql
-- Verificar atualização do pagamento
SELECT status FROM payments WHERE external_payment_id = '12345678901';
-- Deve retornar: 'approved'

-- Verificar atualização do pedido
SELECT status FROM orders WHERE id = 1;
-- Deve retornar: 'confirmed'

-- Verificar geração de comprovante
SELECT * FROM receipts WHERE order_id = 1;
-- Deve existir registro
```

---

### **TESTE 5: Webhook - Pagamento Rejeitado**

**Request:**
```http
POST http://localhost:3001/webhook/mercadopago
Content-Type: application/json

{
  "action": "payment.updated",
  "data": {
    "id": "12345678902"
  }
}
```

**Comportamento Esperado:**
- ✅ Sistema busca dados do pagamento no MP
- ✅ Status retornado: `rejected`
- ✅ Atualiza payment. status = 'rejected'
- ✅ Order.status permanece 'pending'
- ✅ Cliente notificado sobre falha

**Status:**  200 OK

---

### **TESTE 6: Simular Pagamento PIX (Sandbox)**

**Setup:**
```bash
# 1. Criar pedido
curl -X POST http://localhost:3001/order \
  -H "Authorization: Bearer {token}" \
  -d '{... }'

# 2. Pagamento PIX criado automaticamente
# Retorna QR Code

# 3. Simular aprovação no Mercado Pago Sandbox
# Acesse: https://www.mercadopago.com. br/developers/panel/test-users

# 4. Webhook será disparado automaticamente
```

**Validação:**
```sql
SELECT status FROM payments WHERE order_id = 1;
-- Deve mudar de 'pending' para 'approved'
```

---

## ✅ Checklist de Validação

```
□ Buscar pagamento por ID funciona
□ Listar pagamentos funciona
□ Filtrar por status funciona
□ Filtrar por método funciona
□ Webhook recebe notificações
□ Webhook valida assinatura
□ Webhook atualiza status do pagamento
□ Webhook atualiza status do pedido
□ Comprovante gerado após aprovação
□ Notificação enviada ao cliente
□ Pagamento PIX gera QR Code
□ QR Code em base64 funciona
□ Pagamento em dinheiro funciona
□ Logs de auditoria registrados
```

---

## 📊 Fluxo Completo de Pagamento

```
┌──────────────┐
│   Cliente    │
└──────┬───────┘
       │ 1. POST /order
       │    Cria pedido
       ▼
┌─────────────────────────┐
│   OrderService          │
│  ├─ Cria pedido         │
│  └─ Cria pagamento      │
└──────┬──────────────────┘
       │ 2.  Gera pagamento
       ▼
┌─────────────────────────┐
│   MercadoPagoService    │
│  ├─ Cria pagamento MP   │
│  └─ Retorna QR Code     │
└──────┬──────────────────┘
       │ 3. QR Code
       ▼
┌──────────────┐
│   Cliente    │
│  (paga PIX)  │
└──────────────┘

┌─────────────────────────┐
│   Mercado Pago          │
│  (confirma pagamento)   │
└──────┬──────────────────┘
       │ 4.  Envia webhook
       ▼
┌─────────────────────────┐
│   WebhookController     │
│  ├─ Valida assinatura   │
│  ├─ Busca dados MP      │
│  ├─ Atualiza payment    │
│  ├─ Atualiza order      │
│  ├─ Gera comprovante    │
│  └─ Notifica cliente    │
└──────┬──────────────────┘
       │ 5. Confirmação
       ▼
┌──────────────┐
│   Cliente    │
│  (notificado)│
└──────────────┘
```

---

## 🔒 Segurança do Webhook

### **Validação de Assinatura**

```typescript
import * as crypto from 'crypto';

function validateWebhookSignature(
  signature: string,
  requestBody: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(requestBody)
    .digest('hex');
  
  return signature === `sha256=${hash}`;
}

// Uso no controller:
const isValid = validateWebhookSignature(
  req.headers['x-signature'],
  JSON.stringify(req.body),
  process.env.MERCADOPAGO_WEBHOOK_SECRET
);

if (!isValid) {
  throw new UnauthorizedException('Assinatura inválida');
}
```

---

## 🚀 Exemplos de Uso

### **Cenário: Cliente Paga com PIX**

```bash
# 1. Cliente cria pedido
curl -X POST http://localhost:3001/order \
  -H "Authorization: Bearer {token}" \
  -d '{
    "address_id":1,
    "items":[{"product_id":1,"variant_id":2,"quantity":2}],
    "payment_method":"pix"
  }'

# Resposta inclui:
{
  "payment": {
    "qr_code": "00020126580014br.gov.bcb.pix...",
    "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
  }
}

# 2. Cliente escaneia QR Code no app do banco

# 3.  Mercado Pago envia webhook (automático)

# 4. Sistema confirma pedido (automático)

# 5. Cliente é notificado (automático)
```

---

## 📚 Referências Técnicas

- [Mercado Pago SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Webhooks Mercado Pago](https://www.mercadopago.com. br/developers/pt/docs/your-integrations/notifications/webhooks)
- [PIX Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix)
- [Cartões Mercado Pago](https://www.mercadopago.com. br/developers/pt/docs/checkout-api/integration-configuration/card/integrate-via-cardform)

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Pagamentos  

---
