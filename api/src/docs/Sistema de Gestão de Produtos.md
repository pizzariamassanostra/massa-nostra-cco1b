# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 5: PEDIDOS

---

## Sistema de Gestão de Pedidos

**Pizzaria Massa Nostra - Módulo de Pedidos e Entregas**

---

## 🎯 Visão Geral

O módulo de pedidos gerencia todo o fluxo de compra da Pizzaria Massa Nostra, desde a criação do pedido pelo cliente até a entrega final com validação de token.  Implementa sistema de status, cálculo automático de valores, integração com pagamento, geração de token de entrega e controle completo do ciclo de vida do pedido. 

---

## ✨ Funcionalidades

### ✅ 1. Gestão de Pedidos
- Criar novo pedido
- Buscar pedido por ID
- Listar pedidos do cliente
- Listar todos os pedidos (admin)
- Atualizar status do pedido
- Cancelar pedido
- Sistema de tempo estimado

### ✅ 2.  Sistema de Status
- `pending` - Aguardando pagamento
- `confirmed` - Pagamento confirmado
- `preparing` - Em preparo
- `ready` - Pronto para entrega
- `out_for_delivery` - Saiu para entrega
- `delivered` - Entregue
- `cancelled` - Cancelado

### ✅ 3.  Cálculo Automático de Valores
- Subtotal (soma dos itens)
- Taxa de entrega
- Desconto (cupons)
- Total final
- Validação de valores

### ✅ 4. Gestão de Endereços
- Cadastrar endereço de entrega
- Listar endereços do cliente
- Atualizar endereço
- Deletar endereço
- Validação de CEP

### ✅ 5. Sistema de Entrega
- Token único de 6 dígitos
- Validação de entrega pelo motoboy
- Rastreamento de status
- Tempo estimado de entrega

### ✅ 6. Integração
- Pagamento (Mercado Pago)
- Estoque (baixa automática)
- Comprovante (geração automática)
- Notificações (email/SMS)

---

## 🛣️ Endpoints da API

### **1. Criar Pedido**

```http
POST /order
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "address_id": 1,
  "items": [
    {
      "product_id": 1,
      "variant_id": 2,
      "quantity": 2,
      "observations": "Sem cebola"
    },
    {
      "product_id": 4,
      "quantity": 1
    }
  ],
  "payment_method": "pix",
  "delivery_fee": 5.00,
  "discount": 0.00,
  "notes": "Tocar a campainha"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "id": 1,
    "order_number": "ORD-20251126-0001",
    "status": "pending",
    "customer": {
      "id": 1,
      "name": "João Silva"
    },
    "address": {
      "id": 1,
      "street": "Avenida Exemplo, 100",
      "neighborhood": "Centro",
      "city": "Montes Claros"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Pizza Marguerita"
        },
        "variant": {
          "id": 2,
          "size": "Média"
        },
        "quantity": 2,
        "unit_price": "40.00",
        "total_price": "80.00",
        "observations": "Sem cebola"
      },
      {
        "id": 2,
        "product": {
          "id": 4,
          "name": "Coca-Cola 2L"
        },
        "quantity": 1,
        "unit_price": "10.00",
        "total_price": "10.00"
      }
    ],
    "subtotal": "90.00",
    "delivery_fee": "5.00",
    "discount": "0.00",
    "total": "95.00",
    "payment_method": "pix",
    "delivery_token": "123456",
    "estimated_time": 45,
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Validações:**
- ✅ Cliente autenticado
- ✅ Endereço pertence ao cliente
- ✅ Produtos existem e estão disponíveis
- ✅ Variações existem (se especificadas)
- ✅ Quantidade positiva
- ✅ Forma de pagamento válida
- ✅ Valores calculados automaticamente

---

### **2.  Buscar Pedido por ID**

```http
GET /order/{id}
Authorization: Bearer {token}
```

**Exemplo:**
```http
GET /order/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "order_number": "ORD-20251126-0001",
    "status": "confirmed",
    "customer": {
      "id": 1,
      "name": "João Silva",
      "phone": "38999999999"
    },
    "address": {
      "street": "Avenida Exemplo",
      "number": "100",
      "neighborhood": "Centro",
      "city": "Montes Claros",
      "state": "MG",
      "cep": "39400000"
    },
    "items": [
      {
        "product": "Pizza Marguerita",
        "variant": "Média",
        "quantity": 2,
        "unit_price": "40.00",
        "total_price": "80.00"
      }
    ],
    "subtotal": "90.00",
    "delivery_fee": "5. 00",
    "total": "95.00",
    "payment_method": "pix",
    "delivery_token": "123456",
    "estimated_time": 45,
    "created_at": "2025-11-26T00:00:00.000Z",
    "updated_at": "2025-11-26T00:15:00.000Z"
  }
}
```

---

### **3. Listar Pedidos do Cliente**

```http
GET /order/user/{userId}
Authorization: Bearer {customer_token}
```

**Exemplo:**
```http
GET /order/user/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20251126-0001",
      "status": "delivered",
      "total": "95.00",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "order_number": "ORD-20251125-0005",
      "status": "confirmed",
      "total": "120.00",
      "created_at": "2025-11-25T20:00:00.000Z"
    }
  ]
}
```

**Ordenação:** Do mais recente para o mais antigo

---

### **4. Listar Todos os Pedidos (Admin)**

```http
GET /order
Authorization: Bearer {admin_token}
```

**Filtros Disponíveis:**
- `? status=preparing` - Filtrar por status
- `?date=2025-11-26` - Filtrar por data
- `?customer_id=1` - Filtrar por cliente

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20251126-0001",
      "status": "preparing",
      "customer": {
        "id": 1,
        "name": "João Silva"
      },
      "total": "95.00",
      "payment_method": "pix",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "order_number": "ORD-20251126-0002",
      "status": "confirmed",
      "customer": {
        "id": 2,
        "name": "Maria Santos"
      },
      "total": "150.00",
      "payment_method": "credit_card",
      "created_at": "2025-11-26T00:30:00.000Z"
    }
  ]
}
```

