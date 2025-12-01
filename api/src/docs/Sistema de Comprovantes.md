# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 8: COMPROVANTES

---

## Sistema de Comprovantes

**Pizzaria Massa Nostra - Módulo de Geração de Comprovantes em PDF**

---

## 🎯 Visão Geral

O módulo de comprovantes gerencia a geração automática de comprovantes de compra em formato PDF para a Pizzaria Massa Nostra.  Cria um snapshot (fotografia) do pedido no momento da compra, incluindo dados do cliente, itens, valores e forma de pagamento, garantindo rastreabilidade e conformidade fiscal.

---

## ✨ Funcionalidades

### ✅ 1. Geração Automática
- Geração automática após pagamento confirmado
- Snapshot completo do pedido
- Dados do cliente no momento da compra
- Itens com preços fixos (histórico)

### ✅ 2. Formato PDF
- Documento profissional em PDF
- Layout padronizado
- Cabeçalho com logo da pizzaria
- Tabela de itens formatada
- Totais destacados
- Rodapé informativo

### ✅ 3. Numeração Única
- Formato: `REC-YYYYMMDD-XXXX`
- Sequência diária reiniciável
- Rastreabilidade completa
- Número único por pedido

### ✅ 4. Gestão de Comprovantes
- Buscar por pedido
- Buscar por número
- Download em PDF
- Reemissão
- Histórico completo

### ✅ 5.  Armazenamento
- Banco de dados (snapshot)
- Geração on-demand de PDF
- Opcional: Upload para Cloudinary
- Sistema de cache

---

## 🛣️ Endpoints da API

### **1. Buscar Comprovante por Pedido (JSON)**

```http
GET /receipt/order/{orderId}
Authorization: Bearer {token}
```

**Exemplo:**
```http
GET /receipt/order/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "receipt_number": "REC-20251126-0001",
    "order_id": 1,
    "customer_name": "João Silva",
    "customer_cpf": "12345678900",
    "customer_email": "joao@email.com",
    "items_json": "[{\"product_name\":\"Pizza Marguerita\",\"variant_name\":\"Média\",\"quantity\":2,\"unit_price\":40.00,\"total_price\":80.00}]",
    "subtotal": "90.00",
    "delivery_fee": "5.00",
    "discount": "0.00",
    "total": "95.00",
    "payment_method": "pix",
    "issue_date": "2025-11-26T00:15:00. 000Z",
    "created_at": "2025-11-26T00:15:00.000Z"
  }
}
```

---

### **2. Download de Comprovante em PDF**

```http
GET /receipt/order/{orderId}/pdf
Authorization: Bearer {token}
```

**Exemplo:**
```http
GET /receipt/order/1/pdf
```

**Resposta de Sucesso (200):**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="comprovante-REC-20251126-0001.pdf"`
- **Body:** Buffer do PDF

**Comportamento:**
- ✅ Download automático do arquivo
- ✅ Nome: `comprovante-{receipt_number}.pdf`
- ✅ Tamanho: ~20-50 KB
- ✅ Formato: A4 (210x297mm)

---

### **3.  Buscar por Número do Comprovante**

```http
GET /receipt/number/{receiptNumber}
Authorization: Bearer {token}
```

**Exemplo:**
```http
GET /receipt/number/REC-20251126-0001
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "receipt_number": "REC-20251126-0001",
    "customer_name": "João Silva",
    "total": "95.00",
    "payment_method": "pix",
    "issue_date": "2025-11-26T00:15:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "ok": false,
  "errors": [{
    "message": "Comprovante REC-20251126-0001 não encontrado"
  }]
}
```

---

### **4.  Reemitir Comprovante**

```http
GET /receipt/reissue/{orderId}
Authorization: Bearer {token}
```

**Exemplo:**
```http
GET /receipt/reissue/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Comprovante reemitido com sucesso",
  "data": {
    "id": 1,
    "receipt_number": "REC-20251126-0001",
    "total": "95.00",
    "issue_date": "2025-11-26T00:15:00.000Z"
  }
}
```

**Comportamento:**
- ✅ Retorna comprovante existente (se houver)
- ✅ Gera novo comprovante (se não existir)
- ✅ Não duplica comprovantes

---

## 📁 Estrutura de Arquivos

```
src/modules/receipt/
├── controllers/
│   └── receipt.controller.ts           # 4 endpoints REST
├── services/
│   └── receipt.service.ts              # Lógica de comprovantes
├── repositories/
│   └── receipt. repository.ts           # Acesso ao banco
├── entities/
│   └── receipt. entity.ts               # Entidade de comprovante
├── dto/
│   └── (não possui - geração automática)
├── receipt.module.ts                   # Módulo NestJS
└── index.ts                            # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `receipts`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do comprovante |
| order_id | INTEGER | FK para orders (UNIQUE) |
| receipt_number | VARCHAR(50) | Número único (REC-YYYYMMDD-XXXX) |
| customer_name | VARCHAR(255) | Nome do cliente (snapshot) |
| customer_cpf | VARCHAR(14) | CPF do cliente (snapshot) |
| customer_email | VARCHAR(255) | Email do cliente (snapshot) |
| items_json | TEXT | Itens em JSON (snapshot) |
| subtotal | DECIMAL(10,2) | Subtotal do pedido |
| delivery_fee | DECIMAL(10,2) | Taxa de entrega |
| discount | DECIMAL(10,2) | Desconto aplicado |
| total | DECIMAL(10,2) | Total final |
| payment_method | VARCHAR(50) | Forma de pagamento |
| pdf_url | VARCHAR(500) | URL do PDF (Cloudinary) |
| was_emailed | BOOLEAN | Se foi enviado por email |
| emailed_at | TIMESTAMP | Data de envio do email |
| issue_date | TIMESTAMP | Data de emissão |
| created_at | TIMESTAMP | Data de criação |

