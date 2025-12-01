
---

### **RELATÓRIOS E ANALYTICS**

#### **📌 OBJETIVO**
Implementar sistema completo de relatórios gerenciais e analytics para painel administrativo, permitindo análise detalhada de vendas, produtos, clientes e performance operacional da pizzaria.

---

#### **FUNCIONALIDADES IMPLEMENTADAS**

##### **1. Dashboard **
- ✅ Métricas em tempo real (hoje, semana, mês)
- ✅ Total de pedidos por período
- ✅ Receita total e ticket médio
- ✅ Top 5 produtos mais vendidos
- ✅ Últimos 10 pedidos recentes
- ✅ Percentual de crescimento

**Endpoint:**
```http
GET /reports/dashboard
Authorization: Bearer {token_admin}
```

**Resposta:**
```json
{
  "ok": true,
  "data": {
    "today": {
      "orders": 15,
      "revenue": 750.00,
      "average_ticket": 50.00
    },
    "week": {
      "orders": 120,
      "revenue": 6000.00,
      "average_ticket": 50.00,
      "growth_percentage": 0
    },
    "month": {
      "orders": 480,
      "revenue": 24000.00,
      "average_ticket": 50.00,
      "growth_percentage": 0
    },
    "top_products": [
      { "name": "Pizza Margherita", "quantity": 45 },
      { "name": "Pizza Calabresa", "quantity": 38 }
    ],
    "recent_orders": [...]
  }
}
```

---

##### **2. Relatório de Vendas**
- ✅ Filtro por período (today, week, month, year, custom)
- ✅ Filtro por status do pedido
- ✅ Filtro por forma de pagamento
- ✅ Total de pedidos e receita
- ✅ Itens vendidos
- ✅ Ticket médio
- ✅ Pedidos cancelados e receita perdida
- ✅ Distribuição por forma de pagamento (%)
- ✅ Distribuição por status
- ✅ Quebra diária de vendas

**Endpoint:**
```http
GET /reports/sales?period=month&status=all
Authorization: Bearer {token_admin}
```

**Resposta:**
```json
{
  "ok": true,
  "data": {
    "period": {
      "start_date": "2025-10-24T...",
      "end_date": "2025-11-24T..."
    },
    "summary": {
      "total_orders": 480,
      "total_revenue": 24000.00,
      "total_items_sold": 850,
      "average_ticket": 50.00,
      "cancelled_orders": 12,
      "cancelled_revenue": 600.00
    },
    "by_payment_method": [
      {
        "method": "pix",
        "count": 200,
        "total": 10000.00,
        "percentage": 41.67
      },
      {
        "method": "cartao_credito",
        "count": 180,
        "total": 9000.00,
        "percentage": 37.5
      }
    ],
    "by_status": [
      { "status": "delivered", "count": 450, "total": 22500.00 },
      { "status": "cancelled", "count": 12, "total": 600.00 }
    ],
    "daily_breakdown": [
      { "date": "2025-11-01", "orders": 15, "revenue": 750.00 },
      { "date": "2025-11-02", "orders": 18, "revenue": 900.00 }
    ]
  }
}
```

---

##### **3. Produtos Mais Vendidos**
- ✅ Filtro por período
- ✅ Limite de produtos (padrão: 10)
- ✅ Quantidade vendida
- ✅ Receita total por produto
- ✅ Percentual das vendas totais
- ✅ Preço médio
- ✅ Categoria do produto

**Endpoint:**
```http
GET /reports/top-products?period=week&limit=5
Authorization: Bearer {token_admin}
```

**Resposta:**
```json
{
  "ok": true,
  "data": {
    "period": {
      "start_date": "2025-11-17T...",
      "end_date": "2025-11-24T..."
    },
    "products": [
      {
        "product_id": 1,
        "product_name": "Pizza Margherita",
        "category": "Pizzas Tradicionais",
        "quantity_sold": 45,
        "total_revenue": 1575.00,
        "percentage_of_sales": 26.25,
        "average_price": 35.00
      }
    ]
  }
}
```

---

##### **4. Relatório de Clientes**
- ✅ Total de clientes cadastrados
- ✅ Novos clientes no período
- ✅ Clientes ativos (fizeram pedido)
- ✅ Total de pedidos no período
- ✅ Top 20 clientes (maior faturamento)
- ✅ Ticket médio por cliente
- ✅ Data do último pedido

