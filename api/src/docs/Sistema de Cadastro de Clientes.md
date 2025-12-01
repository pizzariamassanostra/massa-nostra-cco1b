# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 2: CLIENTES

---

## Sistema de Cadastro de Clientes

**Pizzaria Massa Nostra - Módulo de Gestão de Clientes**

---

## 🎯 Visão Geral

O módulo de clientes gerencia todo o ciclo de vida dos clientes da Pizzaria Massa Nostra, desde o cadastro inicial até a exclusão da conta (soft delete).  Permite que qualquer pessoa se cadastre no aplicativo, faça login, gerencie seu perfil e endereços de entrega.

---

## ✨ Funcionalidades

### ✅ 1. Cadastro de Clientes
- Registro de novos clientes
- Validação de CPF (formato e duplicidade)
- Validação de email (opcional, mas único se fornecido)
- Hash de senha com bcrypt
- Aceite de termos (LGPD)
- Aceite de promoções (opcional)

### ✅ 2.  Autenticação de Cliente
- Login via email OU telefone + senha
- Geração de token JWT (7 dias)
- Sessão stateless

### ✅ 3.  Gestão de Perfil
- Visualizar dados do perfil
- Atualizar informações pessoais
- Alterar senha
- Soft delete da conta

### ✅ 4. Gestão de Endereços
- Cadastrar múltiplos endereços
- Atualizar endereços
- Deletar endereços
- Listar endereços do cliente

---

## 🛣️ Endpoints da API

### **1. Cadastro de Cliente**

```http
POST /customer/register
Content-Type: application/json

{
  "nome_completo": "João Silva",
  "cpf": "12345678900",
  "data_nascimento": "1990-01-15",
  "telefone_principal": "38999999999",
  "telefone_alternativo": "38988888888",
  "email": "joao@email.com",
  "senha": "Senha@123",
  "aceita_termos": true,
  "aceita_promocoes": true
}
```

**Resposta de Sucesso (201):**
```json
{
  "ok": true,
  "message": "Cliente cadastrado com sucesso",
  "data": {
    "id": 1,
    "nome_completo": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "telefone_principal": "38999999999",
    "created_at": "2025-11-26T00:00:00.000Z"
  }
}
```

**Resposta de Erro (400) - CPF Duplicado:**
```json
{
  "ok": false,
  "errors": [{
    "message": "CPF já cadastrado",
    "userMessage": "Este CPF já está cadastrado no sistema"
  }]
}
```

**Validações:**
- ✅ Nome completo obrigatório (3-200 caracteres)
- ✅ CPF obrigatório (11 dígitos)
- ✅ CPF único no sistema
- ✅ Data de nascimento válida
- ✅ Telefone principal obrigatório (10-11 dígitos)
- ✅ Email único (se fornecido)
- ✅ Senha forte (mínimo 8 caracteres)
- ✅ Aceite de termos obrigatório

---

### **2. Login de Cliente**

```http
POST /customer/login
Content-Type: application/json

{
  "login": "joao@email.com",
  "senha": "Senha@123"
}
```

**OU com telefone:**

```http
POST /customer/login
Content-Type: application/json

{
  "login": "38999999999",
  "senha": "Senha@123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Login realizado com sucesso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nome_completo": "João Silva",
      "email": "joao@email.com",
      "telefone_principal": "38999999999"
    }
  }
}
```

**Resposta de Erro (401):**
```json
{
  "ok": false,
  "errors": [{
    "message": "Credenciais inválidas",
    "userMessage": "Email/telefone ou senha incorretos"
  }]
}
```

**Validações:**
- ✅ Login obrigatório (email OU telefone)
- ✅ Senha obrigatória
- ✅ Cliente deve existir e estar ativo
- ✅ Senha deve corresponder ao hash

---

### **3. Ver Perfil**

```http
GET /customer/profile
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "nome_completo": "João Silva",
    "cpf": "12345678900",
    "data_nascimento": "1990-01-15",
    "telefone_principal": "38999999999",
    "telefone_alternativo": "38988888888",
    "email": "joao@email.com",
    "aceita_termos": true,
    "aceita_promocoes": true,
    "created_at": "2025-11-26T00:00:00.000Z",
    "updated_at": "2025-11-26T00:00:00.000Z"
  }
}
```

