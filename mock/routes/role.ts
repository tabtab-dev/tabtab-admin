/**
 * 角色 Mock 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { rolesData } from '../data/role';
import { createJSONSuccessResponse, createJSONPaginationResponse } from '../utils/response';

// 内存存储，支持增删改查
let roles = [...rolesData];

/**
 * 角色路由
 */
export const roleRoutes = {
  // 获取角色列表
  'GET /mock-api/roles': (req: IncomingMessage & { body?: any; query?: any }, res: ServerResponse) => {
    const search = req.query?.search || '';

    let list = [...roles];

    // 搜索过滤
    if (search) {
      const keyword = search.toLowerCase();
      list = list.filter(role =>
        role.name.toLowerCase().includes(keyword) ||
        role.code.toLowerCase().includes(keyword)
      );
    }

    res.end(createJSONPaginationResponse(list, list.length, 1, list.length));
  },

  // 获取角色详情
  'GET /mock-api/roles/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const role = roles.find(r => r.id === req.params?.id);
    if (role) {
      res.end(createJSONSuccessResponse(role));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '角色不存在' }));
    }
  },

  // 创建角色
  'POST /mock-api/roles': (req: IncomingMessage & { body?: any }, res: ServerResponse) => {
    const body = req.body || {};
    const newRole = {
      id: String(roles.length + 1),
      name: body.name,
      code: body.code,
      description: body.description || '',
      userCount: 0,
      permissions: body.permissions || [],
      status: body.status || 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    roles.push(newRole);
    res.end(createJSONSuccessResponse(newRole, '角色创建成功'));
  },

  // 更新角色
  'PUT /mock-api/roles/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = roles.findIndex(r => r.id === req.params?.id);
    if (index !== -1) {
      const body = req.body || {};
      roles[index] = {
        ...roles[index],
        ...body,
        id: roles[index].id,
      };
      res.end(createJSONSuccessResponse(roles[index], '角色更新成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '角色不存在' }));
    }
  },

  // 删除角色
  'DELETE /mock-api/roles/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = roles.findIndex(r => r.id === req.params?.id);
    if (index !== -1) {
      roles.splice(index, 1);
      res.end(createJSONSuccessResponse(null, '角色删除成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '角色不存在' }));
    }
  },

  // 更新角色状态
  'PATCH /mock-api/roles/:id/status': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = roles.findIndex(r => r.id === req.params?.id);
    if (index !== -1) {
      const body = req.body || {};
      roles[index].status = body.status;
      res.end(createJSONSuccessResponse(roles[index], '状态更新成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '角色不存在' }));
    }
  },

  // 更新角色权限
  'PATCH /mock-api/roles/:id/permissions': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = roles.findIndex(r => r.id === req.params?.id);
    if (index !== -1) {
      const body = req.body || {};
      roles[index].permissions = body.permissions || [];
      res.end(createJSONSuccessResponse(roles[index], '权限分配成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '角色不存在' }));
    }
  },
};