---

### **5.  Atualizar Status do Pedido**

```http
PUT /order/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "preparing"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Status atualizado com sucesso",
  "data": {
    "id": 1,
    "status": "preparing",
    "updated_at": "2025-11-26T00:20:00.000Z"
  }
}
```

**Status Válidos:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `out_for_delivery`
- `delivered`
- `cancelled`

**Validações:**
- ✅ Transição de status válida
- ✅ Pedido não pode voltar de status final
- ✅ Cancelamento apenas em status inicial

---

### **6.  Validar Token de Entrega**

```http
POST /order/{id}/validate-token
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "token": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Token validado com sucesso.  Pedido entregue!",
  "data": {
    "id": 1,
    "status": "delivered",
    "delivered_at": "2025-11-26T01:00:00.000Z"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "ok": false,
  "errors": [{
    "message": "Token inválido",
    "userMessage": "Token de entrega incorreto"
  }]
}
```

**Validações:**
- ✅ Token deve ter 6 dígitos
- ✅ Token deve corresponder ao pedido
- ✅ Pedido deve estar em `out_for_delivery`
- ✅ Atualiza status para `delivered` automaticamente

---

### **7.  Cancelar Pedido**

```http
POST /order/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Mudei de ideia"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Pedido cancelado com sucesso",
  "data": {
    "id": 1,
    "status": "cancelled",
    "cancelled_at": "2025-11-26T00:10:00.000Z",
    "cancellation_reason": "Mudei de ideia"
  }
}
```

**Validações:**
- ✅ Apenas status `pending` ou `confirmed` podem ser cancelados
- ✅ Cliente pode cancelar seus próprios pedidos
- ✅ Admin pode cancelar qualquer pedido

---

### **8. Cadastrar Endereço de Entrega**

