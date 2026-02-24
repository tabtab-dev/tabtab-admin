/**
 * 系统菜单模块 MSW handlers
 * @description 系统菜单管理相关接口
 */
import { http, HttpResponse, delay } from 'msw';

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

export const systemMenuHandlers = [
  http.get('/mock-api/menus', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

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

    return HttpResponse.json({
      code: 200,
      data: { list: filteredData, total: filteredData.length, page: 1, pageSize: 100 },
      message: 'success',
    });
  }),

  http.get('/mock-api/menus/:id', async ({ params }) => {
    await delay(200);
    const menu = systemMenuData.find(m => m.id === params.id);
    if (!menu) {
      return HttpResponse.json({ code: 404, data: null, message: '菜单不存在' });
    }
    return HttpResponse.json({ code: 200, data: menu, message: 'success' });
  }),

  http.post('/mock-api/menus', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newMenu = {
      id: String(Date.now()),
      name: body.name as string,
      title: body.title as string,
      path: body.path as string,
      icon: (body.icon as string) || '',
      component: (body.component as string) || '',
      parentId: (body.parentId as string) || null,
      sort: (body.sort as number) || 0,
      status: (body.status as string) || 'active',
      hidden: (body.hidden as boolean) || false,
      keepAlive: (body.keepAlive as boolean) || false,
      external: (body.external as boolean) || false,
      permission: (body.permission as string) || '',
      type: (body.type as string) || 'menu',
      createdAt: new Date().toISOString().split('T')[0],
    };

    systemMenuData.push(newMenu);
    return HttpResponse.json({ code: 200, data: newMenu, message: 'success' });
  }),

  http.put('/mock-api/menus/:id', async ({ params, request }) => {
    await delay(300);
    const index = systemMenuData.findIndex(m => m.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '菜单不存在' });
    }

    const body = (await request.json()) as Record<string, unknown>;
    systemMenuData[index] = { ...systemMenuData[index], ...body } as typeof systemMenuData[0];
    return HttpResponse.json({ code: 200, data: systemMenuData[index], message: 'success' });
  }),

  http.delete('/mock-api/menus/:id', async ({ params }) => {
    await delay(200);
    const index = systemMenuData.findIndex(m => m.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '菜单不存在' });
    }

    const hasChildren = systemMenuData.some(m => m.parentId === params.id);
    if (hasChildren) {
      return HttpResponse.json({ code: 400, data: null, message: '该菜单下存在子菜单，无法删除' });
    }

    systemMenuData.splice(index, 1);
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),

  http.patch('/mock-api/menus/:id/status', async ({ params, request }) => {
    await delay(200);
    const index = systemMenuData.findIndex(m => m.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '菜单不存在' });
    }

    const body = (await request.json()) as { status?: string };
    systemMenuData[index].status = body.status || 'active';
    return HttpResponse.json({ code: 200, data: systemMenuData[index], message: 'success' });
  }),
];
