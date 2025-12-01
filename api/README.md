# 📚 DOCUMENTAÇÃO COMPLETA DO PROJETO - README.md GERAL

---

## PIZZARIA MASSA NOSTRA (PROJETO COMPLETO)

```markdown
# 🍕 Pizzaria Massa Nostra - Sistema Completo de Gestão

Sistema web completo para gerenciamento de pizzaria com módulos de pedidos online, gestão de estoque, fornecedores, relatórios e integração com pagamentos.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green. svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs. com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-green.svg)](https://supabase.com/)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Módulos Implementados](#módulos-implementados)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Banco de Dados](#banco-de-dados)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Contato](#contato)

---

## 🎯 Sobre o Projeto

**Pizzaria Massa Nostra** é um sistema completo de gestão para pizzarias que oferece:

- **Para Clientes:** Pedidos online, acompanhamento em tempo real, avaliações
- **Para Administradores:** Gestão completa de estoque, fornecedores, relatórios, controle financeiro
- **Para Entregadores:** Sistema de validação de entrega com token

O sistema foi desenvolvido seguindo as melhores práticas de desenvolvimento, com arquitetura modular, validações robustas e rastreabilidade completa de todas as operações.

---

## ✨ Funcionalidades

### 👤 **Módulo de Clientes**

- ✅ Cadastro completo de clientes
- ✅ Autenticação JWT
- ✅ Perfil editável
- ✅ Endereços múltiplos para entrega
- ✅ Histórico de pedidos
- ✅ Aceite de termos (LGPD)
- ✅ Exclusão de conta (soft delete)

### 🍕 **Módulo de Produtos e Cardápio**

- ✅ Categorias de produtos (Pizzas Salgadas, Doces, Bebidas)
- ✅ Produtos com variações (tamanhos, bordas)
- ✅ Tipos de massa (Tradicional, Integral, Sem Glúten)
- ✅ Bordas (Tradicional, Recheada, Trançada)
- ✅ Recheios de borda personalizados
- ✅ Status (Disponível/Indisponível)
- ✅ Preços por variação
- ✅ Busca por slug

### 🛒 **Módulo de Pedidos**

- ✅ Criação de pedido com múltiplos itens
- ✅ Cálculo automático de valores
- ✅ Taxa de entrega
- ✅ Status do pedido em tempo real:
  - `pending` → `confirmed` → `preparing` → `ready` → `in_transit` → `delivered` → `completed`
- ✅ Token de validação de entrega
- ✅ Cancelamento de pedido
- ✅ Histórico completo

### 💳 **Módulo de Pagamentos**

- ✅ Integração com **Mercado Pago**
- ✅ Formas de pagamento:
  - PIX
  - Cartão de Crédito
  - Cartão de Débito
  - Dinheiro
- ✅ Webhooks para confirmação automática
- ✅ Rastreamento de pagamentos
- ✅ Reembolsos

### ⭐ **Módulo de Avaliações**

- ✅ Avaliação após entrega
- ✅ Notas de 1 a 5 estrelas
- ✅ Comentários
- ✅ Média de avaliações
- ✅ Estatísticas de qualidade

### 📄 **Módulo de Comprovantes**

- ✅ Geração automática de comprovante
- ✅ PDF com dados completos:
  - Dados do cliente
  - Itens do pedido
  - Valores detalhados
  - Forma de pagamento
- ✅ Envio por email
- ✅ Reemissão de comprovante
- ✅ Armazenamento seguro

### 📊 **Módulo de Relatórios**

- ✅ Dashboard completo:
  - Total de vendas
  - Ticket médio
  - Total de pedidos
  - Crescimento mensal
- ✅ Relatório de vendas por período
- ✅ Produtos mais vendidos
- ✅ Ranking de clientes
- ✅ Horários de pico
- ✅ Exportação para CSV/Excel

### 🏭 **Módulo de Fornecedores**

- ✅ Cadastro completo de fornecedores
- ✅ Validação de CNPJ (formato + duplicidade)
- ✅ Dados fiscais e bancários
- ✅ Sistema de status (pré-cadastro → análise → ativo)
- ✅ **Sistema de Cotações:**
  - Criar solicitação
  - Receber propostas
  - Comparativo (preços, prazos)
  - Aprovar/Cancelar
- ✅ **Pedidos de Compra:**
  - Fluxo completo (draft → aprovado → entregue → completo)
  - Formas de pagamento (PIX, Boleto, Cartão)
  - Registro de Nota Fiscal
  - Rastreamento completo
- ✅ Avaliações de fornecedores

### 📦 **Módulo de Ingredientes e Estoque**

- ✅ Cadastro completo de ingredientes
- ✅ Código interno único (ING-YYYYMMDD-XXX)
- ✅ Unidades de medida (kg, l, un, etc)
- ✅ Grupos (Ingredientes, Bebidas, Embalagens)
- ✅ Classificação fiscal (NCM, CEST, CFOP, CST)
- ✅ **Controle de Estoque:**
  - Gestão de lotes
  - Rastreabilidade FIFO
  - Entrada/Saída/Ajuste
  - Datas de validade
  - Localização física
- ✅ **Movimentações:**
  - Número único (MOV-YYYYMMDD-XXX)
  - Tipos: compra, venda, perda, ajuste
  - Saldo antes/depois
  - Rastreabilidade completa
- ✅ **Alertas Automáticos:**
  - Estoque baixo
  - Estoque zerado
  - Produto vencido
  - Próximo ao vencimento (≤ 7 dias)
  - Overstock

### 👥 **Módulo de Usuários Admin**

- ✅ Cadastro de usuários administrativos
- ✅ Autenticação JWT
- ✅ Perfis de acesso
- ✅ Histórico de ações

---

## 🛠️ Tecnologias Utilizadas

### **Backend**

- **Node.js** 18.x - Runtime JavaScript
- **NestJS** 10.x - Framework backend
- **TypeScript** 5.x - Linguagem tipada
- **TypeORM** 0.3.x - ORM para banco de dados
- **PostgreSQL** 15.x - Banco de dados relacional
- **Supabase** - Banco de dados em nuvem

### **Autenticação e Segurança**

- **JWT** - JSON Web Tokens
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de dados

### **Pagamentos**

- **Mercado Pago SDK** - Integração de pagamentos

### **Documentação**

- **Swagger** - Documentação automática da API
- **Compodoc** - Documentação do código

### **Ferramentas de Desenvolvimento**

- **ESLint** - Linter
- **Prettier** - Formatação de código
- **Insomnia** - Testes de API

### **Deploy**

- **Vercel** - Frontend
- **Railway/Render** - Backend
- **Supabase** - Banco de dados

---

## 🏗️ Arquitetura

### **Padrão MVC com Módulos**

```
src/
├── common/                    # Recursos compartilhados
│   ├── decorators/           # Decorators customizados
│   ├── filters/              # Exception filters
│   ├── guards/               # Guards (autenticação)
│   ├── interceptors/         # Interceptors
│   └── pipes/                # Pipes de validação
│
├── config/                    # Configurações
│   ├── database.config.ts    # Config do banco
│   └── app.config.ts         # Config geral
│
├── modules/                   # Módulos da aplicação
│   ├── auth/                 # Autenticação
│   ├── customer/             # Clientes
│   ├── product/              # Produtos
│   ├── product-category/     # Categorias
│   ├── order/                # Pedidos
│   ├── payment/              # Pagamentos
│   ├── review/               # Avaliações
│   ├── receipt/              # Comprovantes
│   ├── reports/              # Relatórios
│   ├── supplier/             # Fornecedores
│   ├── ingredient/           # Ingredientes/Estoque
│   ├── admin-user/           # Usuários Admin
│   └── notification/         # Notificações
│
├── app.module.ts             # Módulo principal
└── main.ts                   # Entry point
```

### **Estrutura de Módulo Padrão**

```
module/
├── controllers/              # Controllers REST
│   └── module. controller.ts
├── services/                 # Lógica de negócio
│   └── module. service.ts
├── entities/                 # Entidades TypeORM
│   └── module.entity.ts
├── dtos/                     # Data Transfer Objects
│   ├── create-module.dto.ts
│   └── update-module.dto.ts
├── enums/                    # Enumerações
│   └── module-status.enum.ts
├── interfaces/               # Interfaces TypeScript
│   └── module.interface.ts
├── module.module.ts          # Módulo NestJS
└── index.ts                  # Exports
```

---

## 📦 Módulos Implementados

| # | Módulo | Status | Endpoints | Testes |
|---|--------|--------|-----------|--------|
| 1 | Autenticação | ✅ 100% | 2 | ✅ |
| 2 | Clientes | ✅ 100% | 6 | ✅ |
| 3 | Categorias | ✅ 100% | 7 | ✅ |
| 4 | Produtos | ✅ 100% | 9 | ✅ |
| 5 | Pedidos | ✅ 100% | 11 | ✅ |
| 6 | Pagamentos | ✅ 100% | 2 | ✅ |
| 7 | Avaliações | ✅ 100% | 5 | ✅ |
| 8 | Comprovantes |✅ 100% | 3 |✅ |
| 9 | Relatórios | ✅ 100% | 6 | ✅ |
| 10 | Fornecedores | ✅ 100% | 20 | ✅ 14/14 |
| 11 | Ingredientes/Estoque | ✅ 100% | 16 | ✅ 30/30 |
| 12 | Usuários Admin | ✅ 100% | 1 | ✅ |

**Total:** 88 endpoints implementados

---

## 🚀 Instalação

### **Pré-requisitos**

- Node.js 18.x ou superior
- npm ou yarn
- Conta no Supabase
- Conta no Mercado Pago (opcional)

### **Passo 1: Clonar o Repositório**

```bash
git clone https://github.com/lucasitdias/pizzaria-massa-nostra-cco1b.git
cd pizzaria-massa-nostra-cco1b/api
```

### **Passo 2: Instalar Dependências**

```bash
npm install
```

### **Passo 3: Configurar Variáveis de Ambiente**

Criar arquivo `.env` na raiz do projeto:

```env
# Aplicação
NODE_ENV=development
PORT=3001
APP_NAME="Pizzaria Massa Nostra"

