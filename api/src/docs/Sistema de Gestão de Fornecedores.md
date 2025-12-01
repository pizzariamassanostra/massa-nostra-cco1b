# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 10: FORNECEDORES

---

## Sistema de Gestão de Fornecedores

**Pizzaria Massa Nostra - Módulo de Fornecedores e Pedidos de Compra**

---

## 🎯 Visão Geral

O módulo de fornecedores gerencia todo o relacionamento com fornecedores da Pizzaria Massa Nostra, desde o pré-cadastro até a gestão completa de pedidos de compra (purchase orders).  Implementa fluxo completo de cotação, aprovação, recebimento e controle financeiro de compras de insumos e ingredientes.

---

## ✨ Funcionalidades

### ✅ 1. Gestão de Fornecedores
- Pré-cadastro de fornecedores
- Cadastro completo com validação
- Listar todos os fornecedores
- Listar apenas ativos
- Buscar por ID
- Atualizar dados
- Inativar/Reativar
- Soft delete

### ✅ 2. Sistema de Cotação
- Criar cotação (quote)
- Enviar para múltiplos fornecedores
- Receber propostas
- Comparar preços e prazos
- Aprovar cotação
- Cancelar cotação

### ✅ 3.  Pedidos de Compra (Purchase Orders)
- Criar pedido de compra
- Aprovar pedido
- Confirmar pedido
- Rastrear status
- Registrar entrega
- Receber mercadorias
- Vincular nota fiscal

### ✅ 4. Status do Pedido de Compra
- `pending` - Aguardando aprovação
- `approved` - Aprovado
- `confirmed` - Confirmado pelo fornecedor
- `in_transit` - Em trânsito
- `delivered` - Entregue
- `received` - Recebido e conferido
- `cancelled` - Cancelado

### ✅ 5. Controle Financeiro
- Valores totais
- Formas de pagamento
- Prazo de pagamento
- Integração contábil
- Histórico de compras

---

## 🛣️ Endpoints da API

### **FORNECEDORES (7 endpoints)**

### **1.  Cadastrar Fornecedor**

```http
POST /supplier
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "razao_social": "Distribuidora de Alimentos LTDA",
  "nome_fantasia": "Distribuidora Central",
  "cnpj": "12345678000190",
  "inscricao_estadual": "123456789",
  "email": "contato@distribuidora.com",
  "telefone_principal": "3832210000",
  "telefone_alternativo": "3832210001",
  "site": "https://distribuidora.com.br",
  "endereco": {
    "cep": "39400000",
    "rua": "Avenida Industrial",
    "numero": "1000",
    "complemento": "Galpão 5",
    "bairro": "Distrito Industrial",
    "cidade": "Montes Claros",
    "estado": "MG",
    "ponto_referencia": "Próximo à Rodovia"
  },
  "dados_bancarios": {
    "banco": "001",
    "agencia": "1234",
    "conta": "12345-6",
    "tipo_conta": "corrente",
    "pix": "12345678000190"
  },
  "condicoes_comerciais": {
    "prazo_pagamento": 30,
    "forma_pagamento": "boleto",
    "prazo_entrega": 5,
    "pedido_minimo": 500. 00
  },
  "produtos_servicos": "Ingredientes para pizzas, queijos, frios",
  "observacoes": "Fornecedor preferencial"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Fornecedor cadastrado com sucesso",
  "data": {
    "id": 1,
    "razao_social": "Distribuidora de Alimentos LTDA",
    "nome_fantasia": "Distribuidora Central",
    "cnpj": "12345678000190",
    "email": "contato@distribuidora.com",
    "status": "active",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Validações:**
- ✅ Razão social obrigatória
- ✅ CNPJ válido e único
- ✅ Email válido
- ✅ Telefone obrigatório
- ✅ Endereço completo

---

### **2. Listar Todos os Fornecedores**

```http
GET /supplier
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "razao_social": "Distribuidora de Alimentos LTDA",
      "nome_fantasia": "Distribuidora Central",
      "cnpj": "12345678000190",
      "email": "contato@distribuidora.com",
      "telefone_principal": "3832210000",
      "status": "active",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "razao_social": "Laticínios São Paulo LTDA",
      "nome_fantasia": "Laticínios SP",
      "cnpj": "98765432000110",
      "email": "vendas@laticiniossp.com. br",
      "telefone_principal": "1133334444",
      "status": "active",
      "created_at": "2025-11-25T00:00:00.000Z"
    }
  ]
}
```

---

### **3. Listar Fornecedores Ativos**

```http
GET /supplier/active
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "nome_fantasia": "Distribuidora Central",
      "cnpj": "12345678000190",
      "telefone_principal": "3832210000"
    }
  ]
}
```

---

### **4. Buscar Fornecedor por ID**

```http
GET /supplier/{id}
Authorization: Bearer {admin_token}
```

**Exemplo:**
```http
GET /supplier/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "razao_social": "Distribuidora de Alimentos LTDA",
    "nome_fantasia": "Distribuidora Central",
    "cnpj": "12345678000190",
    "inscricao_estadual": "123456789",
    "email": "contato@distribuidora. com",
    "telefone_principal": "3832210000",
    "endereco": {
      "rua": "Avenida Industrial",
      "numero": "1000",
      "cidade": "Montes Claros",
      "estado": "MG"
    },
    "dados_bancarios": {
      "banco": "001",
      "agencia": "1234",
      "conta": "12345-6"
    },
    "status": "active",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **5. Atualizar Fornecedor**

