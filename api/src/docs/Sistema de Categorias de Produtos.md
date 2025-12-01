# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 3: CATEGORIAS DE PRODUTOS

---

## Sistema de Categorias de Produtos

**Pizzaria Massa Nostra - Módulo de Gestão de Categorias**

---

## 🎯 Visão Geral

O módulo de categorias gerencia as categorias de produtos do cardápio da Pizzaria Massa Nostra.  Permite organizar produtos em grupos lógicos (Pizzas Salgadas, Pizzas Doces, Bebidas, etc.) com sistema de slug único para URLs amigáveis e controle de status ativo/inativo.

---

## ✨ Funcionalidades

### ✅ 1. Gestão de Categorias
- Criar novas categorias
- Listar todas as categorias
- Listar apenas categorias ativas
- Buscar por ID
- Buscar por slug
- Atualizar categorias
- Inativar/Reativar categorias
- Soft delete

### ✅ 2.  Sistema de Slug
- Geração automática de slug a partir do nome
- Slug único (validação de duplicidade)
- URLs amigáveis
- Normalização automática (remove acentos, espaços)

### ✅ 3. Controle de Status
- Status ativo/inativo
- Filtro de categorias ativas
- Bloqueio de categorias inativas no cardápio

### ✅ 4. Ordenação e Hierarquia
- Campo de ordem para exibição
- Descrição opcional
- Sistema preparado para hierarquia futura

---

## 🛣️ Endpoints da API

### **1. Criar Categoria**

```http
POST /product-category
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pizzas Salgadas",
  "description": "Pizzas tradicionais salgadas em diversos tamanhos",
  "order": 1,
  "is_active": true
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Categoria criada com sucesso",
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas",
    "slug": "pizzas-salgadas",
    "description": "Pizzas tradicionais salgadas em diversos tamanhos",
    "order": 1,
    "is_active": true,
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Resposta de Erro (400) - Slug Duplicado:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Slug já existe",
    "userMessage": "Já existe uma categoria com este nome"
  }]
}
```

**Validações:**
- ✅ Nome obrigatório (3-100 caracteres)
- ✅ Slug único (gerado automaticamente)
- ✅ Descrição opcional (máximo 500 caracteres)
- ✅ Ordem numérica (padrão: 0)
- ✅ Status booleano (padrão: true)

---

### **2. Listar Todas as Categorias**

```http
GET /product-category
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Pizzas Salgadas",
      "slug": "pizzas-salgadas",
      "description": "Pizzas tradicionais salgadas",
      "order": 1,
      "is_active": true,
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Pizzas Doces",
      "slug": "pizzas-doces",
      "description": "Pizzas doces e sobremesas",
      "order": 2,
      "is_active": true,
      "created_at": "2025-11-26T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Bebidas",
      "slug": "bebidas",
      "description": "Refrigerantes, sucos e águas",
      "order": 3,
      "is_active": true,
      "created_at": "2025-11-26T00:00:00. 000Z"
    }
  ]
}
```

**Ordenação:** Por campo `order` (ASC), depois por `name` (ASC)

---

### **3. Listar Categorias Ativas**

```http
GET /product-category/active
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Pizzas Salgadas",
      "slug": "pizzas-salgadas",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "name": "Pizzas Doces",
      "slug": "pizzas-doces",
      "order": 2,
      "is_active": true
    }
  ]
}
```

**Nota:** Este endpoint NÃO requer autenticação (público para o cardápio)

---

### **4. Buscar por ID**

```http
GET /product-category/{id}
Authorization: Bearer {admin_token}
```

**Exemplo:**
```http
GET /product-category/1
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas",
    "slug": "pizzas-salgadas",
    "description": "Pizzas tradicionais salgadas em diversos tamanhos",
    "order": 1,
    "is_active": true,
    "created_at": "2025-11-26T00:00:00.000Z",
    "updated_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "ok": false,
  "errors": [{
    "message": "Categoria não encontrada"
  }]
}
```

---

### **5.  Buscar por Slug**

```http
GET /product-category/slug/{slug}
```

**Exemplo:**
```http
GET /product-category/slug/pizzas-salgadas
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas",
    "slug": "pizzas-salgadas",
    "description": "Pizzas tradicionais salgadas",
    "is_active": true,
    "products_count": 23
  }
}
```

**Nota:** Endpoint público (sem autenticação necessária)

---

### **6. Atualizar Categoria**

```http
PUT /product-category/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pizzas Salgadas Especiais",
  "description": "Pizzas salgadas tradicionais e especiais",
  "order": 1
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Categoria atualizada com sucesso",
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas Especiais",
    "slug": "pizzas-salgadas-especiais",
    "description": "Pizzas salgadas tradicionais e especiais",
    "order": 1,
    "is_active": true
  }
}
```

**Campos Atualizáveis:**
- ✅ name (atualiza slug automaticamente)
- ✅ description
- ✅ order
- ✅ is_active

---

### **7.  Deletar Categoria (Soft Delete)**

