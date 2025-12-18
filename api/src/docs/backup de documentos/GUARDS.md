// ============================================
// GUARDS DIFERENTES - CADA UM TEM SUA FUNÇÃO
// ============================================

// 1. local-auth.guard.ts
// → Usado APENAS no LOGIN de ADMIN
// → Valida usuário/senha (estratégia 'local')
// → Endpoint: POST /auth/authenticate

// 2. jwt-auth.guard.ts
// → Protege rotas de ADMIN
// → Valida token JWT de ADMINISTRADOR
// → Endpoints: Qualquer rota administrativa

// 3. jwt-customer-auth.guard.ts (NOVO!)
// → Protege rotas de CLIENTE
// → Valida token JWT de CLIENTE
// → Endpoints: /customer/profile, /customer/account, etc
