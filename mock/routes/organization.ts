/**
 * 组织架构 Mock 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { organizationsData } from '../data/organization';
import { createJSONSuccessResponse, createJSONPaginationResponse } from '../utils/response';

// 内存存储，支持增删改查
let organizations = [...organizationsData];

/**
 * 组织架构路由
 */
export const organizationRoutes = {
  // 获取部门列表
  'GET /mock-api/organizations': (req: IncomingMessage & { body?: any; query?: any }, res: ServerResponse) => {
    const search = req.query?.search || '';

    let list = [...organizations];

    // 搜索过滤
    if (search) {
      const keyword = search.toLowerCase();
      list = list.filter(org =>
        org.name.toLowerCase().includes(keyword) ||
        org.code.toLowerCase().includes(keyword)
      );
    }

    res.end(createJSONPaginationResponse(list, list.length, 1, list.length));
  },

  // 获取部门详情
  'GET /mock-api/organizations/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const org = organizations.find(o => o.id === req.params?.id);
    if (org) {
      res.end(createJSONSuccessResponse(org));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '部门不存在' }));
    }
  },

  // 创建部门
  'POST /mock-api/organizations': (req: IncomingMessage & { body?: any }, res: ServerResponse) => {
    const body = req.body || {};
    const newOrg = {
      id: String(organizations.length + 1),
      name: body.name,
      code: body.code,
      parentId: body.parentId || null,
      leader: body.leader || '',
      memberCount: 0,
      sort: body.sort || 0,
      status: body.status || 'active',
      description: body.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    organizations.push(newOrg);
    res.end(createJSONSuccessResponse(newOrg, '部门创建成功'));
  },

  // 更新部门
  'PUT /mock-api/organizations/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = organizations.findIndex(o => o.id === req.params?.id);
    if (index !== -1) {
      const body = req.body || {};
      organizations[index] = {
        ...organizations[index],
        ...body,
        id: organizations[index].id,
      };
      res.end(createJSONSuccessResponse(organizations[index], '部门更新成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '部门不存在' }));
    }
  },

  // 删除部门
  'DELETE /mock-api/organizations/:id': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = organizations.findIndex(o => o.id === req.params?.id);
    if (index !== -1) {
      organizations.splice(index, 1);
      res.end(createJSONSuccessResponse(null, '部门删除成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '部门不存在' }));
    }
  },

  // 更新部门状态
  'PATCH /mock-api/organizations/:id/status': (req: IncomingMessage & { body?: any; params?: any }, res: ServerResponse) => {
    const index = organizations.findIndex(o => o.id === req.params?.id);
    if (index !== -1) {
      const body = req.body || {};
      organizations[index].status = body.status;
      res.end(createJSONSuccessResponse(organizations[index], '状态更新成功'));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, message: '部门不存在' }));
    }
  },
};