# Banco de Dados Supabase
DATABASE_HOST=db.xxx.supabase.co
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=postgres
DATABASE_SSL=true

# JWT
JWT_SECRET=seu_secret_super_secreto
JWT_EXPIRATION=7d

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token
MERCADOPAGO_PUBLIC_KEY=sua_public_key

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha
```

### **Passo 4: Criar Tabelas no Supabase**

Acessar o SQL Editor do Supabase e executar os scripts SQL disponíveis em:

- `docs/sql/01-create-tables.sql`
- `docs/sql/02-seed-data.sql`

Ou executar migration:

```bash
npm run migration:run
```

### **Passo 5: Rodar a Aplicação**

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em: `http://localhost:3001`

Swagger Docs: `http://localhost:3001/api-docs`

---

## ⚙️ Configuração

### **Banco de Dados (Supabase)**

1.  Criar projeto no [Supabase](https://supabase.com)
2. Copiar as credenciais de conexão
3. Executar os scripts SQL de criação de tabelas
4. Configurar Row Level Security (RLS) se necessário

### **Mercado Pago**

1.  Criar conta no [Mercado Pago](https://www. mercadopago.com. br/)
2. Acessar [Developers](https://www.mercadopago.com. br/developers/)
3. Criar aplicação
4. Copiar `Access Token` e `Public Key`
5. Configurar webhook: `https://seu-dominio.com/webhook/mercadopago`

### **Email (Opcional)**

Para envio de comprovantes por email:

1. Configurar conta Gmail com senha de app
2. Adicionar credenciais no `. env`

---

## 📖 Uso

### **Fluxo Completo do Cliente**

#### **1. Cadastro**

```http
POST /customer/register
Content-Type: application/json

{
  "nome_completo": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678900",
  "telefone": "11999999999",
  "senha": "Senha@123",
  "data_nascimento": "1990-01-01",
  "aceita_termos": true
}
```

#### **2. Login**

```http
POST /customer/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "Senha@123"
}
```

#### **3. Adicionar Endereço**

```http
POST /order/address
Authorization: Bearer {token}
Content-Type: application/json

{
  "cep": "01310-100",
  "rua": "Avenida Paulista",
  "numero": "1000",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

#### **4. Criar Pedido**

```http
POST /order
Authorization: Bearer {token}
Content-Type: application/json

{
  "address_id": 1,
  "items": [
    {
      "product_id": 1,
      "variant_id": 1,
      "quantity": 2,
      "observations": "Sem cebola"
    }
  ],
  "payment_method": "pix",
  "delivery_fee": 5.00
}
```

#### **5.  Acompanhar Pedido**

```http
GET /order/{order_id}
Authorization: Bearer {token}
```

#### **6.  Validar Entrega**

```http
POST /order/{order_id}/validate-token
Content-Type: application/json

{
  "token": "123456"
}
```

#### **7. Avaliar**

```http
POST /review/order/{order_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quality_rating": 5,
  "delivery_rating": 5,
  "service_rating": 5,
  "comment": "Pizza excelente!"
}
```

---

### **Fluxo Completo do Admin**

#### **1. Login Admin**

```http
POST /auth/authenticate
Content-Type: application/json

{
  "email": "admin@massanostra.com",
  "password": "Admin@123"
}
```

#### **2. Cadastrar Fornecedor**

```http
POST /supplier
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "razao_social": "Fornecedor LTDA",
  "cnpj": "12345678000190",
  "email": "contato@fornecedor.com",
  "telefone_principal": "11999999999",
  "cep": "01310-100",
  "rua": "Rua Exemplo",
  "numero": "100",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

#### **3. Cadastrar Ingrediente**

```http
POST /ingredient
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Farinha de Trigo",
  "unit_measure": "kg",
  "group": "ingredient",
  "cost_price": 4.50
}
```

#### **4.  Entrada de Estoque**

```http
POST /ingredient/stock/entry
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "ingredient_id": 1,
  "quantity": 100,
  "unit_cost": 4.50,
  "batch_number": "LOTE-001",
  "expiry_date": "2026-01-31",
  "supplier_id": 1,
  "invoice_number": "NF-12345"
}
```

#### **5. Consultar Relatórios**

```http
GET /reports/dashboard? start_date=2025-11-01&end_date=2025-11-30
Authorization: Bearer {admin_token}
```

---

## 🔗 API Endpoints

### **Documentação Completa**

Acesse a documentação interativa (Swagger):

```
http://localhost:3001/api-docs
```

### **Resumo dos Principais Endpoints**

#### **Autenticação**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/authenticate` | Login admin |
| POST | `/auth/verify-jwt` | Verificar token |

#### **Clientes**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/customer/register` | Cadastro |
| POST | `/customer/login` | Login |
| GET | `/customer/profile` | Ver perfil |
| PUT | `/customer/profile` | Atualizar |
| DELETE | `/customer/account` | Deletar conta |

#### **Produtos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/product` | Listar produtos |
| GET | `/product/:id` | Buscar por ID |
| POST | `/product` | Criar (admin) |
| PUT | `/product/:id` | Atualizar (admin) |
| DELETE | `/product/:id` | Deletar (admin) |

#### **Pedidos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/order` | Criar pedido |
| GET | `/order/:id` | Buscar pedido |
| GET | `/order/user/:userId` | Pedidos do usuário |
| PUT | `/order/:id/status` | Atualizar status |
| POST | `/order/:id/cancel` | Cancelar |

#### **Fornecedores**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/supplier` | Criar fornecedor |
| GET | `/supplier` | Listar |
| GET | `/supplier/:id` | Buscar por ID |
| PUT | `/supplier/:id` | Atualizar |
| DELETE | `/supplier/:id` | Deletar |
| POST | `/supplier/quote` | Criar cotação |
| POST | `/supplier/purchase-order` | Criar pedido compra |

#### **Ingredientes/Estoque**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/ingredient` | Criar ingrediente |
| GET | `/ingredient` | Listar |
| POST | `/ingredient/stock/entry` | Entrada estoque |
| POST | `/ingredient/stock/exit` | Saída estoque |
| GET | `/ingredient/stock/summary/:id` | Resumo |
| GET | `/ingredient/alerts` | Alertas ativos |

#### **Relatórios**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/reports/dashboard` | Dashboard |
| GET | `/reports/sales` | Vendas |
| GET | `/reports/top-products` | Top produtos |
| GET | `/reports/export/sales` | Exportar CSV |

---

## 🗄️ Banco de Dados

### **Diagrama ER (Principais Tabelas)**

```
common_users (clientes)
    ├── addresses (endereços)
    └── orders (pedidos)
            ├── order_items (itens do pedido)
            ├── payments (pagamentos)
            ├── order_reviews (avaliações)
            └── receipts (comprovantes)

products (produtos)
    ├── product_variants (variações)
    └── product_categories (categorias)

suppliers (fornecedores)
    ├── supplier_quotes (cotações)
    ├── purchase_orders (pedidos de compra)
    └── supplier_evaluations (avaliações)

ingredients (ingredientes)
    ├── stocks (estoque/lotes)
    ├── stock_movements (movimentações)
    └── stock_alerts (alertas)

admin_users (usuários admin)
```

### **Total de Tabelas**

- 30+ tabelas criadas
- Relacionamentos com Foreign Keys
- Índices para performance
- Soft delete implementado

---

## 🧪 Testes

### **Testes Realizados**

| Módulo | Testes | Status |
|--------|--------|--------|
| Fornecedores | 14/14 | ✅ 100% |
| Ingredientes/Estoque | 30/30 | ✅ 100% |
| Clientes | Manual | ✅ |
| Pedidos | Manual | ✅ |
| Pagamentos | Manual | ✅ |

### **Executar Testes**

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

### **Teste Manual com Insomnia**

Importar coleção disponível em: `docs/insomnia/pizzaria-massa-nostra.json`

---

## 🚀 Deploy

### **Backend (Railway)**

```bash
# 1. Criar conta no Railway
# 2. Conectar repositório GitHub
# 3. Adicionar variáveis de ambiente
# 4. Deploy automático
```

### **Banco de Dados (Supabase)**

- ✅ Já está em produção
- Backups automáticos
- SSL habilitado

### **Variáveis de Ambiente (Produção)**

```env
NODE_ENV=production
DATABASE_HOST=db.xxx.supabase.co
DATABASE_SSL=true
JWT_SECRET=secret_production_super_seguro
MERCADOPAGO_ACCESS_TOKEN=token_production
```

---

## 📊 Estatísticas do Projeto

```
📁 Arquivos TypeScript: 150+
📝 Linhas de Código: 15. 000+
🔗 Endpoints: 88
🗄️ Tabelas: 30+
✅ Testes: 44/44 (100%)
📚 Documentação: 100%
```

---

## 🗺️ Roadmap

### **Fase 1 - Completa ✅**
- [x] Autenticação
- [x] Clientes
- [x] Produtos
- [x] Pedidos
- [x] Pagamentos

### **Fase 2 - Completa ✅**
- [x] Avaliações
- [x] Comprovantes
- [x] Relatórios

### **Fase 3 - Completa ✅**
- [x] Fornecedores
- [x] Ingredientes/Estoque

### **Fase 5 - Futuro 📅**
- [ ] Integração WhatsApp
- [x] Rastreamento GPS
- [ ] Aplicativo mobile
- [ ] Programa de fidelidade

---

## 🤝 Contribuindo



### **Passo a Passo**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3.  Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### **Padrões de Código**

- ✅ Seguir ESLint e Prettier
- ✅ Comentar código complexo
- ✅ Criar testes para novas funcionalidades
- ✅ Atualizar documentação

---

## 📝 Licença

Este projeto é de propriedade de **Pizzaria Massa Nostra**. 

Todos os direitos reservados © 2025

---

## 👨‍💻 Desenvolvedor

**Lucas Dias**  
GitHub: [@lucasitdias](https://github.com/lucasitdias)  
Email: lucasitdias@example.com

---

## 📞 Contato e Suporte

- **Email:** suporte@massanostra.com
- **WhatsApp:** (11) 99999-9999
- **Documentação:** [GitHub Wiki](https://github.com/lucasitdias/pizzaria-massa-nostra-cco1b/wiki)
- **Issues:** [GitHub Issues](https://github.com/lucasitdias/pizzaria-massa-nostra-cco1b/issues)

---

## 📚 Documentação Adicional

### **Módulos Detalhados**

- [Gestão de Ingredientes e Estoque](docs/modules/INGREDIENT. md)
- [Gestão de Fornecedores](docs/modules/SUPPLIER.md)
- [Sistema de Pedidos](docs/modules/ORDER. md)
- [Integração Mercado Pago](docs/integrations/MERCADOPAGO. md)

### **Guias**

- [Guia de Instalação Completo](docs/guides/INSTALLATION. md)
- [Guia de Deploy](docs/guides/DEPLOYMENT. md)
- [Guia de Testes](docs/guides/TESTING.md)
- [FAQ](docs/FAQ.md)

---