**Índices:**
- `idx_receipts_order` (order_id) - UNIQUE
- `idx_receipts_number` (receipt_number) - UNIQUE
- `idx_receipts_created` (created_at DESC)

**Constraints:**
- `UNIQUE` em order_id (um pedido = um comprovante)
- `UNIQUE` em receipt_number
- `FOREIGN KEY` para orders

**SQL de Criação:**
```sql
CREATE TABLE public.receipts (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL UNIQUE,
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_cpf VARCHAR(14),
  customer_email VARCHAR(255),
  items_json TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  pdf_url VARCHAR(500),
  was_emailed BOOLEAN DEFAULT FALSE,
  emailed_at TIMESTAMP,
  issue_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_receipts_order 
    FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE RESTRICT
);

CREATE UNIQUE INDEX idx_receipts_order ON public.receipts(order_id);
CREATE UNIQUE INDEX idx_receipts_number ON public. receipts(receipt_number);
CREATE INDEX idx_receipts_created ON public.receipts(created_at DESC);

COMMENT ON TABLE public.receipts IS 'Comprovantes de compra gerados após pagamento';
COMMENT ON COLUMN public.receipts.receipt_number IS 'Número único do comprovante (REC-YYYYMMDD-XXXX)';
COMMENT ON COLUMN public.receipts.items_json IS 'Snapshot dos itens do pedido em JSON';
COMMENT ON COLUMN public.receipts.subtotal IS 'Soma dos itens sem taxa de entrega';
COMMENT ON COLUMN public.receipts.total IS 'Valor final = subtotal + delivery_fee - discount';
```

---

## 🔢 Sistema de Numeração

### **Formato do Número**

```
REC-YYYYMMDD-XXXX

REC      = Prefixo (Receipt)
YYYYMMDD = Data (Ano-Mês-Dia)
XXXX     = Sequência (0001, 0002, ...)

Exemplos:
- REC-20251126-0001 (primeiro do dia)
- REC-20251126-0002 (segundo do dia)
- REC-20251127-0001 (reinicia no dia seguinte)
```

### **Geração Automática**

```typescript
async generateReceiptNumber(): Promise<string> {
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
    . getOne();

  // Definir próxima sequência
  let sequence = 1;
  if (lastReceipt) {
    const lastNumber = lastReceipt.receipt_number. split('-').pop();
    sequence = parseInt(lastNumber || '0', 10) + 1;
  }

  // Retornar número formatado
  return `REC-${dateStr}-${String(sequence).padStart(4, '0')}`;
}
```

---

## 📄 Estrutura do PDF

### **Layout Completo**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│             PIZZARIA MASSA NOSTRA               │
│           CNPJ: 12. 345.678/0001-90             │
│       Avenida Exemplo, 1000 - Centro - MG       │
│           Telefone: (38) 3221-0000              │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│         COMPROVANTE DE COMPRA                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Número: REC-20251126-0001                       │
│ Data: 26/11/2025, 00:15:00                      │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ DADOS DO CLIENTE                                │
│                                                 │
│ Nome: João Silva                                │
│ CPF: 123.456.789-00                             │
│ Email: joao@email.com                           │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ITENS DO PEDIDO                                 │
│                                                 │
│ Item                     Qtd  Valor Un.    Total│
│ ────────────────────────────────────────────────│
│ Pizza Marguerita (Média)  2   R$ 40,00  R$ 80,00│
│ Coca-Cola 2L              1   R$ 10,00  R$ 10,00│
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│                      Subtotal:      R$ 90,00    │
│                Taxa de Entrega:      R$  5,00   │
│                                                 │
│                         TOTAL:      R$ 95,00    │
│                                                 │
│ Forma de Pagamento: PIX                         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│     Obrigado pela preferência!  Volte sempre!   │
│    Este documento não possui valor fiscal       │
│   Documento gerado em 26/11/2025, 00:15:01      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 💾 Sistema de Snapshot

