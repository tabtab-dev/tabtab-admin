/**
 * 角色 Mock 数据
 */
import type { Role } from '@/api/modules/role';

/**
 * 角色数据
 */
export const rolesData: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'super_admin',
    description: '系统最高权限，拥有所有功能访问权限',
    userCount: 2,
    permissions: ['*'],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '系统管理员',
    code: 'system_admin',
    description: '系统管理权限，可管理用户、角色、菜单等',
    userCount: 3,
    permissions: [
      'dashboard:view',
      'system:user:view', 'system:user:create', 'system:user:update', 'system:user:delete',
      'system:organization:view', 'system:organization:create', 'system:organization:update', 'system:organization:delete',
      'system:role:view', 'system:role:create', 'system:role:update', 'system:role:delete', 'system:role:permission',
      'system:menu:view', 'system:menu:create', 'system:menu:update', 'system:menu:delete',
    ],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: '运营管理员',
    code: 'operation_admin',
    description: '运营管理权限，可管理商品、订单等',
    userCount: 8,
    permissions: [
      'dashboard:view',
      'products:view', 'products:create', 'products:update', 'products:delete',
      'orders:view', 'orders:create', 'orders:update', 'orders:delete',
    ],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: '普通用户',
    code: 'user',
    description: '普通用户权限，仅可查看',
    userCount: 50,
    permissions: [
      'dashboard:view',
      'products:view',
      'orders:view',
    ],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    name: '访客',
    code: 'guest',
    description: '访客权限，受限访问',
    userCount: 10,
    permissions: [
      'dashboard:view',
    ],
    status: 'inactive',
    createdAt: '2024-01-01',
  },
];
