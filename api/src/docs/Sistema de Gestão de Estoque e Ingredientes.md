# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 11: INGREDIENTES E ESTOQUE

---

## Sistema de Gestão de Estoque e Ingredientes

**Pizzaria Massa Nostra - Módulo de Controle de Estoque com FIFO**

---

## 🎯 Visão Geral

O módulo de ingredientes e estoque gerencia todo o controle de inventário da Pizzaria Massa Nostra com sistema FIFO (First In, First Out).   Implementa gestão completa de ingredientes, movimentações de estoque, alertas automáticos de estoque mínimo, controle de validade e rastreabilidade completa de lotes.

---

## ✨ Funcionalidades

### ✅ 1. Gestão de Ingredientes
- Cadastrar ingrediente
- Listar todos os ingredientes
- Listar apenas ativos
- Buscar por ID
- Atualizar ingrediente
- Inativar/Reativar
- Soft delete

### ✅ 2. Sistema de Estoque (FIFO)
- Entrada de estoque
- Saída de estoque (FIFO automático)
- Ajuste de estoque
- Resumo de estoque por ingrediente
- Histórico de movimentações

### ✅ 3. Controle de Lotes
- Lote por entrada
- Data de validade
- Quantidade por lote
- Rastreabilidade completa
- FIFO (primeiro a vencer sai primeiro)

### ✅ 4. Sistema de Alertas
- Alerta de estoque mínimo
- Alerta de validade próxima (7 dias)
- Alerta de produto vencido
- Resolução de alertas

### ✅ 5.   Movimentações
- Tipos: `entrada`, `saida`, `ajuste`
- Histórico completo
- Filtros por ingrediente/tipo/data
- Rastreabilidade total

---

## 🛣️ Endpoints da API

### **INGREDIENTES (7 endpoints)**

### **1.  Cadastrar Ingrediente**

```http
POST /ingredient
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Mussarela",
  "description": "Queijo mussarela fatiado",
  "category": "Queijos",
  "unit": "kg",
  "minimum_stock": 50,
  "maximum_stock": 200,
  "unit_cost": 45. 00,
  "supplier_id": 2,
  "storage_location": "Geladeira 1",
  "shelf_life_days": 30
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Ingrediente cadastrado com sucesso",
  "data": {
    "id": 1,
    "name": "Mussarela",
    "category": "Queijos",
    "unit": "kg",
    "minimum_stock": 50,
    "maximum_stock": 200,
    "unit_cost": "45.00",
    "current_stock": 0,
    "status": "active",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Validações:**
- ✅ Nome obrigatório (único)
- ✅ Unidade obrigatória (kg, g, l, ml, un)
- ✅ Estoque mínimo positivo
- ✅ Custo unitário positivo
- ✅ Fornecedor deve existir

---

### **2. Listar Todos os Ingredientes**

```http
GET /ingredient
Authorization: Bearer {admin_token}
```

**Filtros:**
- `? category=Queijos` - Por categoria
- `?supplier_id=2` - Por fornecedor
- `?status=active` - Por status

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Mussarela",
      "category": "Queijos",
      "unit": "kg",
      "current_stock": 150,
      "minimum_stock": 50,
      "maximum_stock": 200,
      "unit_cost": "45.00",
      "status": "active"
    },
    {
      "id": 2,
      "name": "Tomate",
      "category": "Vegetais",
      "unit": "kg",
      "current_stock": 80,
      "minimum_stock": 30,
      "maximum_stock": 100,
      "unit_cost": "8.00",
      "status": "active"
    }
  ]
}
```

---

### **3. Listar Ingredientes Ativos**

```http
GET /ingredient/active
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Mussarela",
      "current_stock": 150,
      "unit": "kg"
    }
  ]
}
```

---

### **4. Buscar Ingrediente por ID**

```http
GET /ingredient/{id}
Authorization: Bearer {admin_token}
```

**Exemplo:**
```http
GET /ingredient/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Mussarela",
    "description": "Queijo mussarela fatiado",
    "category": "Queijos",
    "unit": "kg",
    "minimum_stock": 50,
    "maximum_stock": 200,
    "current_stock": 150,
    "unit_cost": "45. 00",
    "supplier": {
      "id": 2,
      "name": "Laticínios SP"
    },
    "storage_location": "Geladeira 1",
    "shelf_life_days": 30,
    "status": "active",
    "batches": [
      {
        "batch_number": "LOT-20251126-0001",
        "quantity": 100,
        "expiration_date": "2025-12-26",
        "days_to_expire": 30
      },
      {
        "batch_number": "LOT-20251120-0005",
        "quantity": 50,
        "expiration_date": "2025-12-20",
        "days_to_expire": 24
      }
    ],
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **5. Atualizar Ingrediente**

```http
PUT /ingredient/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "unit_cost": 48.00,
  "minimum_stock": 60
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Ingrediente atualizado com sucesso"
}
```

---

### **6. Alterar Status**

```http
PUT /ingredient/{id}/status
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

