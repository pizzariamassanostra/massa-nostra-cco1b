# 📚 DOCUMENTAÇÃO COMPLETA - MÓDULO 1: AUTENTICAÇÃO

---

## Sistema de Autenticação

**Pizzaria Massa Nostra - Módulo de Autenticação e Segurança**

---

## 🎯 Visão Geral

O módulo de autenticação gerencia o login e controle de acesso de usuários administrativos da Pizzaria Massa Nostra.  Utiliza JWT (JSON Web Tokens) para autenticação stateless e bcrypt para hash de senhas. 

---

## ✨ Funcionalidades

### ✅ 1. Login de Usuários Admin
- Autenticação via email e senha
- Geração de token JWT
- Validação de credenciais
- Hash de senha com bcrypt

### ✅ 2. Verificação de Token
- Validação de JWT
- Extração de dados do usuário
- Verificação de expiração

### ✅ 3. Proteção de Rotas
- Guard JWT para rotas protegidas
- Middleware de autenticação
- Estratégia Passport

---

## 🛣️ Endpoints da API

### **1. Login Admin**

```http
POST /auth/authenticate
Content-Type: application/json

{
  "email": "admin@massanostra.com",
  "password": "Admin@123"
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
      "id": 7,
      "name": "Administrador",
      "email": "admin@massanostra.com"
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
    "userMessage": "Email ou senha incorretos"
  }]
}
```

**Validações:**
- ✅ Email obrigatório e formato válido
- ✅ Senha obrigatória (mínimo 6 caracteres)
- ✅ Usuário deve existir e estar ativo
- ✅ Senha deve corresponder ao hash no banco

---

### **2. Verificar Token JWT**

```http
POST /auth/verify-jwt
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Sucesso (200):**
```json
{
  "ok": true,
  "message": "Token válido",
  "data": {
    "userId": 7,
    "email": "admin@massanostra. com",
    "iat": 1732571241,
    "exp": 1733176041
  }
}
```

**Resposta de Erro (401):**
```json
{
  "ok": false,
  "errors": [{
    "message": "Token inválido ou expirado",
    "userMessage": "Token inválido ou expirado"
  }]
}
```

**Validações:**
- ✅ Token obrigatório
- ✅ Token deve ser válido
- ✅ Token não pode estar expirado

---

## 📁 Estrutura de Arquivos

```
src/modules/auth/
├── controllers/
│   └── auth.controller.ts          # 2 endpoints REST
├── services/
│   └── auth. service.ts             # Lógica de autenticação
├── strategies/
│   └── jwt.strategy.ts             # Estratégia Passport JWT
├── guards/
│   └── jwt-auth.guard.ts           # Guard de proteção
├── dto/
│   ├── login.dto.ts                # DTO de login
│   └── verify-jwt.dto.ts           # DTO de verificação
├── interfaces/
│   └── jwt-payload.interface.ts    # Interface do payload JWT
├── auth.module.ts                  # Módulo NestJS
└── index.ts                        # Exports
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `admin_users`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do usuário |
| name | VARCHAR(200) | Nome completo |
| email | VARCHAR(200) | Email (único) |
| password | VARCHAR(255) | Hash bcrypt da senha |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| deleted_at | TIMESTAMP | Soft delete |

**Índices:**
- `idx_admin_users_email` (email)
- `idx_admin_users_deleted` (deleted_at)

**SQL de Criação:**
```sql
CREATE TABLE public.admin_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_deleted ON public.admin_users(deleted_at);
```

---

## 🔐 Segurança

### **1. Hash de Senha (bcrypt)**

**Geração:**
```typescript
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash('Admin@123', saltRounds);
// Resultado: $2b$10$XqZ7... 
```

**Validação:**
```typescript
const isValid = await bcrypt.compare('Admin@123', hashedPassword);
// Retorna: true ou false
```

---

### **2. JWT (JSON Web Token)**

**Payload:**
```json
{
  "sub": 7,
  "email": "admin@massanostra. com",
  "iat": 1732571241,
  "exp": 1733176041
}
```

**Configuração:**
```typescript
{
  secret: process.env. JWT_SECRET,
  signOptions: { 
    expiresIn: '7d' // 7 dias
  }
}
```

**Estrutura do Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.     // Header
eyJzdWIiOjcsImVtYWlsIjoiYWRtaW5AbWFz...     // Payload
U4vr-Yz8oYXSE6tLgLaK9SAg5l8xXyIlQ_AQ4nvMp2w  // Signature
```

---

### **3. Proteção de Rotas**

**Uso do Guard:**
```typescript
@Controller('product')
@UseGuards(JwtAuthGuard) // Protege todas as rotas
export class ProductController {
  // Apenas usuários autenticados podem acessar
}
```

**Guard Flexível (Admin OU Cliente):**
```typescript
@Controller('order')
@UseGuards(JwtFlexibleAuthGuard) // Aceita admin_users OU common_users
export class OrderController {
  // ... 
}
```

---

## 📝 DTOs (Data Transfer Objects)

### **LoginDto**

```typescript
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
```

### **VerifyJwtDto**

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyJwtDto {
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;
}
```