### **Por Que Snapshot?**

```typescript
// ERRADO: Buscar dados em tempo real
const receipt = {
  customer_name: order.customer.nome_completo,  // Se cliente atualizar perfil, muda!
  items: order.items.map(item => ({
    name: item.product. name,                    // Se produto mudar nome, muda!
    price: item.product.base_price              // Se preço mudar, muda! 
  }))
};

// CORRETO: Snapshot no momento da compra
const receipt = {
  customer_name: 'João Silva',                  // Fixo para sempre
  items_json: JSON.stringify([
    {
      product_name: 'Pizza Marguerita',         // Fixo para sempre
      unit_price: 40.00                          // Fixo para sempre
    }
  ])
};
```

**Vantagens:**
- ✅ Histórico fiel ao momento da compra
- ✅ Independente de mudanças futuras
- ✅ Rastreabilidade total
- ✅ Conformidade fiscal

---

## 📊 Estrutura do JSON de Itens

```typescript
interface ReceiptItem {
  product_name: string;      // "Pizza Marguerita"
  variant_name: string;      // "Média"
  quantity: number;          // 2
  unit_price: number;        // 40.00
  total_price: number;       // 80. 00
  observations?: string;     // "Sem cebola"
}

// Exemplo completo:
const items_json = JSON.stringify([
  {
    "product_name": "Pizza Marguerita",
    "variant_name": "Média",
    "quantity": 2,
    "unit_price": 40.00,
    "total_price": 80.00,
    "observations": "Sem cebola"
  },
  {
    "product_name": "Coca-Cola 2L",
    "variant_name": "Padrão",
    "quantity": 1,
    "unit_price": 10.00,
    "total_price": 10.00
  }
]);
```

---

## 🧪 Testes Completos

### **TESTE 1: Buscar Comprovante por Pedido (JSON)**

**Pré-requisito:** Comprovante criado para pedido #1

```sql
-- Verificar se existe
SELECT * FROM receipts WHERE order_id = 1;
```

**Request:**
```http
GET http://localhost:3001/receipt/order/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... 
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "receipt_number": "REC-20251125-0001",
    "customer_name": "João Silva Teste",
    "total": "50.00",
    "payment_method": "pix",
    "issue_date": "2025-11-26T01:28:49.243Z",
    "created_at": "2025-11-26T01:28:49.243Z"
  }
}
```

**Status:**  200 OK

---

### **TESTE 2: Download de PDF**

**Request:**
```http
GET http://localhost:3001/receipt/order/1/pdf
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... 
```

**Expected Response:**
- ✅ **Status:** 200 OK
- ✅ **Content-Type:** `application/pdf`
- ✅ **Content-Disposition:** `attachment; filename="comprovante-REC-20251125-0001.pdf"`
- ✅ **Body:** Buffer do PDF (binário)

**Validação:**
- ✅ Arquivo baixa automaticamente
- ✅ Nome: `comprovante-REC-20251125-0001. pdf`
- ✅ Tamanho: ~20-50 KB
- ✅ Abre corretamente no Adobe Reader/Chrome

---

### **TESTE 3: Conteúdo do PDF**

**Abrir PDF e Validar:**

```
✅ Cabeçalho:
   - PIZZARIA MASSA NOSTRA
   - CNPJ: 12.345.678/0001-90
   - Endereço completo
   - Telefone: (38) 3221-0000

✅ Título:
   - COMPROVANTE DE COMPRA

✅ Informações:
   - Número: REC-20251125-0001
   - Data: 25/11/2025, 22:28:49

✅ Dados do Cliente:
   - Nome: João Silva Teste
   - CPF: 12345678900
   - Email: joao@teste.com

✅ Tabela de Itens:
   - Cabeçalho: Item | Qtd | Valor Un. | Total
   - Pizza Marguerita (Grande)
   - Qtd: 1
   - Valor Un.: R$ 45,00
   - Total: R$ 45,00

✅ Totais:
   - Subtotal: R$ 45,00
   - Taxa de Entrega: R$ 5,00
   - TOTAL: R$ 50,00

✅ Forma de Pagamento:
   - PIX

✅ Rodapé:
   - "Obrigado pela preferência!  Volte sempre!"
   - "Este documento não possui valor fiscal"
   - Data de geração
```

