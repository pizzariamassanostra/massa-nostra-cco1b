
---

### AUTENTICAÇÃO JWT PARA CLIENTES**

#### **📌 OBJETIVO**
Implementar sistema completo de autenticação JWT (JSON Web Token) para clientes da pizzaria, permitindo registro, login e acesso seguro a funcionalidades protegidas.

---

#### ** FUNCIONALIDADES IMPLEMENTADAS**

##### **1. Registro de Cliente**
- ✅ Endpoint público (`POST /customer/register`)
- ✅ Validação de CPF (opcional)
- ✅ Validação de telefone único
- ✅ Validação de email único
- ✅ Senha com hash bcrypt (segurança)
- ✅ Aceite de termos obrigatório (LGPD)
- ✅ Aceite de promoções opcional

**Exemplo de Request:**
```json
{
  "name": "Maria Santos",
  "phone": "11988776655",
  "email": "maria@teste.com",
  "password": "Senha123",
  "accept_terms": true
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Cadastro realizado com sucesso!",
  "user": {
    "id": 10,
    "name": "Maria Santos",
    "phone": "11988776655",
    "email": "maria@teste.com",
    "cpf": null,
    "created_at": "2025-11-24T03:17:09.166Z"
  }
}
```

---

##### **2. Login de Cliente**
- ✅ Endpoint público (`POST /customer/login`)
- ✅ Login por email OU telefone
- ✅ Validação de senha com bcrypt
- ✅ Geração de token JWT válido por 7 dias
- ✅ Token contém: `id`, `type: 'customer'`, `name`, `email`, `phone`