---

### **7. Deletar Ingrediente**

```http
DELETE /ingredient/{id}
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Ingrediente excluído com sucesso"
}
```

---

### **ESTOQUE (5 endpoints)**

### **8. Registrar Entrada de Estoque**

```http
POST /ingredient/stock/entry
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "ingredient_id": 1,
  "quantity": 100,
  "unit_cost": 45.00,
  "supplier_id": 2,
  "purchase_order_id": 1,
  "batch_number": "LOT-20251126-0001",
  "expiration_date": "2025-12-26",
  "invoice_number": "NF-12345",
  "notes": "Lote em perfeitas condições"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Entrada de estoque registrada com sucesso",
  "data": {
    "movement_id": 1,
    "ingredient_id": 1,
    "ingredient_name": "Mussarela",
    "quantity": 100,
    "batch_number": "LOT-20251126-0001",
    "expiration_date": "2025-12-26",
    "previous_stock": 150,
    "new_stock": 250,
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Comportamento:**
- ✅ Cria novo lote
- ✅ Incrementa estoque atual
- ✅ Registra movimentação
- ✅ Vincula a PO (se fornecido)
- ✅ Gera alerta se estoque > máximo

---

### **9.  Registrar Saída de Estoque (FIFO)**

```http
POST /ingredient/stock/exit
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "ingredient_id": 1,
  "quantity": 30,
  "reason": "Produção de pizzas",
  "order_id": 5,
  "notes": "Saída para pedidos do dia"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Saída de estoque registrada com sucesso (FIFO)",
  "data": {
    "movement_id": 2,
    "ingredient_id": 1,
    "ingredient_name": "Mussarela",
    "quantity": 30,
    "batches_used": [
      {
        "batch_number": "LOT-20251120-0005",
        "quantity_used": 30,
        "expiration_date": "2025-12-20"
      }
    ],
    "previous_stock": 250,
    "new_stock": 220,
    "created_at": "2025-11-26T00:00:00. 000Z"
  }
}
```

**Comportamento (FIFO):**
- ✅ Busca lotes ordenados por data de validade (mais antigo primeiro)
- ✅ Consome lotes na ordem FIFO
- ✅ Decrementa estoque atual
- ✅ Registra movimentação
- ✅ Gera alerta se estoque < mínimo

**Exemplo FIFO:**
```
Estoque atual:
- Lote A: 50kg (vence 20/12)
- Lote B: 100kg (vence 26/12)
- Lote C: 70kg (vence 30/12)

Saída de 120kg:
1. Retira 50kg do Lote A (esgota)
2. Retira 70kg do Lote B (sobra 30kg)