---

### **TESTE 4: Buscar por Número**

**Request:**
```http
GET http://localhost:3001/receipt/number/REC-20251125-0001
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "receipt_number": "REC-20251125-0001",
    "customer_name": "João Silva Teste",
    "total": "50.00"
  }
}
```

**Status:**  200 OK

---

### **TESTE 5: Buscar Número Inexistente**

**Request:**
```http
GET http://localhost:3001/receipt/number/REC-20251126-9999
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Comprovante REC-20251126-9999 não encontrado"
  }]
}
```

**Status:**  404 Not Found

---

### **TESTE 6: Reemitir Comprovante Existente**

**Request:**
```http
GET http://localhost:3001/receipt/reissue/1
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Comprovante reemitido com sucesso",
  "data": {
    "receipt_number": "REC-20251125-0001",
    "total": "50.00"
  }
}
```

**Status:**  200 OK

**Validação no Banco:**
```sql
SELECT COUNT(*) FROM receipts WHERE order_id = 1;
-- Deve retornar: 1 (não duplica)
```

---

### **TESTE 7: Geração Automática de Numeração**

**Cenário:** Criar 3 comprovantes no mesmo dia

```sql
-- Inserir 3 comprovantes de teste
INSERT INTO receipts (
  order_id, receipt_number, customer_name, items_json,
  subtotal, delivery_fee, discount, total, payment_method, issue_date
) VALUES
  (10, 'REC-20251126-0001', 'Cliente 1', '[]', 50, 5, 0, 55, 'pix', NOW()),
  (11, 'REC-20251126-0002', 'Cliente 2', '[]', 60, 5, 0, 65, 'credit_card', NOW()),
  (12, 'REC-20251126-0003', 'Cliente 3', '[]', 70, 5, 0, 75, 'cash', NOW());

-- Verificar sequência
SELECT receipt_number FROM receipts 
WHERE receipt_number LIKE 'REC-20251126%'
ORDER BY id;
```

**Expected Result:**
```
REC-20251126-0001
REC-20251126-0002
REC-20251126-0003
```

**Status:** Pass

---

## ✅ Checklist de Validação

```
□ Buscar comprovante por pedido funciona
□ Download de PDF funciona
□ PDF abre sem corromper
□ PDF contém todas as informações
□ Numeração única gerada corretamente
□ Sequência diária funciona
□ Buscar por número funciona
□ Reemitir não duplica comprovantes
□ Snapshot de dados funciona
□ Itens em JSON corretos
□ Valores calculados corretamente
□ Layout do PDF profissional
□ Rodapé informativo presente
□ Dados do cliente corretos
```

---

## 📊 Fluxo de Geração

```
┌─────────────────────────┐
│   Webhook MP            │
│  (payment. approved)    │
└──────┬──────────────────┘
       │ 1. Pagamento confirmado
       ▼
┌─────────────────────────┐
│   PaymentService        │
│  ├─ Atualiza payment    │
│  └─ Atualiza order      │
└──────┬──────────────────┘
       │ 2. Order: confirmed
       ▼
┌─────────────────────────┐
│   ReceiptService        │
│  ├─ Gera número único   │
│  ├─ Cria snapshot       │
│  └─ Salva no banco      │
└──────┬──────────────────┘
       │ 3. Comprovante criado
       ▼
┌─────────────────────────┐
│   Cliente               │
│  ├─ Recebe notificação  │
│  └─ Baixa PDF           │
└─────────────────────────┘

┌─────────────────────────┐
│   Cliente (futuro)      │
│  ├─ GET /receipt/order/1│
│  └─ Download PDF        │
└─────────────────────────┘
```

---

## 🚀 Exemplos de Uso

### **Cenário: Cliente Baixa Comprovante**

```bash
# 1. Login
curl -X POST http://localhost:3001/customer/login \
  -d '{"login":"joao@email.com","senha":"Senha@123"}'

# 2.  Ver comprovante (JSON)
curl http://localhost:3001/receipt/order/1 \
  -H "Authorization: Bearer {token}"

# 3.  Baixar PDF
curl http://localhost:3001/receipt/order/1/pdf \
  -H "Authorization: Bearer {token}" \
  -o comprovante.pdf

# 4. Abrir PDF
xdg-open comprovante.pdf  # Linux
open comprovante.pdf      # macOS
start comprovante.pdf     # Windows
```

---

## 📚 Referências Técnicas

- [PDFKit Documentation](https://pdfkit.org/)
- [Node.js Streams](https://nodejs.org/api/stream.html)
- [Buffer to PDF](https://nodejs.org/api/buffer.html)

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Comprovantes  

---
