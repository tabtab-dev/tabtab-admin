/**
 * 系统菜单模块 Mock 接口
 * @description 系统菜单管理相关接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 系统菜单数据
let systemMenuData = [
  {
    id: '1',
    name: 'dashboard',
    title: '仪表盘',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: '/dashboard/index',
    parentId: null,
    sort: 1,
    status: 'active',
    hidden: false,
    keepAlive: true,
    external: false,
    permission: '',
    type: 'menu',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'system',
    title: '系统管理',
    path: '/system',
    icon: 'Settings',
    component: 'BasicLayout',
    parentId: null,
    sort: 10,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: '',
    type: 'directory',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'system:user',
    title: '用户管理',
    path: '/system/user',
    icon: 'User',
    component: '/system/user/index',
    parentId: '2',
    sort: 10,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: 'system:user:view',
    type: 'menu',
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'system:role',
    title: '角色管理',
    path: '/system/role',
    icon: 'Shield',
    component: '/system/role/index',
    parentId: '2',
    sort: 20,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: 'system:role:view',
    type: 'menu',
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'system:menu',
    title: '菜单管理',
    path: '/system/menu',
    icon: 'Menu',
    component: '/system/menu/index',
    parentId: '2',
    sort: 30,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: 'system:menu:view',
    type: 'menu',
    createdAt: '2024-01-01',
  },
  {
    id: '6',
    name: 'system:organization',
    title: '组织架构',
    path: '/system/organization',
    icon: 'Building2',
    component: '/system/organization/index',
    parentId: '2',
    sort: 40,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: 'system:organization:view',
    type: 'menu',
    createdAt: '2024-01-01',
  },
  {
    id: '7',
    name: 'products',
    title: '商品管理',
    path: '/products',
    icon: 'Package',
    component: 'BasicLayout',
    parentId: null,
    sort: 20,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: '',
    type: 'directory',
    createdAt: '2024-01-01',
  },
  {
    id: '8',
    name: 'orders',
    title: '订单管理',
    path: '/orders',
    icon: 'ShoppingCart',
    component: 'BasicLayout',
    parentId: null,
    sort: 30,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: '',
    type: 'directory',
    createdAt: '2024-01-01',
  },
];

export default [
  // 获取菜单列表
  {
    url: '/mock-api/menus',
    method: 'get',
    response: ({ query }) => {
      const { search } = query;

      let filteredData = [...systemMenuData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          m =>
            m.name.toLowerCase().includes(lowerSearch) ||
            m.title.toLowerCase().includes(lowerSearch) ||
            m.path.toLowerCase().includes(lowerSearch)
        );
      }

      return {
        code: 200,
        data: { list: filteredData, total: filteredData.length, page: 1, pageSize: 100 },
        message: 'success',
      };
    },
  },
  // 获取菜单详情
  {
    url: '/mock-api/menus/:id',
    method: 'get',
    response: ({ query }) => {
      const menu = systemMenuData.find(m => m.id === query.id);
      if (!menu) {
        return { code: 404, data: null, message: '菜单不存在' };
      }
      return { code: 200, data: menu, message: 'success' };
    },
  },
  // 创建菜单
  {
    url: '/mock-api/menus',
    method: 'post',
    response: ({ body }) => {
      const newMenu = {
        id: String(Date.now()),
        name: body.name,
        title: body.title,
        path: body.path,
        icon: body.icon || '',
        component: body.component || '',
        parentId: body.parentId || null,
        sort: body.sort || 0,
        status: body.status || 'active',
        hidden: body.hidden || false,
        keepAlive: body.keepAlive || false,
        external: body.external || false,
        permission: body.permission || '',
        type: body.type || 'menu',
        createdAt: new Date().toISOString().split('T')[0],
      };

      systemMenuData.push(newMenu);
      return { code: 200, data: newMenu, message: 'success' };
    },
  },
  // 更新菜单
  {
    url: '/mock-api/menus/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = systemMenuData.findIndex(m => m.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '菜单不存在' };
      }

      systemMenuData[index] = { ...systemMenuData[index], ...body };
      return { code: 200, data: systemMenuData[index], message: 'success' };
    },
  },
  // 删除菜单
  {
    url: '/mock-api/menus/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = systemMenuData.findIndex(m => m.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '菜单不存在' };
      }

      // 检查是否有子菜单
      const hasChildren = systemMenuData.some(m => m.parentId === query.id);
      if (hasChildren) {
        return { code: 400, data: null, message: '该菜单下存在子菜单，无法删除' };
      }

      systemMenuData.splice(index, 1);
      return { code: 200, data: null, message: 'success' };
    },
  },
  // 更新菜单状态
  {
    url: '/mock-api/menus/:id/status',
    method: 'patch',
    response: ({ query, body }) => {
      const index = systemMenuData.findIndex(m => m.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '菜单不存在' };
      }

      systemMenuData[index].status = body.status;
      return { code: 200, data: systemMenuData[index], message: 'success' };
    },
  },
] as MockMethod[];