```http
PUT /supplier/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "telefone_principal": "3832219999",
  "email": "novoemail@distribuidora.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Fornecedor atualizado com sucesso"
}
```

---

### **6. Alterar Status do Fornecedor**

```http
PUT /supplier/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "inactive"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Status atualizado com sucesso"
}
```

**Status Válidos:**
- `active` - Ativo
- `inactive` - Inativo
- `pending` - Pendente de aprovação
- `blocked` - Bloqueado

---

### **7. Deletar Fornecedor (Soft Delete)**

```http
DELETE /supplier/{id}
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Fornecedor excluído com sucesso"
}
```

---

### **COTAÇÕES (6 endpoints)**

### **8. Criar Cotação**

```http
POST /supplier/quote
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "description": "Compra de ingredientes para novembro",
  "supplier_ids": [1, 2, 3],
  "items": [
    {
      "ingredient_id": 1,
      "quantity": 100,
      "unit": "kg"
    },
    {
      "ingredient_id": 5,
      "quantity": 50,
      "unit": "kg"
    }
  ],
  "delivery_date": "2025-12-01",
  "notes": "Entrega urgente"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Cotação criada com sucesso",
  "data": {
    "id": 1,
    "quote_number": "COT-20251126-0001",
    "description": "Compra de ingredientes para novembro",
    "status": "pending",
    "suppliers": [
      {
        "id": 1,
        "name": "Distribuidora Central"
      },
      {
        "id": 2,
        "name": "Laticínios SP"
      }
    ],
    "items": [
      {
        "ingredient_id": 1,
        "name": "Mussarela",
        "quantity": 100,
        "unit": "kg"
      }
    ],
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **9. Listar Todas as Cotações**

```http
GET /supplier/quotes
Authorization: Bearer {admin_token}
```

**Filtros:**
- `? status=pending` - Por status
- `?supplier_id=1` - Por fornecedor

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "quote_number": "COT-20251126-0001",
      "description": "Compra de ingredientes",
      "status": "pending",
      "total_suppliers": 3,
      "created_at": "2025-11-26T00:00:00.000Z"
    }
  ]
}
```

---

### **10. Buscar Cotação por ID**

```http
GET /supplier/quote/{id}
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "quote_number": "COT-20251126-0001",
    "description": "Compra de ingredientes para novembro",
    "status": "pending",
    "items": [
      {
        "ingredient_id": 1,
        "name": "Mussarela",
        "quantity": 100,
        "unit": "kg",
        "proposals": [
          {
            "supplier_id": 1,
            "supplier_name": "Distribuidora Central",
            "unit_price": 45.00,
            "total_price": 4500.00,
            "delivery_days": 5
          },
          {
            "supplier_id": 2,
            "supplier_name": "Laticínios SP",
            "unit_price": 42.00,
            "total_price": 4200.00,
            "delivery_days": 7
          }
        ]
      }
    ],
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **11. Aprovar Cotação**

```http
PUT /supplier/quote/{id}/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "supplier_id": 2,
  "reason": "Melhor preço e prazo aceitável"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Cotação aprovada com sucesso",
  "data": {
    "quote_id": 1,
    "approved_supplier": {
      "id": 2,
      "name": "Laticínios SP"
    },
    "total_value": 4200.00
  }
}
```

---

### **12. Atualizar Cotação**

```http
PUT /supplier/quote/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "delivery_date": "2025-12-05",
  "notes": "Prazo estendido"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Cotação atualizada com sucesso"
}
```

---

### **13. Cancelar Cotação**

```http
PUT /supplier/quote/{id}/cancel
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Fornecedores não enviaram propostas"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Cotação cancelada com sucesso"
}
```

---

### **PEDIDOS DE COMPRA (7 endpoints)**

### **14.  Criar Pedido de Compra**

```http
POST /supplier/purchase-order
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "supplier_id": 2,
  "quote_id": 1,
  "items": [
    {
      "ingredient_id": 1,
      "quantity": 100,
      "unit_price": 42.00,
      "total_price": 4200.00
    }
  ],
  "payment_method": "boleto",
  "payment_terms": 30,
  "delivery_date": "2025-12-01",
  "notes": "Conferir validade dos produtos"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Pedido de compra criado com sucesso",
  "data": {
    "id": 1,
    "po_number": "PO-20251126-0001",
    "supplier": {
      "id": 2,
      "name": "Laticínios SP"
    },
    "total": "4200.00",
    "status": "pending",
    "delivery_date": "2025-12-01",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **15. Listar Pedidos de Compra**

```http
GET /supplier/purchase-order
Authorization: Bearer {admin_token}
```

**Filtros:**
- `?status=pending` - Por status
- `?supplier_id=2` - Por fornecedor
- `?start_date=2025-11-01` - Data inicial
- `?end_date=2025-11-30` - Data final

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "po_number": "PO-20251126-0001",
      "supplier_name": "Laticínios SP",
      "total": "4200.00",
      "status": "pending",
      "delivery_date": "2025-12-01",
      "created_at": "2025-11-26T00:00:00. 000Z"
    }
  ]
}
```

---

### **16. Buscar Pedido por ID**

```http
GET /supplier/purchase-order/{id}
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "po_number": "PO-20251126-0001",
    "supplier": {
      "id": 2,
      "razao_social": "Laticínios São Paulo LTDA",
      "cnpj": "98765432000110",
      "email": "vendas@laticiniossp.com.br"
    },
    "items": [
      {
        "ingredient_id": 1,
        "name": "Mussarela",
        "quantity": 100,
        "unit": "kg",
        "unit_price": "42.00",
        "total_price": "4200.00"
      }
    ],
    "subtotal": "4200.00",
    "total": "4200.00",
    "payment_method": "boleto",
    "payment_terms": 30,
    "delivery_date": "2025-12-01",
    "status": "pending",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **17. Aprovar Pedido de Compra**