---

### **4. Atualizar Perfil**

```http
PUT /customer/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome_completo": "João Silva Santos",
  "telefone_alternativo": "38977777777",
  "aceita_promocoes": false
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Perfil atualizado com sucesso",
  "data": {
    "id": 1,
    "nome_completo": "João Silva Santos",
    "telefone_alternativo": "38977777777",
    "aceita_promocoes": false
  }
}
```

**Campos Atualizáveis:**
- ✅ nome_completo
- ✅ telefone_principal
- ✅ telefone_alternativo
- ✅ email
- ✅ senha (com hash automático)
- ✅ aceita_promocoes

**Campos NÃO Atualizáveis:**
- ❌ cpf (nunca pode ser alterado)
- ❌ data_nascimento (nunca pode ser alterada)
- ❌ aceita_termos (apenas aceito uma vez)

---

### **5. Deletar Conta**

```http
DELETE /customer/account
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Conta excluída com sucesso.  Seus dados foram mantidos para fins de histórico."
}
```

**Comportamento:**
- ✅ Soft delete (marca `deleted_at`)
- ✅ Cliente não consegue mais fazer login
- ✅ Histórico de pedidos é mantido
- ✅ Dados mantidos para LGPD e auditoria

---

### **6. Adicionar Endereço**

```http
POST /order/address
Authorization: Bearer {token}
Content-Type: application/json

{
  "cep": "39400000",
  "rua": "Avenida Exemplo",
  "numero": "100",
  "complemento": "Apto 201",
  "bairro": "Centro",
  "cidade": "Montes Claros",
  "estado": "MG",
  "ponto_referencia": "Próximo ao supermercado",
  "instrucoes_entrega": "Não tocar campainha"
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
    "rua": "Avenida Exemplo",
    "numero": "100",
    "bairro": "Centro",
    "cidade": "Montes Claros",
    "estado": "MG"
  }
}
```

**Validações:**
- ✅ CEP obrigatório (8 dígitos)
- ✅ Rua obrigatória
- ✅ Número obrigatório
- ✅ Bairro obrigatório
- ✅ Cidade obrigatória
- ✅ Estado obrigatório (2 letras - UF)

---

### **7. Listar Endereços**

```http
GET /order/address/user/{userId}
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "cep": "39400000",
      "rua": "Avenida Exemplo",
      "numero": "100",
      "complemento": "Apto 201",
      "bairro": "Centro",
      "cidade": "Montes Claros",
      "estado": "MG",
      "ponto_referencia": "Próximo ao supermercado"
    },
    {
      "id": 2,
      "cep": "39401000",
      "rua": "Rua das Flores",
      "numero": "200",
      "bairro": "Jardim",
      "cidade": "Montes Claros",
      "estado": "MG"
    }
  ]
}
```

---

### **8. Atualizar Endereço**

```http
PUT /order/address/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "numero": "102",
  "complemento": "Apto 202",
  "instrucoes_entrega": "Tocar campainha"
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

### **9. Deletar Endereço**

```http
DELETE /order/address/{id}
Authorization: Bearer {token}
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
src/modules/common-user/
├── controllers/
│   ├── common-user.controller.ts   # 1 endpoint (listar)
│   └── customer.controller.ts      # 5 endpoints (CRUD cliente)
├── services/
│   └── customer.service.ts         # Lógica de negócio
├── entities/
│   └── common-user.entity.ts       # Entidade TypeORM
├── dto/
│   ├── register-customer.dto.ts    # DTO de cadastro
│   ├── login-customer.dto.ts       # DTO de login
│   └── update-customer.dto.ts      # DTO de atualização
├── common-user.module.ts           # Módulo NestJS
└── index.ts                        # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `common_users`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| nome_completo | VARCHAR(200) | Nome completo (obrigatório) |
| cpf | VARCHAR(11) | CPF único (11 dígitos) |
| data_nascimento | DATE | Data de nascimento |
| telefone_principal | VARCHAR(15) | Telefone (obrigatório) |
| telefone_alternativo | VARCHAR(15) | Telefone alternativo (opcional) |
| email | VARCHAR(200) | Email único (opcional) |
| senha | VARCHAR(255) | Hash bcrypt da senha |
| aceita_termos | BOOLEAN | Aceite de termos (LGPD) |
| aceita_promocoes | BOOLEAN | Aceite de promoções |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| deleted_at | TIMESTAMP | Soft delete |

