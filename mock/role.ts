/**
 * 角色模块 Mock 接口
 * @description 角色管理相关接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 角色数据
let rolesData = [
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
    permissions: ['dashboard:view', 'products:view', 'orders:view'],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    name: '访客',
    code: 'guest',
    description: '访客权限，受限访问',
    userCount: 10,
    permissions: ['dashboard:view'],
    status: 'inactive',
    createdAt: '2024-01-01',
  },
];

export default [
  // 获取角色列表
  {
    url: '/mock-api/roles',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, status } = query;

      let filteredData = [...rolesData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          r =>
            r.name.toLowerCase().includes(lowerSearch) ||
            r.code.toLowerCase().includes(lowerSearch)
        );
      }

      if (status) {
        filteredData = filteredData.filter(r => r.status === status);
      }

      const total = filteredData.length;
      const start = (Number(page) - 1) * Number(pageSize);
      const list = filteredData.slice(start, start + Number(pageSize));

      return {
        code: 200,
        data: { list, total, page: Number(page), pageSize: Number(pageSize) },
        message: 'success',
      };
    },
  },
  // 获取所有角色（下拉选择用）
  {
    url: '/mock-api/roles/all',
    method: 'get',
    response: () => ({
      code: 200,
      data: rolesData.map(r => ({ id: r.id, name: r.name, code: r.code })),
      message: 'success',
    }),
  },
  // 获取角色详情
  {
    url: '/mock-api/roles/:id',
    method: 'get',
    response: ({ query }) => {
      const role = rolesData.find(r => r.id === query.id);
      if (!role) {
        return { code: 404, data: null, message: '角色不存在' };
      }
      return { code: 200, data: role, message: 'success' };
    },
  },
  // 创建角色
  {
    url: '/mock-api/roles',
    method: 'post',
    response: ({ body }) => {
      const newRole = {
        id: String(Date.now()),
        name: body.name,
        code: body.code,
        description: body.description || '',
        userCount: 0,
        permissions: body.permissions || [],
        status: body.status || 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };

      rolesData.unshift(newRole);
      return { code: 200, data: newRole, message: 'success' };
    },
  },
  // 更新角色
  {
    url: '/mock-api/roles/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = rolesData.findIndex(r => r.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '角色不存在' };
      }

      rolesData[index] = { ...rolesData[index], ...body };
      return { code: 200, data: rolesData[index], message: 'success' };
    },
  },
  // 删除角色
  {
    url: '/mock-api/roles/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = rolesData.findIndex(r => r.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '角色不存在' };
      }

      // 检查是否有用户使用该角色
      if (rolesData[index].userCount > 0) {
        return { code: 400, data: null, message: '该角色下存在用户，无法删除' };
      }

      rolesData.splice(index, 1);
      return { code: 200, data: null, message: 'success' };
    },
  },
  // 更新角色权限
  {
    url: '/mock-api/roles/:id/permissions',
    method: 'put',
    response: ({ query, body }) => {
      const index = rolesData.findIndex(r => r.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '角色不存在' };
      }

      rolesData[index].permissions = body.permissions || [];
      return { code: 200, data: rolesData[index], message: 'success' };
    },
  },
] as MockMethod[];