Estoque após saída:
- Lote B: 30kg (vence 26/12)
- Lote C: 70kg (vence 30/12)
```

---

### **10. Ajuste de Estoque**

```http
POST /ingredient/stock/adjustment
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "ingredient_id": 1,
  "quantity": -5,
  "reason": "Perda por validade",
  "notes": "Descarte de 5kg vencidos"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Ajuste de estoque registrado com sucesso",
  "data": {
    "movement_id": 3,
    "ingredient_id": 1,
    "quantity": -5,
    "previous_stock": 220,
    "new_stock": 215,
    "reason": "Perda por validade"
  }
}
```

**Usos:**
- Correção de inventário
- Perda por validade
- Quebra/dano
- Furto
- Doação

---

### **11. Resumo de Estoque por Ingrediente**

```http
GET /ingredient/stock/summary/{ingredientId}
Authorization: Bearer {admin_token}
```

**Exemplo:**
```http
GET /ingredient/stock/summary/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "ingredient_id": 1,
    "ingredient_name": "Mussarela",
    "current_stock": 215,
    "minimum_stock": 50,
    "maximum_stock": 200,
    "unit": "kg",
    "status": "above_max",
    "batches": [
      {
        "batch_number": "LOT-20251120-0005",
        "quantity": 20,
        "expiration_date": "2025-12-20",
        "days_to_expire": 24,
        "status": "ok"
      },
      {
        "batch_number": "LOT-20251126-0001",
        "quantity": 100,
        "expiration_date": "2025-12-26",
        "days_to_expire": 30,
        "status": "ok"
      },
      {
        "batch_number": "LOT-20251125-0003",
        "quantity": 95,
        "expiration_date": "2025-12-25",
        "days_to_expire": 29,
        "status": "ok"
      }
    ],
    "total_batches": 3,
    "oldest_batch": {
      "batch_number": "LOT-20251120-0005",
      "days_to_expire": 24
    },
    "value_in_stock": "9675.00"
  }
}
```

**Status Possíveis:**
- `critical` - Estoque < mínimo
- `low` - Estoque entre mínimo e (mínimo + 20%)
- `ok` - Estoque normal
- `above_max` - Estoque > máximo

---

### **12. Consultar Estoque de Ingrediente**

```http
GET /ingredient/stock/{ingredientId}
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "ingredient_id": 1,
    "name": "Mussarela",
    "current_stock": 215,
    "unit": "kg",
    "batches": [
      {
        "batch_number": "LOT-20251120-0005",
        "quantity": 20,
        "expiration_date": "2025-12-20"
      }
    ]
  }
}
```

---

### **MOVIMENTAÇÕES (4 endpoints)**

### **13. Listar Todas as Movimentações**

```http
GET /ingredient/movements
Authorization: Bearer {admin_token}
```

**Filtros:**
- `?ingredient_id=1` - Por ingrediente
- `?type=entrada` - Por tipo (entrada, saida, ajuste)
- `?start_date=2025-11-01` - Data inicial
- `?end_date=2025-11-30` - Data final

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "ingredient_name": "Mussarela",
      "type": "entrada",
      "quantity": 100,
      "batch_number": "LOT-20251126-0001",
      "user": "Admin",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "ingredient_name": "Mussarela",
      "type": "saida",
      "quantity": 30,
      "reason": "Produção de pizzas",
      "user": "Admin",
      "created_at": "2025-11-26T02:00:00.000Z"
    },
    {
      "id": 3,
      "ingredient_name": "Mussarela",
      "type": "ajuste",
      "quantity": -5,
      "reason": "Perda por validade",
      "user": "Admin",
      "created_at": "2025-11-26T03:00:00.000Z"
    }
  ]
}
```

---

### **14. Buscar Movimentação por ID**

```http
GET /ingredient/movement/{id}
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "ingredient": {
      "id": 1,
      "name": "Mussarela"
    },
    "type": "entrada",
    "quantity": 100,
    "unit_cost": "45.00",
    "total_cost": "4500.00",
    "supplier": {
      "id": 2,
      "name": "Laticínios SP"
    },
    "batch_number": "LOT-20251126-0001",
    "expiration_date": "2025-12-26",
    "invoice_number": "NF-12345",
    "notes": "Lote em perfeitas condições",
    "user": {
      "id": 7,
      "name": "Administrador"
    },
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **ALERTAS (4 endpoints)**

### **15.  Listar Alertas Ativos**

```http
GET /ingredient/alerts
Authorization: Bearer {admin_token}
```

**Filtros:**
- `?type=low_stock` - Tipo (low_stock, expiring, expired)
- `?status=active` - Status (active, resolved)
- `?ingredient_id=1` - Por ingrediente

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "summary": {
      "total_alerts": 15,
      "critical": 5,
      "warning": 10
    },
    "alerts": [
      {
        "id": 1,
        "type": "low_stock",
        "severity": "critical",
        "ingredient": {
          "id": 5,
          "name": "Tomate"
        },
        "message": "Estoque crítico: 15kg (mínimo: 30kg)",
        "current_stock": 15,
        "minimum_stock": 30,
        "status": "active",
        "created_at": "2025-11-26T00:00:00.000Z"
      },
      {
        "id": 2,
        "type": "expiring",
        "severity": "warning",
        "ingredient": {
          "id": 1,
          "name": "Mussarela"
        },
        "batch_number": "LOT-20251120-0005",
        "message": "Lote vence em 3 dias (20/12/2025)",
        "quantity": 20,
        "expiration_date": "2025-12-20",
        "days_to_expire": 3,
        "status": "active",
        "created_at": "2025-11-23T00:00:00.000Z"
      },
      {
        "id": 3,
        "type": "expired",
        "severity": "critical",
        "ingredient": {
          "id": 8,
          "name": "Presunto"
        },
        "batch_number": "LOT-20251115-0002",
        "message": "Lote vencido há 4 dias",
        "quantity": 10,
        "expiration_date": "2025-11-22",
        "days_expired": 4,
        "status": "active",
        "created_at": "2025-11-22T00:00:00.000Z"
      }
    ]
  }
}
```