**Índices:**
- `idx_common_users_cpf` (cpf)
- `idx_common_users_email` (email)
- `idx_common_users_telefone` (telefone_principal)
- `idx_common_users_deleted` (deleted_at)

**Constraints:**
- `UNIQUE` em cpf
- `UNIQUE` em email (quando não nulo)

**SQL de Criação:**
```sql
CREATE TABLE public.common_users (
  id SERIAL PRIMARY KEY,
  nome_completo VARCHAR(200) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  data_nascimento DATE,
  telefone_principal VARCHAR(15) NOT NULL,
  telefone_alternativo VARCHAR(15),
  email VARCHAR(200) UNIQUE,
  senha VARCHAR(255) NOT NULL,
  aceita_termos BOOLEAN DEFAULT FALSE,
  aceita_promocoes BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_common_users_cpf ON public.common_users(cpf);
CREATE INDEX idx_common_users_email ON public.common_users(email);
CREATE INDEX idx_common_users_telefone ON public.common_users(telefone_principal);
CREATE INDEX idx_common_users_deleted ON public.common_users(deleted_at);
```

---

## 🔐 Segurança

### **1. Validação de CPF**

```typescript
// Validação de formato
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, ''); // Remove não-dígitos
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // Sequência repetida
  
  // Validação de dígitos verificadores
  // ...  algoritmo completo
  
  return true;
}
```

### **2. Hash de Senha**

```typescript
import * as bcrypt from 'bcrypt';

// Ao cadastrar
const hashedPassword = await bcrypt.hash(senha, 10);

// Ao fazer login
const isValid = await bcrypt.compare(senha, hashedPassword);
```

### **3. Proteção de Dados (LGPD)**

- ✅ Soft delete mantém histórico
- ✅ Aceite de termos obrigatório
- ✅ Aceite de promoções separado
- ✅ Dados pessoais não expostos em logs
- ✅ Email opcional (não obrigatório)

---

## 📝 DTOs (Data Transfer Objects)

### **RegisterCustomerDto**

```typescript
import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsOptional, 
  MinLength,
  MaxLength,
  IsBoolean,
  Matches
} from 'class-validator';

export class RegisterCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(200, { message: 'Nome deve ter no máximo 200 caracteres' })
  nome_completo: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  cpf: string;

  @IsOptional()
  data_nascimento?: Date;

  @IsString()
  @IsNotEmpty({ message: 'Telefone principal é obrigatório' })
  @Matches(/^\d{10,11}$/, { message: 'Telefone inválido' })
  telefone_principal: string;

  @IsOptional()
  @IsString()
  telefone_alternativo?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  senha: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Aceite de termos é obrigatório' })
  aceita_termos: boolean;

  @IsOptional()
  @IsBoolean()
  aceita_promocoes?: boolean;
}
```

---

## 🧪 Testes Completos

### **TESTE 1: Cadastro com Sucesso**

**Request:**
```http
POST http://localhost:3001/customer/register
Content-Type: application/json

{
  "nome_completo": "Maria Silva",
  "cpf": "98765432100",
  "data_nascimento": "1995-05-20",
  "telefone_principal": "38988887777",
  "email": "maria@email.com",
  "senha": "Senha@123",
  "aceita_termos": true,
  "aceita_promocoes": true
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Cliente cadastrado com sucesso",
  "data": {
    "id": 2,
    "nome_completo": "Maria Silva",
    "cpf": "98765432100",
    "email": "maria@email.com"
  }
}
```

**Status:** 201 Created

---

### **TESTE 2: Cadastro com CPF Duplicado**

**Request:**
```http
POST http://localhost:3001/customer/register
Content-Type: application/json

{
  "nome_completo": "Outro Cliente",
  "cpf": "12345678900",
  "telefone_principal": "38999998888",
  "senha": "Senha@123",
  "aceita_termos": true
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "CPF já cadastrado"
  }]
}
```

**Status:**  400 Bad Request

---

### **TESTE 3: Login com Email**