```http
PUT /supplier/purchase-order/{id}/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "approved_by": 7,
  "notes": "Aprovado para compra"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Pedido aprovado com sucesso",
  "data": {
    "po_number": "PO-20251126-0001",
    "status": "approved",
    "approved_at": "2025-11-26T01:00:00.000Z"
  }
}
```

---

### **18. Confirmar Pedido (Fornecedor)**

```http
PUT /supplier/purchase-order/{id}/confirm
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "confirmed_delivery_date": "2025-12-01",
  "notes": "Pedido confirmado pelo fornecedor"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Pedido confirmado com sucesso",
  "data": {
    "status": "confirmed",
    "confirmed_at": "2025-11-26T02:00:00.000Z"
  }
}
```

---

### **19. Marcar Em Trânsito**

```http
PUT /supplier/purchase-order/{id}/in-transit
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "tracking_code": "BR123456789",
  "carrier": "Transportadora XYZ"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Pedido marcado como em trânsito"
}
```

---

### **20. Registrar Entrega**

```http
PUT /supplier/purchase-order/{id}/delivered
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "delivered_at": "2025-12-01T10:30:00.000Z",
  "received_by": "João Almoxarife"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Entrega registrada com sucesso"
}
```

---

### **21. Confirmar Recebimento e Conferência**

```http
PUT /supplier/purchase-order/{id}/received
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "items_received": [
    {
      "ingredient_id": 1,
      "quantity_received": 100,
      "quality_check": "approved",
      "notes": "Produtos em perfeitas condições"
    }
  ],
  "invoice_number": "NF-12345",
  "received_by": 7
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Recebimento confirmado com sucesso",
  "data": {
    "status": "received",
    "received_at": "2025-12-01T11:00:00.000Z",
    "stock_updated": true
  }
}
```

**Comportamento:**
- ✅ Atualiza status para `received`
- ✅ Registra entrada no estoque
- ✅ Vincula nota fiscal
- ✅ Gera comprovante de compra

---

### **22. Vincular Nota Fiscal**

```http
PUT /supplier/purchase-order/{id}/invoice
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "invoice_number": "NF-12345",
  "invoice_date": "2025-12-01",
  "invoice_value": 4200.00,
  "invoice_xml_url": "https://storage.com/nf-12345.xml"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Nota fiscal vinculada com sucesso"
}
```

---

## 📁 Estrutura de Arquivos