---

## 🧪 Testes Completos

### **TESTE 1: Login com Sucesso**

**Request:**
```http
POST http://localhost:3001/auth/authenticate
Content-Type: application/json

{
  "email": "admin@massanostra.com",
  "password": "Admin@123"
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
      "id": 7,
      "name": "Administrador",
      "email": "admin@massanostra.com"
    }
  }
}
```

**Status:** 200 OK

---

### **TESTE 2: Login com Email Inválido**

**Request:**
```http
POST http://localhost:3001/auth/authenticate
Content-Type: application/json

{
  "email": "invalido@email.com",
  "password": "Admin@123"
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Credenciais inválidas",
    "userMessage": "Email ou senha incorretos"
  }]
}
```

**Status:** 401 Unauthorized

---

### **TESTE 3: Login com Senha Incorreta**

**Request:**
```http
POST http://localhost:3001/auth/authenticate
Content-Type: application/json

{
  "email": "admin@massanostra.com",
  "password": "SenhaErrada123"
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Credenciais inválidas",
    "userMessage": "Email ou senha incorretos"
  }]
}
```

**Status:** 401 Unauthorized

---

### **TESTE 4: Verificar Token Válido**

**Request:**
```http
POST http://localhost:3001/auth/verify-jwt
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Token válido",
  "data": {
    "userId": 7,
    "email": "admin@massanostra.com"
  }
}
```

**Status:** 200 OK

---

### **TESTE 5: Verificar Token Expirado**

**Request:**
```http
POST http://localhost:3001/auth/verify-jwt
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. EXPIRED..."
}
```

**Expected Response:**
```json
{
  "ok": false,
  "errors": [{
    "message": "Token inválido ou expirado"
  }]
}
```

**Status:** 401 Unauthorized

---

## ⚙️ Variáveis de Ambiente

```env
# JWT Configuration
JWT_SECRET=seu_secret_super_secreto_aqui
JWT_EXPIRATION=7d

# Bcrypt
BCRYPT_ROUNDS=10
```

---

## 🔧 Configuração do Módulo

**auth.module.ts:**
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AdminUser } from '@/modules/admin-user/entities/admin-user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt. strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 📊 Fluxo de Autenticação

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ 1. POST /auth/authenticate
       │    { email, password }
       ▼
┌─────────────────────────┐
│   AuthController        │
└──────┬──────────────────┘
       │ 2. validateUser()
       ▼
┌─────────────────────────┐
│   AuthService           │
│  ├─ Buscar usuário      │
│  ├─ Validar senha       │
│  └─ Gerar JWT           │
└──────┬──────────────────┘
       │ 3.  Retornar token
       ▼
┌─────────────┐
│   Cliente   │
│  (armazena  │
│   token)    │
└─────────────┘

┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ 4. GET /product (com token)
       │    Authorization: Bearer {token}
       ▼
┌─────────────────────────┐
│   JwtAuthGuard          │
│  (valida token)         │
└──────┬──────────────────┘
       │ 5. Token válido
       ▼
┌─────────────────────────┐
│   ProductController     │
│  (endpoint protegido)   │
└─────────────────────────┘
```

---

## ✅ Checklist de Validação

```
□ Login com credenciais corretas retorna token
□ Login com email inválido retorna erro 401
□ Login com senha incorreta retorna erro 401
□ Token gerado é válido por 7 dias
□ Verificação de token válido retorna dados do usuário
□ Verificação de token expirado retorna erro 401
□ Guard protege rotas corretamente
□ Senha é armazenada em hash bcrypt
□ Token não expõe dados sensíveis
□ Soft delete funciona (deleted_at)
```

---

## 🚀 Exemplos de Uso

### **Exemplo 1: Login e Uso do Token**

```bash
# 1.  Fazer login
curl -X POST http://localhost:3001/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@massanostra.com","password":"Admin@123"}'

# Resposta:
# {"ok":true,"data":{"access_token":"eyJ..."}}

# 2. Usar token em requisição protegida
curl -X GET http://localhost:3001/product \
  -H "Authorization: Bearer eyJ..."
```

---

### **Exemplo 2: Verificar Validade do Token**

```bash
curl -X POST http://localhost:3001/auth/verify-jwt \
  -H "Content-Type: application/json" \
  -d '{"token":"eyJ..."}'
```

---

## 📚 Referências Técnicas

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT](http://www.passportjs.org/packages/passport-jwt/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [JWT. io](https://jwt.io/)

---

## 🔄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 26/11/2025 | Versão inicial completa |

---

## 👨‍💻 Desenvolvedor

**Lucas Dias** (@lucasitdias)  
**Projeto:** Pizzaria Massa Nostra  
**Módulo:** Autenticação  

---