```http
POST /order/address
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "cep": "39400000",
  "street": "Avenida Exemplo",
  "number": "100",
  "complement": "Apto 201",
  "neighborhood": "Centro",
  "city": "Montes Claros",
  "state": "MG",
  "reference_point": "Próximo ao supermercado",
  "delivery_instructions": "Não tocar a campainha"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Endereço cadastrado com sucesso",
  "data": {
    "id": 1,
    "cep": "39400000",
    "street": "Avenida Exemplo",
    "number": "100",
    "complement": "Apto 201",
    "neighborhood": "Centro",
    "city": "Montes Claros",
    "state": "MG",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **9. Listar Endereços do Cliente**

```http
GET /order/address/user/{userId}
Authorization: Bearer {customer_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "street": "Avenida Exemplo",
      "number": "100",
      "neighborhood": "Centro",
      "city": "Montes Claros",
      "state": "MG",
      "cep": "39400000"
    },
    {
      "id": 2,
      "street": "Rua das Flores",
      "number": "200",
      "neighborhood": "Jardim",
      "city": "Montes Claros",
      "state": "MG",
      "cep": "39401000"
    }
  ]
}
```

---

### **10. Atualizar Endereço**

```http
PUT /order/address/{id}
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "number": "102",
  "complement": "Apto 202",
  "delivery_instructions": "Tocar campainha"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Endereço atualizado com sucesso"
}
```

---

### **11. Deletar Endereço**

```http
DELETE /order/address/{id}
Authorization: Bearer {customer_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Endereço excluído com sucesso"
}
```

---

## 📁 Estrutura de Arquivos

```
src/modules/order/
├── controllers/
│   ├── order.controller.ts             # 7 endpoints de pedidos
│   └── address.controller.ts           # 4 endpoints de endereços
├── services/
│   ├── order.service.ts                # Lógica de pedidos
│   └── address.service.ts              # Lógica de endereços
├── entities/
│   ├── order.entity.ts                 # Pedido principal
│   ├── order-item.entity.ts            # Itens do pedido
│   └── delivery-address.entity.ts      # Endereços de entrega
├── dto/
│   ├── create-order.dto.ts             # DTO de criação
│   ├── update-order-status.dto.ts      # DTO de status
│   ├── validate-token.dto.ts           # DTO de token
│   └── create-address.dto.ts           # DTO de endereço
├── order.module.ts                     # Módulo NestJS
└── index.ts                            # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `orders`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do pedido |
| common_user_id | INTEGER | FK para common_users |
| address_id | INTEGER | FK para delivery_addresses |
| status | VARCHAR(50) | Status atual |
| subtotal | DECIMAL(10,2) | Soma dos itens |
| delivery_fee | DECIMAL(10,2) | Taxa de entrega |
| discount | DECIMAL(10,2) | Desconto aplicado |
| total | DECIMAL(10,2) | Total final |
| payment_method | VARCHAR(50) | Forma de pagamento |
| payment_reference | VARCHAR(200) | Ref.  do pagamento |
| delivery_token | VARCHAR(6) | Token de entrega |
| notes | TEXT | Observações |
| estimated_time | INTEGER | Tempo estimado (min) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| deleted_at | TIMESTAMP | Soft delete |

---

### **Tabela: `order_items`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do item |
| order_id | INTEGER | FK para orders |
| product_id | INTEGER | FK para products |
| variant_id | INTEGER | FK para product_variants (nullable) |
| quantity | INTEGER | Quantidade |
| unit_price | DECIMAL(10,2) | Preço unitário |
| total_price | DECIMAL(10,2) | Preço total (unit * qty) |
| observations | TEXT | Observações do item |
| created_at | TIMESTAMP | Data de criação |

---

### **Tabela: `delivery_addresses`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| common_user_id | INTEGER | FK para common_users |
| cep | VARCHAR(8) | CEP |
| street | VARCHAR(200) | Rua/Avenida |
| number | VARCHAR(20) | Número |
| complement | VARCHAR(100) | Complemento |
| neighborhood | VARCHAR(100) | Bairro |
| city | VARCHAR(100) | Cidade |
| state | VARCHAR(2) | UF |
| reference_point | TEXT | Ponto de referência |
| delivery_instructions | TEXT | Instruções de entrega |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| deleted_at | TIMESTAMP | Soft delete |

---

**SQL de Criação:**
```sql
-- Tabela de pedidos
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  common_user_id INTEGER NOT NULL,
  address_id INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_reference VARCHAR(200),
  delivery_token VARCHAR(6),
  notes TEXT,
  estimated_time INTEGER DEFAULT 45,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  CONSTRAINT fk_orders_user 
    FOREIGN KEY (common_user_id) 
    REFERENCES common_users(id),
  
  CONSTRAINT fk_orders_address 
    FOREIGN KEY (address_id) 
    REFERENCES delivery_addresses(id)
);

-- Tabela de itens do pedido
CREATE TABLE public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  variant_id INTEGER,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  observations TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_order_items_order 
    FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT fk_order_items_product 
    FOREIGN KEY (product_id) 
    REFERENCES products(id),
  
  CONSTRAINT fk_order_items_variant 
    FOREIGN KEY (variant_id) 
    REFERENCES product_variants(id)
);

-- Tabela de endereços
CREATE TABLE public.delivery_addresses (
  id SERIAL PRIMARY KEY,
  common_user_id INTEGER NOT NULL,
  cep VARCHAR(8) NOT NULL,
  street VARCHAR(200) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(100),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  reference_point TEXT,
  delivery_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  CONSTRAINT fk_addresses_user 
    FOREIGN KEY (common_user_id) 
    REFERENCES common_users(id)
);

-- Índices
CREATE INDEX idx_orders_user ON public.orders(common_user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_addresses_user ON public.delivery_addresses(common_user_id);
```