```
src/modules/supplier/
├── controllers/
│   └── supplier.controller.ts          # 20 endpoints REST
├── services/
│   ├── supplier.service.ts             # Lógica de fornecedores
│   ├── quote.service.ts                # Lógica de cotações
│   └── purchase-order.service.ts       # Lógica de POs
├── entities/
│   ├── supplier.entity.ts              # Fornecedor
│   ├── quote.entity.ts                 # Cotação
│   ├── quote-item.entity.ts            # Itens da cotação
│   ├── purchase-order.entity. ts        # Pedido de compra
│   └── purchase-order-item.entity.ts   # Itens do PO
├── dto/
│   ├── create-supplier.dto.ts
│   ├── create-quote.dto.ts
│   └── create-purchase-order.dto.ts
├── supplier.module.ts                  # Módulo NestJS
└── index.ts                            # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `suppliers`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| razao_social | VARCHAR(200) | Razão social |
| nome_fantasia | VARCHAR(200) | Nome fantasia |
| cnpj | VARCHAR(14) | CNPJ (único) |
| inscricao_estadual | VARCHAR(20) | IE |
| email | VARCHAR(200) | Email |
| telefone_principal | VARCHAR(15) | Telefone |
| telefone_alternativo | VARCHAR(15) | Telefone 2 |
| site | VARCHAR(200) | Website |
| endereco | JSONB | Endereço completo |
| dados_bancarios | JSONB | Dados bancários |
| condicoes_comerciais | JSONB | Condições |
| produtos_servicos | TEXT | Produtos/serviços |
| observacoes | TEXT | Observações |
| status | VARCHAR(20) | Status |
| created_at | TIMESTAMP | Criação |
| updated_at | TIMESTAMP | Atualização |
| deleted_at | TIMESTAMP | Soft delete |

---

### **Tabela: `quotes` (Cotações)**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| quote_number | VARCHAR(50) | Número único |
| description | TEXT | Descrição |
| supplier_ids | INTEGER[] | Array de fornecedores |
| items | JSONB | Itens solicitados |
| delivery_date | DATE | Data de entrega |
| status | VARCHAR(20) | Status |
| approved_supplier_id | INTEGER | Fornecedor aprovado |
| notes | TEXT | Observações |
| created_at | TIMESTAMP | Criação |

---

### **Tabela: `purchase_orders`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| po_number | VARCHAR(50) | Número único |
| supplier_id | INTEGER | FK supplier |
| quote_id | INTEGER | FK quote |
| items | JSONB | Itens do pedido |
| subtotal | DECIMAL(10,2) | Subtotal |
| total | DECIMAL(10,2) | Total |
| payment_method | VARCHAR(50) | Forma de pagamento |
| payment_terms | INTEGER | Prazo (dias) |
| delivery_date | DATE | Data de entrega |
| status | VARCHAR(20) | Status |
| invoice_number | VARCHAR(50) | Nota fiscal |
| tracking_code | VARCHAR(100) | Código de rastreio |
| created_at | TIMESTAMP | Criação |

---

**SQL de Criação:**
```sql
CREATE TABLE public.suppliers (
  id SERIAL PRIMARY KEY,
  razao_social VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  inscricao_estadual VARCHAR(20),
  email VARCHAR(200),
  telefone_principal VARCHAR(15) NOT NULL,
  telefone_alternativo VARCHAR(15),
  site VARCHAR(200),
  endereco JSONB,
  dados_bancarios JSONB,
  condicoes_comerciais JSONB,
  produtos_servicos TEXT,
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX idx_suppliers_cnpj ON public.suppliers(cnpj);
CREATE INDEX idx_suppliers_status ON public. suppliers(status);
```

---

## 📊 Fluxo Completo de Compra

```
1.  COTAÇÃO
   Admin → POST /supplier/quote
   Status: pending
   
2. ANÁLISE DE PROPOSTAS
   Fornecedores enviam propostas
   Admin compara preços/prazos
   
3.  APROVAÇÃO
   Admin → PUT /supplier/quote/1/approve
   Status: approved
   
4. PEDIDO DE COMPRA
   Admin → POST /supplier/purchase-order
   Status: pending
   
5.  APROVAÇÃO INTERNA
   Admin → PUT /supplier/purchase-order/1/approve
   Status: approved
   
6. CONFIRMAÇÃO DO FORNECEDOR
   Admin → PUT /supplier/purchase-order/1/confirm
   Status: confirmed
   
7. EM TRÂNSITO
   Admin → PUT /supplier/purchase-order/1/in-transit
   Status: in_transit
   
8. ENTREGA
   Admin → PUT /supplier/purchase-order/1/delivered
   Status: delivered
   
9. RECEBIMENTO
   Admin → PUT /supplier/purchase-order/1/received
   Status: received 
   Estoque atualizado automaticamente
```

---

## ✅ Checklist de Validação

```
□ Cadastrar fornecedor funciona
□ CNPJ validado e único
□ Listar fornecedores funciona
□ Filtrar ativos funciona
□ Atualizar fornecedor funciona
□ Inativar fornecedor funciona
□ Criar cotação funciona
□ Listar cotações funciona
□ Aprovar cotação funciona
□ Criar pedido de compra funciona
□ Aprovar PO funciona
□ Confirmar PO funciona
□ Registrar entrega funciona
□ Recebimento atualiza estoque
□ Vincular nota fiscal funciona
```

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0. 0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Fornecedores  

---