**Tipos de Alerta:**
- `low_stock` - Estoque abaixo do mínimo
- `expiring` - Validade próxima (7 dias)
- `expired` - Produto vencido
- `above_max` - Estoque acima do máximo

**Severidade:**
- `critical` - Ação urgente
- `warning` - Atenção necessária
- `info` - Informativo

---

### **16. Resolver Alerta**

```http
PUT /ingredient/alert/{id}/resolve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action_taken": "Compra emergencial realizada",
  "notes": "Pedido #PO-20251126-0005 criado"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Alerta resolvido com sucesso",
  "data": {
    "alert_id": 1,
    "status": "resolved",
    "resolved_by": 7,
    "resolved_at": "2025-11-26T10:00:00.000Z"
  }
}
```

---

## 📁 Estrutura de Arquivos

```
src/modules/ingredient/
├── controllers/
│   └── ingredient.controller.ts        # 16 endpoints REST
├── services/
│   ├── ingredient.service.ts           # Lógica de ingredientes
│   ├── stock.service.ts                # Lógica de estoque (FIFO)
│   ├── movement.service.ts             # Movimentações
│   └── alert.service.ts                # Sistema de alertas
├── entities/
│   ├── ingredient.entity.ts            # Ingrediente
│   ├── stock-batch.entity.ts           # Lote de estoque
│   ├── stock-movement.entity. ts        # Movimentação
│   └── stock-alert.entity.ts           # Alerta
├── dto/
│   ├── create-ingredient.dto.ts
│   ├── stock-entry.dto.ts
│   ├── stock-exit.dto. ts
│   └── stock-adjustment.dto.ts
├── ingredient. module.ts                # Módulo NestJS
└── index.ts                            # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `ingredients`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| name | VARCHAR(200) | Nome (único) |
| description | TEXT | Descrição |
| category | VARCHAR(100) | Categoria |
| unit | VARCHAR(20) | Unidade (kg, g, l, ml, un) |
| minimum_stock | DECIMAL(10,2) | Estoque mínimo |
| maximum_stock | DECIMAL(10,2) | Estoque máximo |
| current_stock | DECIMAL(10,2) | Estoque atual |
| unit_cost | DECIMAL(10,2) | Custo unitário |
| supplier_id | INTEGER | FK supplier |
| storage_location | VARCHAR(100) | Local de armazenamento |
| shelf_life_days | INTEGER | Validade (dias) |
| status | VARCHAR(20) | Status |
| created_at | TIMESTAMP | Criação |
| updated_at | TIMESTAMP | Atualização |
| deleted_at | TIMESTAMP | Soft delete |

---

### **Tabela: `stock_batches`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| ingredient_id | INTEGER | FK ingredient |
| batch_number | VARCHAR(50) | Número do lote |
| quantity | DECIMAL(10,2) | Quantidade |
| unit_cost | DECIMAL(10,2) | Custo unitário |
| expiration_date | DATE | Data de validade |
| supplier_id | INTEGER | FK supplier |
| purchase_order_id | INTEGER | FK purchase_order |
| invoice_number | VARCHAR(50) | Nota fiscal |
| created_at | TIMESTAMP | Data de entrada |

---

### **Tabela: `stock_movements`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| ingredient_id | INTEGER | FK ingredient |
| type | VARCHAR(20) | entrada/saida/ajuste |
| quantity | DECIMAL(10,2) | Quantidade |
| unit_cost | DECIMAL(10,2) | Custo unitário |
| batch_number | VARCHAR(50) | Número do lote |
| supplier_id | INTEGER | FK supplier |
| purchase_order_id | INTEGER | FK purchase_order |
| order_id | INTEGER | FK order (saída) |
| reason | VARCHAR(200) | Motivo |
| notes | TEXT | Observações |
| user_id | INTEGER | Usuário |
| created_at | TIMESTAMP | Data/hora |

---

### **Tabela: `stock_alerts`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| ingredient_id | INTEGER | FK ingredient |
| batch_id | INTEGER | FK stock_batch |
| type | VARCHAR(20) | Tipo do alerta |
| severity | VARCHAR(20) | critical/warning/info |
| message | TEXT | Mensagem |
| status | VARCHAR(20) | active/resolved |
| resolved_by | INTEGER | Usuário |
| resolved_at | TIMESTAMP | Data resolução |
| action_taken | TEXT | Ação tomada |
| created_at | TIMESTAMP | Criação |

---

**SQL de Criação:**
```sql
CREATE TABLE public.ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  unit VARCHAR(20) NOT NULL,
  minimum_stock DECIMAL(10, 2) DEFAULT 0,
  maximum_stock DECIMAL(10, 2),
  current_stock DECIMAL(10, 2) DEFAULT 0,
  unit_cost DECIMAL(10, 2),
  supplier_id INTEGER,
  storage_location VARCHAR(100),
  shelf_life_days INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  CONSTRAINT fk_ingredients_supplier 
    FOREIGN KEY (supplier_id) 
    REFERENCES suppliers(id)
);

