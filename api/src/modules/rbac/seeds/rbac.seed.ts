// ===========================================
// SEED: RBAC (ROLES E PERMISSÕES)
// Popula banco com roles e permissões iniciais
// ===========================================

import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RoleEnum, RoleLabels, RoleLevels } from '../enums/role.enum';
import { PermissionEnum } from '../enums/permission.enum';

export async function seedRBAC(dataSource: DataSource) {
  console.log('Iniciando seed de RBAC...');

  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);

  // ===========================================
  // CRIAR PERMISSÕES
  // ===========================================
  const permissionsData = [
    // USUÁRIOS
    {
      name: PermissionEnum.USERS_CREATE,
      display_name: 'Criar usuários',
      resource: 'users',
      action: 'create',
    },
    {
      name: PermissionEnum.USERS_READ,
      display_name: 'Visualizar usuários',
      resource: 'users',
      action: 'read',
    },
    {
      name: PermissionEnum.USERS_UPDATE,
      display_name: 'Editar usuários',
      resource: 'users',
      action: 'update',
    },
    {
      name: PermissionEnum.USERS_DELETE,
      display_name: 'Deletar usuários',
      resource: 'users',
      action: 'delete',
    },
    {
      name: PermissionEnum.USERS_LIST,
      display_name: 'Listar usuários',
      resource: 'users',
      action: 'list',
    },

    // PEDIDOS
    {
      name: PermissionEnum.ORDERS_CREATE,
      display_name: 'Criar pedidos',
      resource: 'orders',
      action: 'create',
    },
    {
      name: PermissionEnum.ORDERS_READ,
      display_name: 'Visualizar pedidos',
      resource: 'orders',
      action: 'read',
    },
    {
      name: PermissionEnum.ORDERS_UPDATE,
      display_name: 'Editar pedidos',
      resource: 'orders',
      action: 'update',
    },
    {
      name: PermissionEnum.ORDERS_DELETE,
      display_name: 'Deletar pedidos',
      resource: 'orders',
      action: 'delete',
    },
    {
      name: PermissionEnum.ORDERS_LIST,
      display_name: 'Listar pedidos',
      resource: 'orders',
      action: 'list',
    },
    {
      name: PermissionEnum.ORDERS_UPDATE_STATUS,
      display_name: 'Atualizar status',
      resource: 'orders',
      action: 'update_status',
    },

    // PRODUTOS
    {
      name: PermissionEnum.PRODUCTS_CREATE,
      display_name: 'Criar produtos',
      resource: 'products',
      action: 'create',
    },
    {
      name: PermissionEnum.PRODUCTS_READ,
      display_name: 'Visualizar produtos',
      resource: 'products',
      action: 'read',
    },
    {
      name: PermissionEnum.PRODUCTS_UPDATE,
      display_name: 'Editar produtos',
      resource: 'products',
      action: 'update',
    },
    {
      name: PermissionEnum.PRODUCTS_DELETE,
      display_name: 'Deletar produtos',
      resource: 'products',
      action: 'delete',
    },
    {
      name: PermissionEnum.PRODUCTS_LIST,
      display_name: 'Listar produtos',
      resource: 'products',
      action: 'list',
    },

    // CATEGORIAS
    {
      name: PermissionEnum.CATEGORIES_CREATE,
      display_name: 'Criar categorias',
      resource: 'categories',
      action: 'create',
    },
    {
      name: PermissionEnum.CATEGORIES_READ,
      display_name: 'Visualizar categorias',
      resource: 'categories',
      action: 'read',
    },
    {
      name: PermissionEnum.CATEGORIES_UPDATE,
      display_name: 'Editar categorias',
      resource: 'categories',
      action: 'update',
    },
    {
      name: PermissionEnum.CATEGORIES_DELETE,
      display_name: 'Deletar categorias',
      resource: 'categories',
      action: 'delete',
    },

    // RELATÓRIOS
    {
      name: PermissionEnum.REPORTS_VIEW,
      display_name: 'Visualizar relatórios',
      resource: 'reports',
      action: 'view',
    },
    {
      name: PermissionEnum.REPORTS_EXPORT,
      display_name: 'Exportar relatórios',
      resource: 'reports',
      action: 'export',
    },
    {
      name: PermissionEnum.REPORTS_DASHBOARD,
      display_name: 'Dashboard',
      resource: 'reports',
      action: 'dashboard',
    },

    // INGREDIENTES
    {
      name: PermissionEnum.INGREDIENTS_CREATE,
      display_name: 'Criar ingredientes',
      resource: 'ingredients',
      action: 'create',
    },
    {
      name: PermissionEnum.INGREDIENTS_READ,
      display_name: 'Visualizar ingredientes',
      resource: 'ingredients',
      action: 'read',
    },
    {
      name: PermissionEnum.INGREDIENTS_UPDATE,
      display_name: 'Editar ingredientes',
      resource: 'ingredients',
      action: 'update',
    },
    {
      name: PermissionEnum.INGREDIENTS_STOCK,
      display_name: 'Gerenciar estoque',
      resource: 'ingredients',
      action: 'stock',
    },

    // FORNECEDORES
    {
      name: PermissionEnum.SUPPLIERS_CREATE,
      display_name: 'Criar fornecedores',
      resource: 'suppliers',
      action: 'create',
    },
    {
      name: PermissionEnum.SUPPLIERS_READ,
      display_name: 'Visualizar fornecedores',
      resource: 'suppliers',
      action: 'read',
    },
    {
      name: PermissionEnum.SUPPLIERS_UPDATE,
      display_name: 'Editar fornecedores',
      resource: 'suppliers',
      action: 'update',
    },

    // PAGAMENTOS
    {
      name: PermissionEnum.PAYMENTS_READ,
      display_name: 'Visualizar pagamentos',
      resource: 'payments',
      action: 'read',
    },
    {
      name: PermissionEnum.PAYMENTS_REFUND,
      display_name: 'Reembolsar pagamentos',
      resource: 'payments',
      action: 'refund',
    },

    // ROLES
    {
      name: PermissionEnum.ROLES_MANAGE,
      display_name: 'Gerenciar roles',
      resource: 'roles',
      action: 'manage',
    },
    {
      name: PermissionEnum.PERMISSIONS_MANAGE,
      display_name: 'Gerenciar permissões',
      resource: 'permissions',
      action: 'manage',
    },
  ];

  const permissions: Permission[] = [];
  for (const permData of permissionsData) {
    let permission = await permissionRepo.findOne({
      where: { name: permData.name },
    });

    if (!permission) {
      permission = permissionRepo.create(permData);
      await permissionRepo.save(permission);
      console.log(`Permissão criada: ${permData.display_name}`);
    }

    permissions.push(permission);
  }

  // ===========================================
  // CRIAR ROLES COM PERMISSÕES
  // ===========================================

  // Função helper para buscar permissões
  const getPermissions = (names: PermissionEnum[]) => {
    return permissions.filter((p) => names.includes(p.name));
  };

  // ADMINISTRADOR - Todas as permissões
  let superAdmin = await roleRepo.findOne({
    where: { name: RoleEnum.SUPER_ADMIN },
  });
  if (!superAdmin) {
    superAdmin = roleRepo.create({
      name: RoleEnum.SUPER_ADMIN,
      display_name: RoleLabels[RoleEnum.SUPER_ADMIN],
      description: 'Acesso total ao sistema',
      level: RoleLevels[RoleEnum.SUPER_ADMIN],
      is_protected: true,
      permissions: permissions, // Todas as permissões
    });
    await roleRepo.save(superAdmin);
    console.log('Role criado: Super Administrador');
  }

  // GERÊNCIA - Gestão e relatórios
  let manager = await roleRepo.findOne({ where: { name: RoleEnum.MANAGER } });
  if (!manager) {
    manager = roleRepo.create({
      name: RoleEnum.MANAGER,
      display_name: RoleLabels[RoleEnum.MANAGER],
      description: 'Gerente com acesso a gestão operacional',
      level: RoleLevels[RoleEnum.MANAGER],
      is_protected: true,
      permissions: getPermissions([
        PermissionEnum.ORDERS_LIST,
        PermissionEnum.ORDERS_READ,
        PermissionEnum.ORDERS_UPDATE_STATUS,
        PermissionEnum.PRODUCTS_LIST,
        PermissionEnum.PRODUCTS_READ,
        PermissionEnum.PRODUCTS_CREATE,
        PermissionEnum.PRODUCTS_UPDATE,
        PermissionEnum.REPORTS_VIEW,
        PermissionEnum.REPORTS_EXPORT,
        PermissionEnum.REPORTS_DASHBOARD,
        PermissionEnum.INGREDIENTS_READ,
        PermissionEnum.INGREDIENTS_STOCK,
        PermissionEnum.SUPPLIERS_READ,
        PermissionEnum.USERS_LIST,
        PermissionEnum.USERS_READ,
      ]),
    });
    await roleRepo.save(manager);
    console.log('Role criado: Gerente');
  }

  // ANALISTA - Relatórios
  let analyst = await roleRepo.findOne({ where: { name: RoleEnum.ANALYST } });
  if (!analyst) {
    analyst = roleRepo.create({
      name: RoleEnum.ANALYST,
      display_name: RoleLabels[RoleEnum.ANALYST],
      description: 'Analista com acesso a relatórios',
      level: RoleLevels[RoleEnum.ANALYST],
      is_protected: true,
      permissions: getPermissions([
        PermissionEnum.REPORTS_VIEW,
        PermissionEnum.REPORTS_EXPORT,
        PermissionEnum.REPORTS_DASHBOARD,
        PermissionEnum.ORDERS_LIST,
        PermissionEnum.ORDERS_READ,
        PermissionEnum.PRODUCTS_LIST,
        PermissionEnum.PRODUCTS_READ,
      ]),
    });
    await roleRepo.save(analyst);
    console.log('Role criado: Analista');
  }

  // ASSISTENTE - Pedidos e produtos
  let assistant = await roleRepo.findOne({
    where: { name: RoleEnum.ASSISTANT },
  });
  if (!assistant) {
    assistant = roleRepo.create({
      name: RoleEnum.ASSISTANT,
      display_name: RoleLabels[RoleEnum.ASSISTANT],
      description: 'Assistente com acesso a pedidos',
      level: RoleLevels[RoleEnum.ASSISTANT],
      permissions: getPermissions([
        PermissionEnum.ORDERS_LIST,
        PermissionEnum.ORDERS_READ,
        PermissionEnum.ORDERS_CREATE,
        PermissionEnum.ORDERS_UPDATE_STATUS,
        PermissionEnum.PRODUCTS_LIST,
        PermissionEnum.PRODUCTS_READ,
      ]),
    });
    await roleRepo.save(assistant);
    console.log('Role criado: Assistente');
  }

  // AUXILIAR - Pedidos básicos
  let auxiliary = await roleRepo.findOne({
    where: { name: RoleEnum.AUXILIARY },
  });
  if (!auxiliary) {
    auxiliary = roleRepo.create({
      name: RoleEnum.AUXILIARY,
      display_name: RoleLabels[RoleEnum.AUXILIARY],
      description: 'Auxiliar com acesso básico',
      level: RoleLevels[RoleEnum.AUXILIARY],
      permissions: getPermissions([
        PermissionEnum.ORDERS_LIST,
        PermissionEnum.ORDERS_READ,
        PermissionEnum.PRODUCTS_LIST,
        PermissionEnum.PRODUCTS_READ,
      ]),
    });
    await roleRepo.save(auxiliary);
    console.log('Role criado: Auxiliar');
  }

  // GARÇOM - Pedidos do salão
  let waiter = await roleRepo.findOne({ where: { name: RoleEnum.WAITER } });
  if (!waiter) {
    waiter = roleRepo.create({
      name: RoleEnum.WAITER,
      display_name: RoleLabels[RoleEnum.WAITER],
      description: 'Garçom para pedidos do salão',
      level: RoleLevels[RoleEnum.WAITER],
      permissions: getPermissions([
        PermissionEnum.ORDERS_CREATE,
        PermissionEnum.ORDERS_LIST,
        PermissionEnum.ORDERS_READ,
        PermissionEnum.PRODUCTS_LIST,
        PermissionEnum.PRODUCTS_READ,
      ]),
    });
    await roleRepo.save(waiter);
    console.log('Role criado: Garçom');
  }

  // COZINHEIRA - Visualizar pedidos da cozinha
  let cook = await roleRepo.findOne({ where: { name: RoleEnum.COOK } });
  if (!cook) {
    cook = roleRepo.create({
      name: RoleEnum.COOK,
      display_name: RoleLabels[RoleEnum.COOK],
      description: 'Cozinheira para visualizar pedidos',
      level: RoleLevels[RoleEnum.COOK],
      permissions: getPermissions([
        PermissionEnum.ORDERS_LIST,
        PermissionEnum.ORDERS_READ,
        PermissionEnum.ORDERS_UPDATE_STATUS,
      ]),
    });
    await roleRepo.save(cook);
    console.log('Role criado: Cozinheira');
  }

  // ENTREGADOR - Entregas
  let delivery = await roleRepo.findOne({ where: { name: RoleEnum.DELIVERY } });
  if (!delivery) {
    delivery = roleRepo.create({
      name: RoleEnum.DELIVERY,
      display_name: RoleLabels[RoleEnum.DELIVERY],
      description: 'Motoboy para entregas',
      level: RoleLevels[RoleEnum.DELIVERY],
      permissions: getPermissions([
        PermissionEnum.ORDERS_LIST,
        PermissionEnum.ORDERS_READ,
        PermissionEnum.ORDERS_UPDATE_STATUS,
      ]),
    });
    await roleRepo.save(delivery);
    console.log('Role criado: Motoboy');
  }

  console.log('Seed de RBAC concluído!');
}