---

## 🔢 Sistema de Token de Entrega

### **Geração de Token**

```typescript
function generateDeliveryToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
  // Retorna: "123456" (sempre 6 dígitos)
}
```

### **Fluxo de Validação**

```
1. Cliente faz pedido → Token gerado (ex: 123456)
2. Cliente recebe token no app/email/SMS
3.  Motoboy chega no endereço
4. Cliente informa token: 123456
5. Motoboy valida no app:
   POST /order/{id}/validate-token
   { "token": "123456" }
6. Sistema valida:
   ✅ Token correto → Status = delivered
   ❌ Token errado → Erro 400
```

---

## 💰 Sistema de Cálculo de Valores

### **Fórmula**

```
SUBTOTAL = Σ (unit_price × quantity) de todos os itens

TOTAL = SUBTOTAL + DELIVERY_FEE - DISCOUNT
```

### **Exemplo Completo**

```
Pedido:
- 2x Pizza Marguerita Média (R$ 40,00 cada) = R$ 80,00
- 1x Coca-Cola 2L (R$ 10,00) = R$ 10,00

SUBTOTAL = R$ 90,00
Taxa de Entrega = R$ 5,00
Desconto (cupom) = R$ 10,00

TOTAL = R$ 90,00 + R$ 5,00 - R$ 10,00 = R$ 85,00
```

---

## 📝 DTOs (Data Transfer Objects)

### **CreateOrderDto**

```typescript
import { 
  IsNotEmpty, 
  IsNumber, 
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsOptional()
  @IsNumber()
  variant_id?: number;

  @IsNumber()
  @Min(1, { message: 'Quantidade mínima é 1' })
  quantity: number;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  address_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsString()
  @IsNotEmpty({ message: 'Forma de pagamento é obrigatória' })
  payment_method: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  delivery_fee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
```

---

## 🧪 Testes Completos

### **TESTE 1: Criar Pedido Completo**

**Request:**
```http
POST http://localhost:3001/order
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "address_id": 1,
  "items": [
    {
      "product_id": 1,
      "variant_id": 2,
      "quantity": 2,
      "observations": "Sem cebola"
    },
    {
      "product_id": 4,
      "quantity": 1
    }
  ],
  "payment_method": "pix",
  "delivery_fee": 5.00,
  "notes": "Tocar campainha"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "id": 1,
    "status": "pending",
    "subtotal": "90.00",
    "delivery_fee": "5.00",
    "total": "95.00",
    "delivery_token": "123456"
  }
}
```

**Status:**  201 Created

---

### **TESTE 2: Buscar Pedido por ID**

**Request:**
```http
GET http://localhost:3001/order/1
Authorization: Bearer {customer_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "status": "confirmed",
    "items": [
      {
        "product": "Pizza Marguerita",
        "variant": "Média",
        "quantity": 2,
        "unit_price": "40.00",
        "total_price": "80.00"
      }
    ],
    "total": "95.00"
  }
}
```

**Status:**  200 OK

---

### **TESTE 3: Listar Pedidos do Cliente**

**Request:**
```http
GET http://localhost:3001/order/user/1
Authorization: Bearer {customer_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "status": "delivered",
      "total": "95.00",
      "created_at": "2025-11-26T00:00:00.000Z"
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 4: Atualizar Status para Preparando**

**Request:**
```http
PUT http://localhost:3001/order/1/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "preparing"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Status atualizado com sucesso"
}
```

**Status:**  200 OK

---

### **TESTE 5: Validar Token de Entrega**

**Request:**
```http
POST http://localhost:3001/order/1/validate-token
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "token": "123456"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Token validado com sucesso.  Pedido entregue!"
}
```

**Status:**  200 OK

---

### **TESTE 6: Validar Token Incorreto**

**Request:**
```http
POST http://localhost:3001/order/1/validate-token
Content-Type: application/json