```http
DELETE /product-category/{id}
Authorization: Bearer {admin_token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Categoria excluída com sucesso"
}
```

**Comportamento:**
- ✅ Soft delete (marca `deleted_at`)
- ✅ Categoria não aparece mais em listagens
- ✅ Produtos vinculados são mantidos
- ✅ Histórico preservado para relatórios

**Resposta de Erro (400) - Categoria com Produtos:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Não é possível excluir categoria com produtos vinculados",
    "userMessage": "Esta categoria possui produtos.  Mova-os antes de excluir."
  }]
}
```

---

## 📁 Estrutura de Arquivos

```
src/modules/product-category/
├── controllers/
│   └── product-category. controller.ts   # 7 endpoints REST
├── services/
│   └── product-category.service. ts      # Lógica de negócio
├── entities/
│   └── product-category.entity.ts       # Entidade TypeORM
├── dto/
│   ├── create-product-category. dto.ts   # DTO de criação
│   └── update-product-category.dto.ts   # DTO de atualização
├── product-category.module.ts           # Módulo NestJS
└── index.ts                             # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `product_categories`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único da categoria |
| name | VARCHAR(100) | Nome da categoria |
| slug | VARCHAR(100) | Slug único (URL amigável) |
| description | TEXT | Descrição (opcional) |
| order | INTEGER | Ordem de exibição (padrão: 0) |
| is_active | BOOLEAN | Status ativo/inativo (padrão: true) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| deleted_at | TIMESTAMP | Soft delete |

**Índices:**
- `idx_product_categories_slug` (slug) - UNIQUE
- `idx_product_categories_is_active` (is_active)
- `idx_product_categories_order` (order)
- `idx_product_categories_deleted` (deleted_at)

**Constraints:**
- `UNIQUE` em slug

**SQL de Criação:**
```sql
CREATE TABLE public. product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX idx_product_categories_slug 
  ON public.product_categories(slug);

CREATE INDEX idx_product_categories_is_active 
  ON public.product_categories(is_active);

CREATE INDEX idx_product_categories_order 
  ON public.product_categories("order");

CREATE INDEX idx_product_categories_deleted 
  ON public.product_categories(deleted_at);

COMMENT ON TABLE public.product_categories IS 'Categorias de produtos do cardápio';
COMMENT ON COLUMN public.product_categories.slug IS 'Slug único para URLs amigáveis';
COMMENT ON COLUMN public.product_categories."order" IS 'Ordem de exibição no cardápio';
```

---

## 🔧 Sistema de Slug

### **Geração Automática de Slug**

```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()                          // Minúsculas
    .normalize('NFD')                       // Decomposição Unicode
    .replace(/[\u0300-\u036f]/g, '')       // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '')          // Remove caracteres especiais
    .trim()                                 // Remove espaços nas pontas
    .replace(/\s+/g, '-')                  // Espaços → hífens
    .replace(/-+/g, '-');                  // Múltiplos hífens → único
}
```

**Exemplos:**

| Nome Original | Slug Gerado |
|---------------|-------------|
| Pizzas Salgadas | pizzas-salgadas |
| Pizzas Doces | pizzas-doces |
| Bebidas & Refrigerantes | bebidas-refrigerantes |
| Açaí | acai |
| Promoções Especiais!  | promocoes-especiais |

---

## 📝 DTOs (Data Transfer Objects)

### **CreateProductCategoryDto**

```typescript
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsBoolean,
  IsInt,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Ordem deve ser um número inteiro' })
  order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
```

### **UpdateProductCategoryDto**

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCategoryDto } from './create-product-category.dto';

