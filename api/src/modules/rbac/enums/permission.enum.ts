/**
 * ============================================
 * ENUMERAÇÃO DE PERMISSÕES
 * ============================================
 * Define todas as permissões disponíveis no sistema
 * Formato: RESOURCE_ACTION
 * Exemplo: ORDERS_CREATE, USERS_READ
 */

export enum PermissionEnum {
  // ========================================
  // PERMISSÕES DE USUÁRIOS
  // ========================================
  USERS_CREATE = 'users:create',
  USERS_READ = 'users:read',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  USERS_LIST = 'users:list',

  // ========================================
  // PERMISSÕES DE PEDIDOS
  // ========================================
  ORDERS_CREATE = 'orders:create',
  ORDERS_READ = 'orders:read',
  ORDERS_UPDATE = 'orders:update',
  ORDERS_DELETE = 'orders:delete',
  ORDERS_LIST = 'orders:list',
  ORDERS_UPDATE_STATUS = 'orders:update_status',
  ORDERS_CANCEL = 'orders:cancel',

  // ========================================
  // PERMISSÕES DE PRODUTOS
  // ========================================
  PRODUCTS_CREATE = 'products:create',
  PRODUCTS_READ = 'products:read',
  PRODUCTS_UPDATE = 'products:update',
  PRODUCTS_DELETE = 'products:delete',
  PRODUCTS_LIST = 'products:list',

  // ========================================
  // PERMISSÕES DE CATEGORIAS
  // ========================================
  CATEGORIES_CREATE = 'categories:create',
  CATEGORIES_READ = 'categories:read',
  CATEGORIES_UPDATE = 'categories:update',
  CATEGORIES_DELETE = 'categories:delete',
  CATEGORIES_LIST = 'categories:list',

  // ========================================
  // PERMISSÕES DE RELATÓRIOS
  // ========================================
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',
  REPORTS_DASHBOARD = 'reports:dashboard',
  REPORTS_SALES = 'reports:sales',
  REPORTS_CUSTOMERS = 'reports:customers',

  // ========================================
  // PERMISSÕES DE INGREDIENTES
  // ========================================
  INGREDIENTS_CREATE = 'ingredients:create',
  INGREDIENTS_READ = 'ingredients:read',
  INGREDIENTS_UPDATE = 'ingredients:update',
  INGREDIENTS_DELETE = 'ingredients:delete',
  INGREDIENTS_LIST = 'ingredients:list',
  INGREDIENTS_STOCK = 'ingredients:stock',

  // ========================================
  // PERMISSÕES DE FORNECEDORES
  // ========================================
  SUPPLIERS_CREATE = 'suppliers:create',
  SUPPLIERS_READ = 'suppliers:read',
  SUPPLIERS_UPDATE = 'suppliers:update',
  SUPPLIERS_DELETE = 'suppliers:delete',
  SUPPLIERS_LIST = 'suppliers:list',

  // ========================================
  // PERMISSÕES DE PAGAMENTOS
  // ========================================
  PAYMENTS_CREATE = 'payments:create',
  PAYMENTS_READ = 'payments:read',
  PAYMENTS_LIST = 'payments:list',
  PAYMENTS_REFUND = 'payments:refund',

  // ========================================
  // PERMISSÕES DE CONFIGURAÇÕES
  // ========================================
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',

  // ========================================
  // PERMISSÕES DE ROLES E PERMISSÕES
  // ========================================
  ROLES_CREATE = 'roles:create',
  ROLES_READ = 'roles:read',
  ROLES_UPDATE = 'roles:update',
  ROLES_DELETE = 'roles:delete',
  ROLES_ASSIGN = 'roles:assign',

  PERMISSIONS_READ = 'permissions:read',
  PERMISSIONS_ASSIGN = 'permissions:assign',
  ROLES_MANAGE = 'ROLES_MANAGE',
  PERMISSIONS_MANAGE = 'PERMISSIONS_MANAGE',
}

/**
 * Agrupamento de permissões por recurso
 */
export const PermissionGroups = {
  USERS: [
    PermissionEnum.USERS_CREATE,
    PermissionEnum.USERS_READ,
    PermissionEnum.USERS_UPDATE,
    PermissionEnum.USERS_DELETE,
    PermissionEnum.USERS_LIST,
  ],
  ORDERS: [
    PermissionEnum.ORDERS_CREATE,
    PermissionEnum.ORDERS_READ,
    PermissionEnum.ORDERS_UPDATE,
    PermissionEnum.ORDERS_DELETE,
    PermissionEnum.ORDERS_LIST,
    PermissionEnum.ORDERS_UPDATE_STATUS,
    PermissionEnum.ORDERS_CANCEL,
  ],
  PRODUCTS: [
    PermissionEnum.PRODUCTS_CREATE,
    PermissionEnum.PRODUCTS_READ,
    PermissionEnum.PRODUCTS_UPDATE,
    PermissionEnum.PRODUCTS_DELETE,
    PermissionEnum.PRODUCTS_LIST,
  ],
  REPORTS: [
    PermissionEnum.REPORTS_VIEW,
    PermissionEnum.REPORTS_EXPORT,
    PermissionEnum.REPORTS_DASHBOARD,
    PermissionEnum.REPORTS_SALES,
    PermissionEnum.REPORTS_CUSTOMERS,
  ],
  INGREDIENTS: [
    PermissionEnum.INGREDIENTS_CREATE,
    PermissionEnum.INGREDIENTS_READ,
    PermissionEnum.INGREDIENTS_UPDATE,
    PermissionEnum.INGREDIENTS_DELETE,
    PermissionEnum.INGREDIENTS_LIST,
    PermissionEnum.INGREDIENTS_STOCK,
  ],
  SUPPLIERS: [
    PermissionEnum.SUPPLIERS_CREATE,
    PermissionEnum.SUPPLIERS_READ,
    PermissionEnum.SUPPLIERS_UPDATE,
    PermissionEnum.SUPPLIERS_DELETE,
    PermissionEnum.SUPPLIERS_LIST,
  ],
};