**Endpoint:**
```http
GET /reports/customers?period=month
Authorization: Bearer {token_admin}
```

**Resposta:**
```json
{
  "ok": true,
  "data": {
    "period": {
      "start_date": "2025-10-24T...",
      "end_date": "2025-11-24T..."
    },
    "summary": {
      "total_customers": 250,
      "new_customers": 45,
      "active_customers": 120,
      "total_orders": 480
    },
    "top_customers": [
      {
        "customer_id": 15,
        "customer_name": "João Silva",
        "total_orders": 12,
        "total_spent": 600.00,
        "average_ticket": 50.00,
        "last_order_date": "2025-11-23T18:30:00.000Z"
      }
    ]
  }
}
```

---

##### **5. Horários de Pico**
- ✅ Distribuição de pedidos por hora do dia
- ✅ Distribuição de pedidos por dia da semana
- ✅ Receita por horário
- ✅ Quantidade de pedidos por período

**Endpoint:**
```http
GET /reports/peak-hours?period=week
Authorization: Bearer {token_admin}
```

**Resposta:**
```json
{
  "ok": true,
  "data": {
    "by_hour": [
      { "hour": 18, "orders": 25, "revenue": 1250.00 },
      { "hour": 19, "orders": 45, "revenue": 2250.00 },
      { "hour": 20, "orders": 38, "revenue": 1900.00 }
    ],
    "by_day_of_week": [
      { "day": "Friday", "orders": 85, "revenue": 4250.00 },
      { "day": "Saturday", "orders": 95, "revenue": 4750.00 },
      { "day": "Sunday", "orders": 70, "revenue": 3500.00 }
    ]
  }
}
```

---

##### **6. Exportação CSV**
- ✅ Exportar vendas em formato CSV
- ✅ Filtro por período
- ✅ Campos: ID, Data, Cliente, Total, Status, Pagamento
- ✅ Formato compatível com Excel/Google Sheets

**Endpoint:**
```http
GET /reports/export/sales?period=month
Authorization: Bearer {token_admin}
```

**Resposta:**
```json
{
  "ok": true,
  "filename": "vendas_2025-11-24.csv",
  "data": "ID,Data,Cliente,Total,Status,Pagamento\n1,\"2025-11-23\",\"João Silva\",75.00,delivered,pix\n2,\"2025-11-23\",\"Maria Santos\",120.50,delivered,cartao_credito\n"
}
```

**Como usar:**
```javascript
// Frontend
const response = await fetch('/reports/export/sales?period=month');
const data = await response.json();

// Criar arquivo para download
const blob = new Blob([data.data], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = data.filename;
a.click();
```

---

#### **🔒 SEGURANÇA IMPLEMENTADA**

##### **Proteção de Rotas:**
- ✅ Todos os endpoints protegidos com `JwtAuthGuard`
- ✅ Apenas administradores podem acessar
- ✅ Token JWT obrigatório em todas as requisições

##### **Validações:**
- ✅ Filtros de período validados (DTOs)
- ✅ Campos opcionais com valores padrão
- ✅ Query builders otimizados
- ✅ Soft delete respeitado em todas as queries

---

#### **📁 ARQUIVOS CRIADOS**

```
✅ src/modules/reports/interfaces/report-interfaces.ts
✅ src/modules/reports/dtos/report-filter.dto.ts
✅ src/modules/reports/services/reports.service.ts
✅ src/modules/reports/controllers/reports.controller.ts
✅ src/modules/reports/reports.module.ts
```
---

#### **📊 ENDPOINTS CRIADOS**

```
✅ GET /reports/dashboard (Dashboard executivo)
✅ GET /reports/sales (Relatório de vendas)
✅ GET /reports/top-products (Produtos mais vendidos)
✅ GET /reports/customers (Relatório de clientes)
✅ GET /reports/peak-hours (Horários de pico)
✅ GET /reports/export/sales (Exportar CSV)
```
---

#### **📊 COBERTURA DE FUNCIONALIDADES**

```
✅ Dashboard executivo          100%
✅ Relatório de vendas          100%
✅ Produtos mais vendidos       100%
✅ Relatório de clientes        100%
✅ Horários de pico             100%
✅ Exportação CSV               100%
✅ Filtros de período           100%
✅ Proteção JWT                 100%

```

---