**Request:**
```http
POST http://localhost:3001/customer/login
Content-Type: application/json

{
  "login": "joao@email.com",
  "senha": "Senha@123"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Login realizado com sucesso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nome_completo": "João Silva"
    }
  }
}
```

**Status:**  200 OK

---

### **TESTE 4: Login com Telefone**

**Request:**
```http
POST http://localhost:3001/customer/login
Content-Type: application/json

{
  "login": "38999999999",
  "senha": "Senha@123"
}
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "access_token": "eyJ..."
  }
}
```

**Status:** 200 OK

---

### **TESTE 5: Ver Perfil**

**Request:**
```http
GET http://localhost:3001/customer/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "nome_completo": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "telefone_principal": "38999999999"
  }
}
```

**Status:**  200 OK

---

### **TESTE 6: Atualizar Perfil**

**Request:**
```http
PUT http://localhost:3001/customer/profile
Authorization: Bearer eyJ... 
Content-Type: application/json

{
  "nome_completo": "João Silva Santos",
  "aceita_promocoes": false
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Perfil atualizado com sucesso"
}
```

**Status:**  200 OK

---

### **TESTE 7: Deletar Conta (Soft Delete)**

**Request:**
```http
DELETE http://localhost:3001/customer/account
Authorization: Bearer eyJ...
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Conta excluída com sucesso"
}
```

**Status:**  200 OK

**Validação no Banco:**
```sql
SELECT deleted_at FROM common_users WHERE id = 1;
-- Deve retornar timestamp (não NULL)
```

---

## ✅ Checklist de Validação

```
□ Cadastro com dados válidos funciona
□ CPF duplicado retorna erro
□ Email duplicado retorna erro (se fornecido)
□ Login com email funciona
□ Login com telefone funciona
□ Login com senha errada retorna erro 401
□ Ver perfil retorna dados corretos
□ Atualizar perfil funciona
□ Não permite atualizar CPF
□ Deletar conta marca deleted_at
□ Cliente deletado não consegue fazer login
□ Histórico mantido após exclusão
□ Senha armazenada em hash bcrypt
□ Token JWT válido por 7 dias
```

---

## 📊 Fluxo de Cadastro e Login

```
┌──────────────┐
│   Cliente    │
│  (Novo)      │
└──────┬───────┘
       │ 1. POST /customer/register
       │    { nome, cpf, senha, ...  }
       ▼
┌────────────────────────┐
│  CustomerController    │
└──────┬─────────────────┘
       │ 2.  Validar dados
       ▼
┌──────────────────────────┐
│  CustomerService         │
│  ├─ Validar CPF          │
│  ├─ Verificar duplicidade│
│  ├─ Hash senha (bcrypt)  │
│  └─ Salvar no banco      │
└──────┬───────────────────┘
       │ 3. Retornar sucesso
       ▼
┌──────────────┐
│   Cliente    │
│  (Cadastrado)│
└──────────────┘

┌──────────────┐
│   Cliente    │
└──────┬───────┘
       │ 4. POST /customer/login
       │    { login, senha }
       ▼
┌────────────────────────┐
│  CustomerService       │
│  ├─ Buscar por email/tel
│  ├─ Validar senha      │
│  └─ Gerar JWT          │
└──────┬─────────────────┘
       │ 5. Retornar token
       ▼
┌──────────────┐
│   Cliente    │
│  (Logado)    │
└──────────────┘
```

---

## 🚀 Exemplos de Uso Completo

### **Cenário 1: Novo Cliente se Cadastra**

```bash
# 1. Cadastrar
curl -X POST http://localhost:3001/customer/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Carlos Souza",
    "cpf": "11122233344",
    "telefone_principal": "38977776666",
    "email": "carlos@email.com",
    "senha": "Carlos@123",
    "aceita_termos": true
  }'

# 2. Fazer login
curl -X POST http://localhost:3001/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "carlos@email.com",
    "senha": "Carlos@123"
  }'

# 3. Ver perfil (com token)
curl -X GET http://localhost:3001/customer/profile \
  -H "Authorization: Bearer eyJ..."
```

---

## 📚 Referências Técnicas

- [NestJS Validation](https://docs.nestjs. com/techniques/validation)
- [class-validator](https://github.com/typestack/class-validator)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Clientes  

---
