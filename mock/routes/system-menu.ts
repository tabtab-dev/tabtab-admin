/**
 * 系统菜单 Mock 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { systemMenusData } from '../data/system-menu';
import { createJSONSuccessResponse, createJSONPaginationResponse } from '../utils/response';

// 内存存储，支持增删改查
let menus = [...systemMenusData];

/**
 * 系统菜单路由
 */
export const systemMenuRoutes = {
  // 获取菜单列表
  'GET /mock-api/menus': (req: IncomingMessage & { body?: any; query?: any }, res: ServerResponse) => {
    const search = req.query?.search || '';

    let list = [...menus];

    // 搜索过滤
    if (search) {
      const keyword = search.toLowerCase();
      list = list.filter(menu =>
        menu.title.toLowerCase().includes(keyword) ||
        menu.path.toLowerCase().includes(keyword)
      );
    }

    res.end(createJSONPaginationResponse(list, list.length, 1, list.length));
  },

  // 获取菜单详情
  'GET /mock-api/menus/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const menu = menus.find(m => m.id === req.params?.id);
    if (menu) {
      res.end(createJSONSuccessResponse(menu));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '菜单不存在' }));
    }
  },

  // 创建菜单
  'POST /mock-api/menus': (req: IncomingMessage & { body?: any }, res: ServerResponse) => {
    const body = req.body || {};
    const newMenu = {
      id: String(menus.length + 1),
      name: body.name,
      title: body.title,
      path: body.path,
      component: body.component,
      icon: body.icon || '',
      parentId: body.parentId || null,
      sort: body.sort || 0,
      status: body.status || 'active',
      hidden: body.hidden || false,
      keepAlive: body.keepAlive || false,
      external: body.external || false,
      permission: body.permission || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    menus.push(newMenu);
    res.end(createJSONSuccessResponse(newMenu, '菜单创建成功'));
  },

  // 更新菜单
  'PUT /mock-api/menus/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = menus.findIndex(m => m.id === req.params?.id);
    if (index !== -1) {
      const body = req.body || {};
      menus[index] = {
        ...menus[index],
        ...body,
        id: menus[index].id,
      };
      res.end(createJSONSuccessResponse(menus[index], '菜单更新成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '菜单不存在' }));
    }
  },

  // 删除菜单
  'DELETE /mock-api/menus/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = menus.findIndex(m => m.id === req.params?.id);
    if (index !== -1) {
      menus.splice(index, 1);
      res.end(createJSONSuccessResponse(null, '菜单删除成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '菜单不存在' }));
    }
  },

  // 更新菜单状态
  'PATCH /mock-api/menus/:id/status': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = menus.findIndex(m => m.id === req.params?.id);
    if (index !== -1) {
      const body = req.body || {};
      menus[index].status = body.status;
      res.end(createJSONSuccessResponse(menus[index], '状态更新成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '菜单不存在' }));
    }
  },
};
