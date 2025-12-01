// ===========================================
// ENUMERAÇÃO DE ROLES (PAPÉIS)
// Define todos os papéis disponíveis no sistema
// Hierarquia: ADMIN > GERÊNCIA > ANALISTA > ASSISTENTE > AUXILIAR > GARÇOM/COZINHEIRA/ENTREGADOR
// ===========================================

export enum RoleEnum {
  // Administração
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',

  // Análise
  ANALYST = 'analyst',

  // Assistência
  ASSISTANT = 'assistant',
  AUXILIARY = 'auxiliary',

  // Operacional
  WAITER = 'waiter',
  COOK = 'cook',
  DELIVERY = 'delivery',
}

// NOMES DE EXIBIÇÃO
export const RoleLabels: Record<RoleEnum, string> = {
  [RoleEnum.SUPER_ADMIN]: 'Super Administrador',
  [RoleEnum.MANAGER]: 'Gerente',
  [RoleEnum.ANALYST]: 'Analista',
  [RoleEnum.ASSISTANT]: 'Assistente',
  [RoleEnum.AUXILIARY]: 'Auxiliar',
  [RoleEnum.WAITER]: 'Garçom',
  [RoleEnum.COOK]: 'Cozinheira',
  [RoleEnum.DELIVERY]: 'Motoboy',
};

// NÍVEIS HIERÁRQUICOS
export const RoleLevels: Record<RoleEnum, number> = {
  [RoleEnum.SUPER_ADMIN]: 1,
  [RoleEnum.MANAGER]: 2,
  [RoleEnum.ANALYST]: 3,
  [RoleEnum.ASSISTANT]: 4,
  [RoleEnum.AUXILIARY]: 5,
  [RoleEnum.WAITER]: 6,
  [RoleEnum.COOK]: 6,
  [RoleEnum.DELIVERY]: 6,
};