export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto
) {
  // Herda todos os campos como opcionais
}
```

---

## 🧪 Testes Completos

### **TESTE 1: Criar Categoria - Pizzas Salgadas**

**Request:**
```http
POST http://localhost:3001/product-category
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pizzas Salgadas",
  "description": "Pizzas tradicionais salgadas em diversos tamanhos",
  "order": 1,
  "is_active": true
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Categoria criada com sucesso",
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas",
    "slug": "pizzas-salgadas",
    "order": 1,
    "is_active": true
  }
}
```

**Status:**  201 Created

---

### **TESTE 2: Criar Categoria - Pizzas Doces**

**Request:**
```http
POST http://localhost:3001/product-category
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pizzas Doces",
  "description": "Pizzas doces e sobremesas",
  "order": 2,
  "is_active": true
}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 2,
    "name": "Pizzas Doces",
    "slug": "pizzas-doces"
  }
}
```

**Status:**  201 Created

---

### **TESTE 3: Criar Categoria - Bebidas**

**Request:**
```http
POST http://localhost:3001/product-category
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Bebidas",
  "description": "Refrigerantes, sucos, águas e energéticos",
  "order": 3,
  "is_active": true
}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 3,
    "name": "Bebidas",
    "slug": "bebidas"
  }
}
```

**Status:**  201 Created

---

### **TESTE 4: Criar Categoria com Slug Duplicado**

**Request:**
```http
POST http://localhost:3001/product-category
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pizzas Salgadas",
  "order": 10
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Slug já existe"
  }]
}
```

**Status:**  400 Bad Request

---

### **TESTE 5: Listar Todas as Categorias**

**Request:**
```http
GET http://localhost:3001/product-category
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Pizzas Salgadas",
      "slug": "pizzas-salgadas",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "name": "Pizzas Doces",
      "slug": "pizzas-doces",
      "order": 2,
      "is_active": true
    },
    {
      "id": 3,
      "name": "Bebidas",
      "slug": "bebidas",
      "order": 3,
      "is_active": true
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 6: Listar Apenas Ativas (Público)**

**Request:**
```http
GET http://localhost:3001/product-category/active
```

**Expected Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Pizzas Salgadas",
      "slug": "pizzas-salgadas",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Pizzas Doces",
      "slug": "pizzas-doces",
      "is_active": true
    }
  ]
}
```

**Status:**  200 OK

---

### **TESTE 7: Buscar por ID**

**Request:**
```http
GET http://localhost:3001/product-category/1
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas",
    "slug": "pizzas-salgadas",
    "description": "Pizzas tradicionais salgadas",
    "order": 1,
    "is_active": true
  }
}
```

**Status:**  200 OK

---

### **TESTE 8: Buscar por Slug (Público)**

**Request:**
```http
GET http://localhost:3001/product-category/slug/pizzas-salgadas
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas",
    "slug": "pizzas-salgadas",
    "is_active": true
  }
}
```

**Status:**  200 OK

---

### **TESTE 9: Atualizar Categoria**

**Request:**
```http
PUT http://localhost:3001/product-category/1
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pizzas Salgadas Especiais",
  "description": "Pizzas salgadas tradicionais e especiais da casa",
  "order": 1
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Categoria atualizada com sucesso",
  "data": {
    "id": 1,
    "name": "Pizzas Salgadas Especiais",
    "slug": "pizzas-salgadas-especiais"
  }
}
```

**Status:**  200 OK

---

### **TESTE 10: Inativar Categoria**

**Request:**
```http
PUT http://localhost:3001/product-category/3
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "is_active": false
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Categoria atualizada com sucesso"
}
```

**Status:**  200 OK

**Validação:**
```http
GET /product-category/active
# Categoria "Bebidas" NÃO deve aparecer
```

---

### **TESTE 11: Deletar Categoria (Soft Delete)**

**Request:**
```http
DELETE http://localhost:3001/product-category/3
Authorization: Bearer {admin_token}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Categoria excluída com sucesso"
}
```

**Status:** 200 OK

**Validação no Banco:**
```sql
SELECT deleted_at FROM product_categories WHERE id = 3;
-- Deve retornar timestamp (não NULL)
```

---

## ✅ Checklist de Validação

```
□ Criar categoria com dados válidos funciona
□ Slug é gerado automaticamente
□ Slug duplicado retorna erro
□ Listar todas as categorias retorna ordenado
□ Listar apenas ativas funciona (sem auth)
□ Buscar por ID funciona
□ Buscar por slug funciona (sem auth)
□ Buscar categoria inexistente retorna 404
□ Atualizar categoria funciona
□ Atualizar nome regenera slug
□ Inativar categoria remove de /active
□ Deletar categoria marca deleted_at
□ Categoria deletada não aparece em listagens
□ Ordem de exibição funciona corretamente
```

---

## 📊 Categorias Padrão do Sistema

```sql
-- Popular categorias iniciais
INSERT INTO product_categories (name, slug, description, "order", is_active) 
VALUES
  ('Pizzas Salgadas', 'pizzas-salgadas', 'Pizzas tradicionais salgadas em diversos tamanhos e sabores', 1, TRUE),
  ('Pizzas Doces', 'pizzas-doces', 'Pizzas doces e sobremesas deliciosas', 2, TRUE),
  ('Bebidas', 'bebidas', 'Refrigerantes, sucos, águas e energéticos', 3, TRUE);
```

---

## 🚀 Exemplos de Uso

### **Cenário 1: Admin Cria Nova Categoria**

```bash
# 1. Login como admin
curl -X POST http://localhost:3001/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@massanostra.com","password":"Admin@123"}'

# 2.  Criar categoria
curl -X POST http://localhost:3001/product-category \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sobremesas",
    "description": "Sobremesas variadas",
    "order": 4
  }'
```

---

### **Cenário 2: Cliente Navega no Cardápio**

```bash
# 1. Buscar categorias ativas (sem login)
curl -X GET http://localhost:3001/product-category/active

# 2. Acessar categoria específica por slug
curl -X GET http://localhost:3001/product-category/slug/pizzas-salgadas
```

---

## 📚 Referências Técnicas

- [Slugify Algorithms](https://www.npmjs.com/package/slugify)
- [NestJS Validation Pipe](https://docs.nestjs. com/techniques/validation)
- [TypeORM Soft Delete](https://typeorm.io/delete-query-builder#soft-delete)

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Categorias de Produtos  

---