{
  "token": "999999"
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Token inválido"
  }]
}
```

**Status:**  400 Bad Request

---

### **TESTE 7: Cancelar Pedido**

**Request:**
```http
POST http://localhost:3001/order/1/cancel
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "reason": "Mudei de ideia"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Pedido cancelado com sucesso"
}
```

**Status:**  200 OK

---

### **TESTE 8: Cadastrar Endereço**

**Request:**
```http
POST http://localhost:3001/order/address
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "cep": "39400000",
  "street": "Avenida Exemplo",
  "number": "100",
  "neighborhood": "Centro",
  "city": "Montes Claros",
  "state": "MG"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Endereço cadastrado com sucesso",
  "data": {
    "id": 1,
    "street": "Avenida Exemplo",
    "number": "100"
  }
}
```

**Status:**  201 Created

---

### **TESTE 9: Listar Endereços do Cliente**

**Request:**
```http
GET http://localhost:3001/order/address/user/1
Authorization: Bearer {customer_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "street": "Avenida Exemplo",
      "number": "100",
      "neighborhood": "Centro",
      "city": "Montes Claros"
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 10: Atualizar Endereço**

**Request:**
```http
PUT http://localhost:3001/order/address/1
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "number": "102",
  "complement": "Apto 202"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Endereço atualizado com sucesso"
}
```

**Status:**  200 OK

---

### **TESTE 11: Deletar Endereço**

**Request:**
```http
DELETE http://localhost:3001/order/address/1
Authorization: Bearer {customer_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Endereço excluído com sucesso"
}
```

**Status:**  200 OK

---

## ✅ Checklist de Validação

```
□ Criar pedido com múltiplos itens funciona
□ Subtotal calculado automaticamente
□ Total calculado corretamente
□ Token de 6 dígitos gerado
□ Buscar pedido retorna itens completos
□ Listar pedidos do cliente ordenado
□ Atualizar status funciona
□ Validar token correto marca entregue
□ Validar token errado retorna erro
□ Cancelar pedido funciona
□ Cadastrar endereço funciona
□ Listar endereços do cliente funciona
□ Atualizar endereço funciona
□ Deletar endereço funciona
□ Validação de CEP funciona
```

---

## 📊 Fluxo Completo do Pedido

```
1.  CRIAÇÃO
   Cliente → POST /order
   Status: pending
   Token gerado: 123456

2. PAGAMENTO
   Webhook → Status: confirmed
   
3. PREPARO
   Admin → PUT /order/1/status { "status": "preparing" }
   Status: preparing

4. PRONTO
   Admin → PUT /order/1/status { "status": "ready" }
   Status: ready

5.  SAIU PARA ENTREGA
   Admin → PUT /order/1/status { "status": "out_for_delivery" }
   Status: out_for_delivery
   Cliente recebe notificação

6. ENTREGA
   Motoboy → POST /order/1/validate-token { "token": "123456" }
   Status: delivered 
```

---

## 🚀 Exemplos de Uso

### **Cenário: Cliente Faz Pedido Completo**

```bash
# 1. Login
curl -X POST http://localhost:3001/customer/login \
  -d '{"login":"joao@email.com","senha":"Senha@123"}'

# 2.  Cadastrar endereço (se não tiver)
curl -X POST http://localhost:3001/order/address \
  -H "Authorization: Bearer {token}" \
  -d '{
    "cep":"39400000",
    "street":"Av Exemplo",
    "number":"100",
    "neighborhood":"Centro",
    "city":"Montes Claros",
    "state":"MG"
  }'

# 3. Criar pedido
curl -X POST http://localhost:3001/order \
  -H "Authorization: Bearer {token}" \
  -d '{
    "address_id":1,
    "items":[{"product_id":1,"variant_id":2,"quantity":2}],
    "payment_method":"pix",
    "delivery_fee":5.00
  }'

# 4. Acompanhar pedido
curl -X GET http://localhost:3001/order/1 \
  -H "Authorization: Bearer {token}"
```

---

## 📚 Referências Técnicas

- [NestJS Transactions](https://docs.nestjs. com/techniques/database#transactions)
- [TypeORM Relations](https://typeorm.io/relations)
- [Webhook Mercado Pago](https://www.mercadopago.com. br/developers/pt/docs/your-integrations/notifications/webhooks)

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Pedidos  

---
