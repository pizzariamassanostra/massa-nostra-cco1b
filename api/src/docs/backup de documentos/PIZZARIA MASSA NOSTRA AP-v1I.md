
---

# 📖 DOCUMENTAÇÃO - PIZZARIA MASSA NOSTRA API

**Versão:** 1.0.0  
**Data:** 2025-11-24  
**Desenvolvedor:** @lucasitdias  
**Repositório:** [GitHub - pizzaria-massa-nostra](https://github.com/lucasitdias/pizzaria-massa-nostra)

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Autenticação JWT - Clientes](#autenticação-jwt-clientes)
5. [Comprovantes PDF](#comprovantes-pdf)
6. [Relatórios e Analytics](#relatórios-e-analytics)
7. [Catálogo de Produtos](#catálogo-de-produtos)
8. [Sistema de Pedidos](#sistema-de-pedidos)
9. [Avaliações (Reviews)](#avaliações-reviews)
10. [Segurança e LGPD](#segurança-e-lgpd)

---

## 🎯 VISÃO GERAL

A **Pizzaria Massa Nostra API** é uma aplicação backend completa desenvolvida em **Node.js com TypeScript** para gerenciar um delivery de pizzaria online. 

### **Funcionalidades Principais:**
- ✅ Cadastro e autenticação de clientes (JWT)
- ✅ Catálogo completo de produtos (pizzas, bebidas, bordas)
- ✅ Sistema de pedidos com carrinho
- ✅ Múltiplas formas de pagamento (PIX, cartão, dinheiro)
- ✅ Geração automática de comprovantes em PDF
- ✅ Sistema de avaliações
- ✅ Relatórios gerenciais completos
- ✅ Soft delete (LGPD compliance)

---

## 🛠️ TECNOLOGIAS UTILIZADAS

### **Backend:**
```
- Node.js v18+
- TypeScript 5.x
- NestJS 10.x (Framework)
- TypeORM (ORM)
- PostgreSQL (Banco de Dados - Supabase)
- JWT (Autenticação)
- Bcrypt (Criptografia de senhas)
- PDFKit (Geração de PDF)
- Cloudinary (Armazenamento de imagens/PDFs)
- Class Validator (Validação de dados)
```

### **Infraestrutura:**
```
- Supabase (PostgreSQL)
- Cloudinary (CDN)
- Vercel/Render (Deploy - produção)
```

---

## 🚀 INSTALAÇÃO E CONFIGURAÇÃO

### **1. Clonar Repositório**
```bash
git clone https://github.com/lucasitdias/pizzaria-massa-nostra.git
cd pizzaria-massa-nostra/api
```

### **2. Instalar Dependências**
```bash
npm install
```

### **3. Configurar Variáveis de Ambiente**

**Criar arquivo `.env`:**
```env
# Banco de Dados (Supabase)
DB_HOST=db.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=postgres
DB_SSL=true

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# MercadoPago (Pagamentos)
MERCADOPAGO_ACCESS_TOKEN=seu_access_token

# Ambiente
NODE_ENV=development
PORT=3001
```

### **4. Executar Migrations**
```bash
npm run typeorm migration:run
```

### **5. Iniciar API**

**Desenvolvimento:**
```bash
npm run start:dev
```

**Produção:**
```bash
npm run build
npm run start:prod
```

**API disponível em:** `http://localhost:3001`

---

## 🔐 AUTENTICAÇÃO JWT - CLIENTES

### **Descrição:**
Sistema completo de autenticação JWT para clientes da pizzaria, permitindo registro, login e acesso seguro a funcionalidades protegidas.

### **Tabela: common_users**
```sql
CREATE TABLE common_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  birth_date DATE,
  phone VARCHAR(15) NOT NULL UNIQUE,
  phone_alternative VARCHAR(15),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  accept_terms BOOLEAN DEFAULT FALSE,
  accept_promotions BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

### **Endpoints:**

#### **1. Registro de Cliente**
```http
POST /customer/register
Content-Type: application/json

{
  "name": "João Silva",
  "phone": "11988776655",
  "email": "joao@exemplo.com",
  "password": "Senha123",
  "cpf": "12345678900",
  "accept_terms": true,
  "accept_promotions": false
}
```

**Resposta (200 OK):**
```json
{
  "ok": true,
  "message": "Cadastro realizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "phone": "11988776655",
    "email": "joao@exemplo.com",
    "cpf": "123.456.789-00",
    "created_at": "2025-11-24T07:00:00.000Z"
  }
}
```

**Validações:**
- ✅ CPF válido (algoritmo oficial)
- ✅ Telefone único
- ✅ Email único (se fornecido)
- ✅ Senha com hash bcrypt
- ✅ Aceite de termos obrigatório

---

#### **2. Login de Cliente**
```http
POST /customer/login
Content-Type: application/json

{
  "username": "joao@exemplo.com",
  "password": "Senha123"
}
```

**Resposta (200 OK):**
```json
{
  "ok": true,
  "message": "Login realizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "phone": "11988776655",
    "email": "joao@exemplo.com"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Características:**
- ✅ Login por email OU telefone
- ✅ Token JWT válido por 7 dias
- ✅ Token contém: `id`, `type: 'customer'`, `name`, `email`, `phone`

---

#### **3. Buscar Perfil (Protegido)**
```http
GET /customer/profile
Authorization: Bearer {token}
```

**Resposta (200 OK):**
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "name": "João Silva",
    "phone": "11988776655",
    "email": "joao@exemplo.com",
    "cpf": "123.456.789-00",
    "birth_date": "1990-05-15",
    "phone_alternative": null,
    "accept_promotions": false,
    "created_at": "2025-11-24T07:00:00.000Z",
    "updated_at": "2025-11-24T07:00:00.000Z"
  }
}
```

---

#### **4. Atualizar Perfil (Protegido)**
```http
PUT /customer/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Santos",
  "cpf": "12345678900",
  "birth_date": "1990-05-15",
  "phone_alternative": "11977665544"
}
```

**Resposta (200 OK):**
```json
{
  "ok": true,
  "message": "Perfil atualizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva Santos",
    "cpf": "123.456.789-00",
    "birth_date": "1990-05-15",
    "phone_alternative": "11977665544",
    "updated_at": "2025-11-24T07:05:00.000Z"
  }
}
```

---

#### **5. Excluir Conta (Soft Delete - LGPD)**
```http
DELETE /customer/account
Authorization: Bearer {token}
```

**Resposta (200 OK):**
```json
{
  "ok": true,
  "message": "Conta excluída com sucesso. Seus dados foram mantidos no sistema para fins de histórico (LGPD)."
}
```

**Características:**
- ✅ Soft delete (campo `deleted_at` preenchido)
- ✅ Dados mantidos para LGPD
- ✅ Cliente não consegue mais fazer login
- ✅ Histórico de pedidos preservado

---

## 📄 COMPROVANTES PDF

### **Descrição:**
Sistema automático de geração de comprovantes em PDF para pedidos confirmados, com armazenamento em nuvem (Cloudinary).

### **Tabela: receipts**
```sql
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  pdf_url VARCHAR(500) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_cpf VARCHAR(14),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(15) NOT NULL,
  items_json TEXT,
  was_emailed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  emailed_at TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (customer_id) REFERENCES common_users(id)
);
```

### **Fluxo de Geração:**
```
1. Pedido criado (status: pending)
2. Admin confirma pedido → status = 'confirmed'
3. OrderService detecta mudança de status
4. ReceiptService.createForOrder() é chamado
5. PdfGeneratorService gera PDF em memória
6. PDF enviado para Cloudinary
7. URL do PDF salvo na tabela receipts
8. Comprovante disponível para consulta
```

### **Template do PDF:**
```
╔═══════════════════════════════════════╗
║   PIZZARIA MASSA NOSTRA              ║
║   Rua das Pizzas, 123 - Centro       ║
║   Tel: (11) 98765-4321               ║
║   CNPJ: 12.345.678/0001-90           ║
╠═══════════════════════════════════════╣
║   COMPROVANTE DE PEDIDO              ║
║───────────────────────────────────────║
║   Comprovante: COMP-20251124-001     ║
║   Pedido: #123                       ║
║   Data: 24/11/2025 07:05             ║
╠═══════════════════════════════════════╣
║   DADOS DO CLIENTE:                  ║
║   Nome: João Silva                   ║
║   CPF: 123.456.789-00               ║
║   Email: joao@exemplo.com           ║
║   Telefone: (11) 98877-6655         ║
╠═══════════════════════════════════════╣
║   ITENS DO PEDIDO:                   ║
║───────────────────────────────────────║
║   Pizza Margherita (G)      R$ 35,00 ║
║   Qtd: 2                    R$ 70,00 ║
║───────────────────────────────────────║
║   Subtotal:                 R$ 70,00 ║
║   Taxa de Entrega:          R$  5,00 ║
║   ═══════════════════════════════════ ║
║   TOTAL:                    R$ 75,00 ║
╠═══════════════════════════════════════╣
║   Forma de Pagamento: PIX            ║
║───────────────────────────────────────║
║   Obrigado pela preferência!         ║
║   Pizzaria Massa Nostra              ║
╚═══════════════════════════════════════╝
```

### **Endpoints:**

#### **1. Buscar Comprovante por Pedido**
```http
GET /receipt/order/{orderId}
Authorization: Bearer {token}
```

**Resposta (200 OK):**
```json
{
  "ok": true,
  "receipt": {
    "id": 1,
    "receipt_number": "COMP-20251124-001",
    "pdf_url": "https://res.cloudinary.com/.../receipt.pdf",
    "total_amount": 75.00,
    "payment_method": "pix",
    "created_at": "2025-11-24T07:05:00.000Z"
  }
}
```

---

#### **2. Buscar por Número do Comprovante**
```http
GET /receipt/number/COMP-20251124-001
Authorization: Bearer {token}
```

---

#### **3. Reemitir Comprovante**
```http
GET /receipt/reissue/{orderId}
Authorization: Bearer {token}
```

---

