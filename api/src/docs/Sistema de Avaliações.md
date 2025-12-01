# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 7: AVALIAÇÕES

---

## Sistema de Avaliações

**Pizzaria Massa Nostra - Módulo de Avaliações e Feedback**

---

## 🎯 Visão Geral

O módulo de avaliações gerencia todo o sistema de feedback dos clientes da Pizzaria Massa Nostra.  Permite que clientes avaliem seus pedidos com notas de 1 a 5 estrelas e comentários opcionais, fornecendo métricas valiosas para melhoria contínua do serviço e qualidade dos produtos.

---

## ✨ Funcionalidades

### ✅ 1. Gestão de Avaliações
- Criar avaliação de pedido
- Buscar avaliação por pedido
- Listar avaliações do cliente
- Listar todas as avaliações (admin)
- Estatísticas de avaliação

### ✅ 2. Sistema de Notas
- Escala de 1 a 5 estrelas
- Nota obrigatória
- Comentário opcional
- Validação de pedido entregue

### ✅ 3. Controle de Duplicidade
- Uma avaliação por pedido
- Cliente só avalia pedidos próprios
- Apenas pedidos entregues

### ✅ 4. Estatísticas
- Média geral de avaliações
- Média por período
- Distribuição de notas
- Total de avaliações

### ✅ 5. Moderação (Futuro)
- Aprovação de comentários
- Denúncia de avaliações
- Resposta da pizzaria

---

## 🛣️ Endpoints da API

### **1. Criar Avaliação**

```http
POST /review/order/{orderId}
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Pizza excelente! Chegou quentinha e o sabor estava perfeito.  Recomendo!"
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Avaliação cadastrada com sucesso",
  "data": {
    "id": 1,
    "order_id": 1,
    "customer": {
      "id": 1,
      "name": "João Silva"
    },
    "rating": 5,
    "comment": "Pizza excelente! Chegou quentinha e o sabor estava perfeito. Recomendo!",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Resposta de Erro (400) - Pedido Não Entregue:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Pedido ainda não foi entregue",
    "userMessage": "Você só pode avaliar pedidos já entregues"
  }]
}
```

**Resposta de Erro (400) - Avaliação Duplicada:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Pedido já foi avaliado",
    "userMessage": "Você já avaliou este pedido"
  }]
}
```

**Validações:**
- ✅ Rating obrigatório (1 a 5)
- ✅ Comentário opcional (máximo 1000 caracteres)
- ✅ Pedido deve existir
- ✅ Pedido deve pertencer ao cliente logado
- ✅ Pedido deve estar com status `delivered`
- ✅ Pedido não pode ter avaliação prévia

---

### **2. Buscar Avaliação por Pedido**

```http
GET /review/order/{orderId}
Authorization: Bearer {customer_token}
```

**Exemplo:**
```http
GET /review/order/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "order_id": 1,
    "customer": {
      "id": 1,
      "name": "João Silva"
    },
    "rating": 5,
    "comment": "Pizza excelente!  Chegou quentinha e o sabor estava perfeito.",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "ok": false,
  "errors": [{
    "message": "Avaliação não encontrada",
    "userMessage": "Este pedido ainda não foi avaliado"
  }]
}
```

---

### **3. Listar Avaliações do Cliente**

```http
GET /review/customer/{customerId}
Authorization: Bearer {customer_token}
```

**Exemplo:**
```http
GET /review/customer/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "order_number": "ORD-20251126-0001",
      "rating": 5,
      "comment": "Pizza excelente! ",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "order_id": 3,
      "order_number": "ORD-20251125-0005",
      "rating": 4,
      "comment": "Muito bom, só demorou um pouco",
      "created_at": "2025-11-25T22:00:00.000Z"
    }
  ]
}
```

**Ordenação:** Do mais recente para o mais antigo

---

### **4. Listar Todas as Avaliações (Admin)**

```http
GET /review
Authorization: Bearer {admin_token}
```

**Filtros Disponíveis:**
- `? rating=5` - Filtrar por nota
- `?customer_id=1` - Filtrar por cliente
- `?date=2025-11-26` - Filtrar por data
- `?min_rating=4` - Nota mínima
- `?max_rating=5` - Nota máxima

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "customer": {
        "id": 1,
        "name": "João Silva"
      },
      "rating": 5,
      "comment": "Pizza excelente!",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "order_id": 2,
      "customer": {
        "id": 2,
        "name": "Maria Santos"
      },
      "rating": 4,
      "comment": "Muito boa! ",
      "created_at": "2025-11-26T00:30:00.000Z"
    },
    {
      "id": 3,
      "order_id": 3,
      "customer": {
        "id": 3,
        "name": "Carlos Souza"
      },
      "rating": 3,
      "comment": "Poderia melhorar",
      "created_at": "2025-11-26T01:00:00. 000Z"
    }
  ]
}
```