CREATE TABLE public.stock_batches (
  id SERIAL PRIMARY KEY,
  ingredient_id INTEGER NOT NULL,
  batch_number VARCHAR(50) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_cost DECIMAL(10, 2),
  expiration_date DATE,
  supplier_id INTEGER,
  purchase_order_id INTEGER,
  invoice_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_batches_ingredient 
    FOREIGN KEY (ingredient_id) 
    REFERENCES ingredients(id),
  
  CONSTRAINT fk_batches_supplier 
    FOREIGN KEY (supplier_id) 
    REFERENCES suppliers(id)
);

CREATE TABLE public.stock_movements (
  id SERIAL PRIMARY KEY,
  ingredient_id INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_cost DECIMAL(10, 2),
  batch_number VARCHAR(50),
  supplier_id INTEGER,
  purchase_order_id INTEGER,
  order_id INTEGER,
  reason VARCHAR(200),
  notes TEXT,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_movements_ingredient 
    FOREIGN KEY (ingredient_id) 
    REFERENCES ingredients(id)
);

CREATE TABLE public.stock_alerts (
  id SERIAL PRIMARY KEY,
  ingredient_id INTEGER NOT NULL,
  batch_id INTEGER,
  type VARCHAR(20) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  resolved_by INTEGER,
  resolved_at TIMESTAMP,
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_alerts_ingredient 
    FOREIGN KEY (ingredient_id) 
    REFERENCES ingredients(id),
  
  CONSTRAINT fk_alerts_batch 
    FOREIGN KEY (batch_id) 
    REFERENCES stock_batches(id)
);

-- Índices
CREATE INDEX idx_ingredients_name ON public.ingredients(name);
CREATE INDEX idx_ingredients_status ON public.ingredients(status);
CREATE INDEX idx_batches_ingredient ON public.stock_batches(ingredient_id);
CREATE INDEX idx_batches_expiration ON public.stock_batches(expiration_date);
CREATE INDEX idx_movements_ingredient ON public.stock_movements(ingredient_id);
CREATE INDEX idx_movements_type ON public.stock_movements(type);
CREATE INDEX idx_alerts_status ON public.stock_alerts(status);
```

---

## 🔄 Algoritmo FIFO (First In, First Out)

### **Lógica de Saída**

```typescript
async exitStock(ingredientId: number, quantityNeeded: number) {
  // 1. Buscar lotes ordenados por data de validade (mais antigo primeiro)
  const batches = await this.batchRepo.find({
    where: {
      ingredient_id: ingredientId,
      quantity: MoreThan(0)
    },
    order: {
      expiration_date: 'ASC'  // FIFO: primeiro a vencer sai primeiro
    }
  });

  let remainingQuantity = quantityNeeded;
  const batchesUsed = [];

  // 2. Consumir lotes na ordem FIFO
  for (const batch of batches) {
    if (remainingQuantity <= 0) break;

    const quantityToTake = Math.min(batch.quantity, remainingQuantity);

    // Atualizar quantidade do lote
    batch.quantity -= quantityToTake;
    await this.batchRepo.save(batch);

    // Registrar lote usado
    batchesUsed.push({
      batch_number: batch.batch_number,
      quantity_used: quantityToTake,
      expiration_date: batch.expiration_date
    });

    remainingQuantity -= quantityToTake;
  }

  // 3. Validar se havia estoque suficiente
  if (remainingQuantity > 0) {
    throw new Error('Estoque insuficiente');
  }

  return batchesUsed;
}
```

---

## 📊 Sistema de Alertas Automáticos

### **Tipos de Verificação (Cron Jobs)**

```typescript
// Executado diariamente às 06:00
@Cron('0 6 * * *')
async checkStockLevels() {
  const ingredients = await this.ingredientRepo. find();

  for (const ingredient of ingredients) {
    // Alerta de estoque mínimo
    if (ingredient. current_stock < ingredient.minimum_stock) {
      await this.createAlert({
        ingredient_id: ingredient. id,
        type: 'low_stock',
        severity: 'critical',
        message: `Estoque crítico: ${ingredient.current_stock}${ingredient.unit} (mínimo: ${ingredient. minimum_stock}${ingredient.unit})`
      });
    }

    // Alerta de estoque acima do máximo
    if (ingredient.current_stock > ingredient. maximum_stock) {
      await this.createAlert({
        ingredient_id: ingredient.id,
        type: 'above_max',
        severity: 'warning',
        message: `Estoque acima do máximo: ${ingredient.current_stock}${ingredient.unit} (máximo: ${ingredient.maximum_stock}${ingredient.unit})`
      });
    }
  }
}