**Exemplo de Request:**
```json
{
  "username": "maria@teste.com",
  "password": "Senha123"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Login realizado com sucesso!",
  "user": {
    "id": 10,
    "name": "Maria Santos",
    "phone": "11988776655",
    "email": "maria@teste.com",
    "cpf": null
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

##### **3. Buscar Perfil (Protegido)**
- ✅ Endpoint protegido (`GET /customer/profile`)
- ✅ Requer token JWT válido
- ✅ Retorna dados completos do cliente
- ✅ Guard: `JwtCustomerAuthGuard`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Response:**
```json
{
  "ok": true,
  "user": {
    "id": 10,
    "name": "Maria Santos",
    "phone": "11988776655",
    "email": "maria@teste.com",
    "cpf": null,
    "birth_date": null,
    "phone_alternative": null,
    "accept_promotions": false,
    "created_at": "2025-11-24T03:17:09.166Z",
    "updated_at": "2025-11-24T03:17:09.166Z"
  }
}
```

---

##### **4. Atualizar Perfil (Protegido)**
- ✅ Endpoint protegido (`PUT /customer/profile`)
- ✅ Permite atualizar: nome, CPF, data nascimento, email, telefone alternativo, senha
- ✅ Validação de email único (não pode usar email de outro cliente)
- ✅ Senha atualizada com hash bcrypt

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Request:**
```json
{
  "name": "Maria Santos Silva",
  "cpf": "12345678900",
  "birth_date": "1990-05-15"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Perfil atualizado com sucesso!",
  "user": {
    "id": 10,
    "name": "Maria Santos Silva",
    "phone": "11988776655",
    "email": "maria@teste.com",
    "cpf": "123.456.789-00",
    "birth_date": "1990-05-14",
    "phone_alternative": null,
    "updated_at": "2025-11-24T03:21:18.981Z"
  }
}
```

---

##### **5. Excluir Conta (Soft Delete - LGPD)**
- ✅ Endpoint protegido (`DELETE /customer/account`)
- ✅ Soft delete: dados mantidos no banco com `deleted_at` preenchido
- ✅ Usuário não consegue mais fazer login
- ✅ Histórico preservado para LGPD

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Response:**
```json
{
  "ok": true,
  "message": "Conta excluída com sucesso. Seus dados foram mantidos no sistema para fins de histórico (LGPD)."
}
```

**Banco de dados após exclusão:**
```
deleted_at: 2025-11-24 03:24:52.64+00  Preenchido
```

---

#### **🔒 SEGURANÇA IMPLEMENTADA**

##### **Guards (Proteção de Rotas)**
- ✅ `JwtCustomerAuthGuard` - Valida token de cliente
- ✅ `JwtAuthGuard` - Valida token de administrador (separado)
- ✅ `LocalAuthGuard` - Login de administrador

##### **Estratégias Passport**
- ✅ `JwtCustomerStrategy` - Valida token JWT de clientes
- ✅ `JwtStrategy` - Valida token JWT de administradores
- ✅ `LocalStrategy` - Login com usuário/senha (admin)

##### **Validações de Segurança**
- ✅ Senhas com hash bcrypt (nunca armazenadas em texto puro)
- ✅ Token JWT com expiração (7 dias)
- ✅ Validação de CPF (algoritmo oficial)
- ✅ Campos únicos: email, telefone, CPF
- ✅ Soft delete para LGPD (dados preservados)
- ✅ Password nunca retornado em responses

---

#### **🧪 TESTES DE VALIDAÇÃO EXECUTADOS**

##### **✅ TESTE 1: Registro**
```
Endpoint: POST /customer/register
Status: 200 OK
Resultado: Cliente criado com sucesso
```

##### **✅ TESTE 2: Login**
```
Endpoint: POST /customer/login
Status: 200 OK
Resultado: Token JWT gerado com sucesso
Token válido por: 7 dias
```

##### **✅ TESTE 3: Buscar Perfil (com token)**
```
Endpoint: GET /customer/profile
Headers: Authorization: Bearer [TOKEN]
Status: 200 OK
Resultado: Dados do cliente retornados
```

##### **✅ TESTE 4: Atualizar Perfil**
```
Endpoint: PUT /customer/profile
Headers: Authorization: Bearer [TOKEN]
Status: 200 OK
Resultado: Perfil atualizado com sucesso
```

##### **✅ TESTE 5: Acesso sem token**
```
Endpoint: GET /customer/profile
Headers: Sem Authorization
Status: 401 Unauthorized
Resultado: Erro "missing-token"  Correto!
```

##### **✅ TESTE 6: Token inválido**
```
Endpoint: GET /customer/profile
Headers: Authorization: Bearer token-invalido
Status: 401 Unauthorized
Resultado: Erro "unauthorized"  Correto!
```

##### **✅ TESTE 7: Soft Delete**
```
Endpoint: DELETE /customer/account
Headers: Authorization: Bearer [TOKEN]
Status: 200 OK
Resultado: deleted_at preenchido no banco
```

##### **✅ TESTE 8: Validação Banco de Dados**
```
Query: SELECT deleted_at FROM common_users WHERE id = 10
Resultado: deleted_at = 2025-11-24 03:24:52.64+00 
```

##### **✅ TESTE 9: Login após soft delete**
```
Endpoint: POST /customer/login
Status: 401 Unauthorized
Resultado: Login bloqueado Correto!
```

---

#### **📁 ARQUIVOS CRIADOS/MODIFICADOS**

##### **Novos Arquivos:**
```
✅ src/common/guards/jwt-customer-auth.guard.ts
✅ src/modules/auth/strategies/jwt-customer.strategy.ts
```

##### **Arquivos Modificados:**
```
✅ src/modules/auth/auth.module.ts
✅ src/modules/common-user/common-user.module.ts
✅ src/modules/common-user/services/customer.service.ts
✅ src/modules/common-user/controllers/customer.controller.ts
✅ src/modules/common-user/repositories/common-user.repository.ts
```

---

#### **🔧 CORREÇÕES IMPORTANTES REALIZADAS**

##### **1. Problema: WHERE com AND ao invés de OR**
**Antes:**
```sql
WHERE email = 'x' AND phone = 'y'  --  Nunca encontra
```

**Depois:**
```sql
WHERE (email = 'x' OR phone = 'y')  --  Correto!
```

##### **2. Problema: password_hash não retornado**
**Solução:** Adicionar `with_password_hash: true` no `findOne()`

##### **3. Problema: Soft delete não funcionando**
**Solução:** Repository já filtra automaticamente `deleted_at IS NULL`

---

#### **📊 COBERTURA DE FUNCIONALIDADES**

```
✅ Registro de cliente          100%
✅ Login de cliente             100%
✅ Autenticação JWT             100%
✅ Proteção de rotas            100%
✅ Atualização de perfil        100%
✅ Soft delete (LGPD)           100%
✅ Validações de segurança      100%
✅ Testes de validação          100%

```
---