---

### **5. Estatísticas Gerais**

```http
GET /review/stats/average
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "average_rating": 4.3,
    "total_reviews": 150,
    "distribution": {
      "1_star": 5,
      "2_stars": 10,
      "3_stars": 20,
      "4_stars": 45,
      "5_stars": 70
    },
    "percentage": {
      "1_star": 3.33,
      "2_stars": 6.67,
      "3_stars": 13.33,
      "4_stars": 30.00,
      "5_stars": 46.67
    },
    "period": {
      "start_date": "2025-01-01",
      "end_date": "2025-11-26"
    }
  }
}
```

**Filtros de Período:**
- `?start_date=2025-11-01` - Data inicial
- `?end_date=2025-11-26` - Data final

---

## 📁 Estrutura de Arquivos

```
src/modules/order/
├── controllers/
│   └── review. controller.ts            # 5 endpoints REST
├── services/
│   └── review.service.ts               # Lógica de avaliações
├── entities/
│   └── review. entity.ts                # Entidade de avaliação
├── dto/
│   └── create-review.dto.ts            # DTO de criação
├── order.module.ts                     # Módulo NestJS
└── index.ts                            # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `reviews`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único da avaliação |
| order_id | INTEGER | FK para orders (UNIQUE) |
| common_user_id | INTEGER | FK para common_users |
| rating | INTEGER | Nota de 1 a 5 |
| comment | TEXT | Comentário (opcional) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| deleted_at | TIMESTAMP | Soft delete |

**Índices:**
- `idx_reviews_order` (order_id) - UNIQUE
- `idx_reviews_customer` (common_user_id)
- `idx_reviews_rating` (rating)
- `idx_reviews_created` (created_at DESC)

**Constraints:**
- `UNIQUE` em order_id (um pedido = uma avaliação)
- `FOREIGN KEY` para orders
- `FOREIGN KEY` para common_users
- `CHECK` rating BETWEEN 1 AND 5

**SQL de Criação:**
```sql
CREATE TABLE public.reviews (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL UNIQUE,
  common_user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  CONSTRAINT fk_reviews_order 
    FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT fk_reviews_customer 
    FOREIGN KEY (common_user_id) 
    REFERENCES common_users(id) 
    ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_reviews_order ON public.reviews(order_id);
CREATE INDEX idx_reviews_customer ON public. reviews(common_user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created ON public.reviews(created_at DESC);

COMMENT ON TABLE public.reviews IS 'Avaliações de pedidos pelos clientes';
COMMENT ON COLUMN public.reviews. rating IS 'Nota de 1 a 5 estrelas';
COMMENT ON COLUMN public.reviews.comment IS 'Comentário opcional do cliente';
```

---

## 📝 DTOs (Data Transfer Objects)

### **CreateReviewDto**

```typescript
import { 
  IsNotEmpty, 
  IsNumber, 
  IsString,
  IsOptional,
  Min,
  Max,
  MaxLength
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Nota é obrigatória' })
  @Min(1, { message: 'Nota mínima é 1' })
  @Max(5, { message: 'Nota máxima é 5' })
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Comentário deve ter no máximo 1000 caracteres' })
  comment?: string;
}
```

**Exemplo de Validação:**
```typescript
//  Válido
{
  "rating": 5,
  "comment": "Excelente!"
}

//  Válido (sem comentário)
{
  "rating": 4
}

// ❌ Inválido (nota fora do range)
{
  "rating": 6,  // Erro: máximo é 5
  "comment": "Muito bom"
}

// ❌ Inválido (sem nota)
{
  "comment": "Bom"  // Erro: rating é obrigatório
}
```

---

## 🧪 Testes Completos

### **TESTE 1: Criar Avaliação com Sucesso**

**Pré-requisito:** Pedido #1 deve estar `delivered`

```sql
-- Garantir que pedido está entregue
UPDATE orders SET status = 'delivered' WHERE id = 1;
```

**Request:**
```http
POST http://localhost:3001/review/order/1
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Pizza maravilhosa!  Sabor incrível, massa perfeita e chegou super rápido.  Melhor pizza de Montes Claros!"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Avaliação cadastrada com sucesso",
  "data": {
    "id": 1,
    "order_id": 1,
    "rating": 5,
    "comment": "Pizza maravilhosa! Sabor incrível.. .",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Status:**  201 Created

---

### **TESTE 2: Criar Avaliação sem Comentário**

**Request:**
```http
POST http://localhost:3001/review/order/2
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "rating": 4
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Avaliação cadastrada com sucesso",
  "data": {
    "id": 2,
    "order_id": 2,
    "rating": 4,
    "comment": null
  }
}
```

**Status:**  201 Created

---

### **TESTE 3: Tentar Avaliar Pedido Não Entregue**

**Request:**
```http
POST http://localhost:3001/review/order/3
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Muito bom!"
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Pedido ainda não foi entregue",
    "userMessage": "Você só pode avaliar pedidos já entregues"
  }]
}
```

**Status:**  400 Bad Request

---

### **TESTE 4: Tentar Avaliar Pedido Já Avaliado**

**Request:**
```http
POST http://localhost:3001/review/order/1
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Segunda avaliação"
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Pedido já foi avaliado",
    "userMessage": "Você já avaliou este pedido"
  }]
}
```

**Status:**  400 Bad Request

---

### **TESTE 5: Tentar Nota Inválida (0)**

**Request:**
```http
POST http://localhost:3001/review/order/4
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "rating": 0,
  "comment": "Péssimo"
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Nota mínima é 1"
  }]
}
```

**Status:**  400 Bad Request

---

### **TESTE 6: Tentar Nota Inválida (6)**

**Request:**
```http
POST http://localhost:3001/review/order/4
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "rating": 6,
  "comment": "Excelente demais!"
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Nota máxima é 5"
  }]
}
```

**Status:**  400 Bad Request

---

### **TESTE 7: Buscar Avaliação por Pedido**

**Request:**
```http
GET http://localhost:3001/review/order/1
Authorization: Bearer {customer_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "order_id": 1,
    "customer": {
      "id": 1,
      "name": "João Silva"
    },
    "rating": 5,
    "comment": "Pizza maravilhosa! ",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Status:**  200 OK

---

### **TESTE 8: Listar Avaliações do Cliente**

**Request:**
```http
GET http://localhost:3001/review/customer/1
Authorization: Bearer {customer_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "rating": 5,
      "comment": "Pizza maravilhosa!",
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 3,
      "order_id": 5,
      "rating": 4,
      "comment": "Muito boa",
      "created_at": "2025-11-25T20:00:00.000Z"
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 9: Listar Todas as Avaliações (Admin)**

**Request:**
```http
GET http://localhost:3001/review
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "customer": {"name": "João Silva"},
      "rating": 5,
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "customer": {"name": "Maria Santos"},
      "rating": 4,
      "created_at": "2025-11-26T00:30:00.000Z"
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 10: Filtrar Avaliações por Nota**

**Request:**
```http
GET http://localhost:3001/review?rating=5
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Pizza maravilhosa!"
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 11: Estatísticas Gerais**

**Request:**
```http
GET http://localhost:3001/review/stats/average
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "average_rating": 4.3,
    "total_reviews": 150,
    "distribution": {
      "1_star": 5,
      "2_stars": 10,
      "3_stars": 20,
      "4_stars": 45,
      "5_stars": 70
    },
    "percentage": {
      "1_star": 3.33,
      "2_stars": 6.67,
      "3_stars": 13.33,
      "4_stars": 30.00,
      "5_stars": 46.67
    }
  }
}
```

**Status:**  200 OK

---

## ✅ Checklist de Validação

```
□ Criar avaliação com nota e comentário funciona
□ Criar avaliação apenas com nota funciona
□ Validação de nota (1-5) funciona
□ Comentário limitado a 1000 caracteres
□ Apenas pedidos entregues podem ser avaliados
□ Não permite avaliar mesmo pedido duas vezes
□ Não permite avaliar pedido de outro cliente
□ Buscar avaliação por pedido funciona
□ Listar avaliações do cliente funciona
□ Listar todas as avaliações funciona
□ Filtrar por nota funciona
□ Estatísticas calculadas corretamente
□ Média geral precisa
□ Distribuição de notas correta
```

---

## 📊 Fluxo de Avaliação

```
┌──────────────┐
│   Cliente    │
│  (recebe     │
│   pedido)    │
└──────┬───────┘
       │ 1. Pedido entregue
       │    Status: delivered
       ▼
┌─────────────────────────┐
│   Sistema               │
│  ├─ Envia notificação   │
│  └─ Solicita avaliação  │
└──────┬──────────────────┘
       │ 2. Email/SMS/Push
       ▼
┌──────────────┐
│   Cliente    │
│  (abre app)  │
└──────┬───────┘
       │ 3. POST /review/order/1
       │    { "rating": 5, "comment": "..." }
       ▼
┌─────────────────────────┐
│   ReviewService         │
│  ├─ Valida pedido       │
│  ├─ Verifica duplicidade│
│  ├─ Salva avaliação     │
│  └─ Atualiza médias     │
└──────┬──────────────────┘
       │ 4.  Confirmação 
       ▼
┌──────────────┐
│   Cliente    │
│  (obrigado!) │
└──────────────┘

┌─────────────────────────┐
│   Admin Dashboard       │
│  ├─ Vê novas avaliações │
│  ├─ Analisa estatísticas│
│  └─ Melhora serviço     │
└─────────────────────────┘
```

---

## 📈 Métricas e KPIs

### **Indicadores Principais**

```typescript
interface ReviewMetrics {
  // Média geral
  average_rating: number;        // Ex: 4.3
  
  // Total
  total_reviews: number;         // Ex: 150
  
  // Distribuição
  distribution: {
    1_star: number;              // Ex: 5
    2_stars: number;             // Ex: 10
    3_stars: number;             // Ex: 20
    4_stars: number;             // Ex: 45
    5_stars: number;             // Ex: 70
  };
  
  // Percentuais
  percentage: {
    1_star: number;              // Ex: 3.33%
    2_stars: number;             // Ex: 6.67%
    3_stars: number;             // Ex: 13.33%
    4_stars: number;             // Ex: 30. 00%
    5_stars: number;             // Ex: 46.67%
  };
  
  // NPS (Net Promoter Score)
  nps: {
    promoters: number;           // Notas 5 (46.67%)
    passives: number;            // Notas 3-4 (43.33%)
    detractors: number;          // Notas 1-2 (10.00%)
    score: number;               // Promoters - Detractors (36.67)
  };
}
```

### **Cálculo de NPS**

```
NPS = % Promotores - % Detratores

Promotores: Notas 5 (clientes satisfeitos)
Passivos: Notas 3-4 (clientes neutros)
Detratores: Notas 1-2 (clientes insatisfeitos)

Exemplo:
- Promotores: 46.67%
- Detratores: 10.00%
- NPS = 46.67 - 10.00 = 36.67

Classificação:
- Excelente: > 75
- Muito Bom: 50 - 75
- Razoável: 0 - 50
- Ruim: < 0
```

---

## 🚀 Exemplos de Uso

### **Cenário: Cliente Avalia Pedido Entregue**

```bash
# 1. Cliente recebe pedido
# Status do pedido muda para 'delivered'

# 2.  Sistema envia notificação
# Email/SMS: "Avalie seu pedido e ganhe 10% de desconto!"

# 3. Cliente abre app e avalia
curl -X POST http://localhost:3001/review/order/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Pizza deliciosa! Chegou rápido e quentinha."
  }'

# 4. Sistema confirma
{
  "ok": true,
  "message": "Obrigado pela sua avaliação!  Você ganhou 10% de desconto no próximo pedido."
}
```

---

### **Cenário: Admin Analisa Feedback**

```bash
# 1. Ver média geral
curl http://localhost:3001/review/stats/average \
  -H "Authorization: Bearer {admin_token}"

# 2.  Ver avaliações ruins (1-2 estrelas)
curl "http://localhost:3001/review?max_rating=2" \
  -H "Authorization: Bearer {admin_token}"

# 3.  Analisar comentários negativos
# Identificar problemas recorrentes

# 4.  Implementar melhorias
# Ex: "Demora na entrega" → Contratar mais motoboys
```

---

## 📚 Referências Técnicas

- [NPS - Net Promoter Score](https://www.netpromoter.com/)
- [Customer Satisfaction Metrics](https://www.qualtrics.com/experience-management/customer/customer-satisfaction/)
- [Star Rating Best Practices](https://baymard.com/blog/user-ratings-design)

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Avaliações  

---
