/**
 * 用户模块 Mock 路由
 * @description 用户增删改查等接口路由处理
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { userDataStore } from '../data/users';
import { createResponse, createErrorResponse, createNotFoundResponse } from '../utils/response';

/**
 * 解析 URL 查询参数
 * @param url - 请求 URL
 * @returns 查询参数对象
 */
function parseQueryParams(url: string): Record<string, string> {
  const query: Record<string, string> = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      query[key] = value;
    });
  }
  return query;
}

/**
 * 用户模块路由映射
 */
export const userRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  /**
   * 获取用户列表
   * GET /mock-api/users
   */
  'GET /mock-api/users': (req, res) => {
    const query = parseQueryParams(req.url || '');
    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '10', 10);
    const search = query.search;
    const role = query.role as any;
    const status = query.status as any;

    const result = userDataStore.getUsers(page, pageSize, search, role, status);

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(result)));
  },

  /**
   * 根据 ID 获取用户详情
   * GET /mock-api/users/:id
   */
  'GET /mock-api/users/': (req, res) => {
    const url = req.url || '';
    const match = url.match(/^\/users\/([^\/\?]+)$/);

    if (!match) {
      res.statusCode = 404;
      res.end(JSON.stringify(createNotFoundResponse()));
      return;
    }

    const id = match[1];
    const user = userDataStore.getUserById(id);

    if (!user) {
      res.statusCode = 200;
      res.end(JSON.stringify(createNotFoundResponse('用户不存在')));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(user)));
  },

  /**
   * 创建用户
   * POST /mock-api/users
   */
  'POST /mock-api/users': (req, res) => {
    const data = req.body || {};

    if (!data.name || !data.email) {
      res.statusCode = 200;
      res.end(JSON.stringify(createErrorResponse('用户名和邮箱不能为空')));
      return;
    }

    const user = userDataStore.createUser(data);
    res.statusCode = 201;
    res.end(JSON.stringify(createResponse(user)));
  },

  /**
   * 更新用户
   * PUT /mock-api/users/:id
   */
  'PUT /mock-api/users/': (req, res) => {
    const url = req.url || '';
    const match = url.match(/^\/users\/([^\/\?]+)$/);

    if (!match) {
      res.statusCode = 404;
      res.end(JSON.stringify(createNotFoundResponse()));
      return;
    }

    const id = match[1];
    const data = req.body || {};
    const user = userDataStore.updateUser(id, data);

    if (!user) {
      res.statusCode = 200;
      res.end(JSON.stringify(createNotFoundResponse('用户不存在')));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(user)));
  },

  /**
   * 删除用户
   * DELETE /mock-api/users/:id
   */
  'DELETE /mock-api/users/': (req, res) => {
    const url = req.url || '';
    const match = url.match(/^\/users\/([^\/\?]+)$/);

    if (!match) {
      res.statusCode = 404;
      res.end(JSON.stringify(createNotFoundResponse()));
      return;
    }

    const id = match[1];
    const success = userDataStore.deleteUser(id);

    if (!success) {
      res.statusCode = 200;
      res.end(JSON.stringify(createNotFoundResponse('用户不存在')));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(null)));
  },

  /**
   * 批量删除用户
   * POST /mock-api/users/batch-delete
   */
  'POST /mock-api/users/batch-delete': (req, res) => {
    const data = req.body || {};
    const ids = data.ids || [];

    if (!Array.isArray(ids) || ids.length === 0) {
      res.statusCode = 200;
      res.end(JSON.stringify(createErrorResponse('请选择要删除的用户')));
      return;
    }

    const deletedCount = userDataStore.batchDeleteUsers(ids);
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse({ deletedCount })));
  },

  /**
   * 更新用户状态
   * PATCH /mock-api/users/:id/status
   */
  'PATCH /mock-api/users/': (req, res) => {
    const url = req.url || '';
    const match = url.match(/^\/users\/([^\/\?]+)\/status$/);

    if (!match) {
      res.statusCode = 404;
      res.end(JSON.stringify(createNotFoundResponse()));
      return;
    }

    const id = match[1];
    const data = req.body || {};
    const status = data.status;

    if (!status || !['active', 'inactive'].includes(status)) {
      res.statusCode = 200;
      res.end(JSON.stringify(createErrorResponse('无效的状态值')));
      return;
    }

    const user = userDataStore.updateUserStatus(id, status);

    if (!user) {
      res.statusCode = 200;
      res.end(JSON.stringify(createNotFoundResponse('用户不存在')));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(user)));
  },
};