// Executado diariamente às 07:00
@Cron('0 7 * * *')
async checkExpirationDates() {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  // Lotes vencendo em 7 dias
  const expiringBatches = await this.batchRepo.find({
    where: {
      expiration_date: Between(today, sevenDaysFromNow),
      quantity: MoreThan(0)
    }
  });

  for (const batch of expiringBatches) {
    const daysToExpire = Math.ceil(
      (batch.expiration_date. getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    await this.createAlert({
      ingredient_id: batch.ingredient_id,
      batch_id: batch.id,
      type: 'expiring',
      severity: daysToExpire <= 3 ? 'critical' : 'warning',
      message: `Lote vence em ${daysToExpire} dias (${batch.expiration_date})`
    });
  }

  // Lotes vencidos
  const expiredBatches = await this.batchRepo.find({
    where: {
      expiration_date: LessThan(today),
      quantity: MoreThan(0)
    }
  });

  for (const batch of expiredBatches) {
    const daysExpired = Math.ceil(
      (today.getTime() - batch.expiration_date.getTime()) / (1000 * 60 * 60 * 24)
    );

    await this. createAlert({
      ingredient_id: batch.ingredient_id,
      batch_id: batch.id,
      type: 'expired',
      severity: 'critical',
      message: `Lote vencido há ${daysExpired} dias - DESCARTE IMEDIATO`
    });
  }
}
```

---

## ✅ Checklist de Validação (30/30 Testes)

```
INGREDIENTES (7/7)
□ Cadastrar ingrediente funciona
□ Listar todos funciona
□ Listar ativos funciona
□ Buscar por ID funciona
□ Atualizar funciona
□ Alterar status funciona
□ Deletar funciona

ESTOQUE (5/5)
□ Entrada de estoque cria lote
□ Saída FIFO funciona corretamente
□ Ajuste de estoque funciona
□ Resumo de estoque correto
□ Consultar estoque funciona

MOVIMENTAÇÕES (4/4)
□ Listar movimentações funciona
□ Filtrar por tipo funciona
□ Filtrar por data funciona
□ Buscar por ID funciona

ALERTAS (4/4)
□ Alerta de estoque mínimo gerado
□ Alerta de validade próxima gerado
□ Alerta de vencido gerado
□ Resolver alerta funciona

FIFO (5/5)
□ Lotes ordenados por validade
□ Saída consome lote mais antigo
□ Múltiplos lotes consumidos corretamente
□ Lote esgotado removido
□ Estoque insuficiente retorna erro

INTEGRAÇÃO (5/5)
□ Entrada vinculada a PO
□ Saída vinculada a pedido
□ Nota fiscal registrada
□ Fornecedor vinculado
□ Estoque atualizado em tempo real
```

---

## 🎯 KPIs do Estoque

```typescript
interface StockKPIs {
  // Giro de estoque
  stock_turnover: number;          // Giro/ano
  average_days_in_stock: number;   // Dias médios
  
  // Perdas
  expired_loss: number;            // Valor perdido (vencimento)
  waste_percentage: number;        // % de desperdício
  
  // Eficiência
  accuracy_rate: number;           // Taxa de precisão (%)
  fill_rate: number;               // Taxa de atendimento (%)
  
  // Financeiro
  inventory_value: number;         // Valor total em estoque
  carrying_cost: number;           // Custo de manutenção
}
```

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa (30/30 testes) |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Ingredientes e Estoque  

---
