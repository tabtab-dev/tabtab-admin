/**
 * Categories Mock 路由
 * @description 分类管理相关的 Mock API 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { successResponse, paginatedResponse } from '../../mock/utils/response';
import { categoriesData } from '../../mock/data/categories';

/**
 * 获取分类列表
 */
export const categoriesRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  'GET /mock-api/categories': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const keyword = url.searchParams.get('keyword') || '';
    const level = url.searchParams.get('level') || '';
    const status = url.searchParams.get('status') || '';

    let filteredData = [...categoriesData];

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredData = filteredData.filter(c =>
        c.name.toLowerCase().includes(lowerKeyword) ||
        c.code.toLowerCase().includes(lowerKeyword)
      );
    }

    if (level) {
      filteredData = filteredData.filter(c => c.level === Number(level));
    }

    if (status) {
      filteredData = filteredData.filter(c => c.status === status);
    }

    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);

    res.end(JSON.stringify(paginatedResponse(data, total, page, pageSize)));
  },

  'GET /mock-api/categories/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const category = categoriesData.find(c => c.id === id);

    if (category) {
      res.end(JSON.stringify(successResponse(category)));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '分类不存在' }));
    }
  },

  'POST /mock-api/categories': (req, res) => {
    const newCategory = {
      id: `c-${Date.now()}`,
      name: req.body?.name || '新分类',
      code: req.body?.code || `CAT-${Date.now()}`,
      level: Number(req.body?.level || 1),
      parentId: req.body?.parentId || '',
      parentName: req.body?.parentName || '',
      sort: Number(req.body?.sort || 0),
      status: req.body?.status || 'active',
      productCount: 0,
      description: req.body?.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    categoriesData.unshift(newCategory);
    res.end(JSON.stringify(successResponse(newCategory)));
  },

  'PUT /mock-api/categories/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = categoriesData.findIndex(c => c.id === id);

    if (index !== -1) {
      categoriesData[index] = {
        ...categoriesData[index],
        ...req.body,
        id,
      };
      res.end(JSON.stringify(successResponse(categoriesData[index])));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '分类不存在' }));
    }
  },

  'DELETE /mock-api/categories/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = categoriesData.findIndex(c => c.id === id);

    if (index !== -1) {
      categoriesData.splice(index, 1);
      res.end(JSON.stringify(successResponse({ id })));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '分类不存在' }));
    }
  },

  'POST /mock-api/categories/batch-delete': (req, res) => {
    const ids = req.body?.ids || [];
    const initialLength = categoriesData.length;

    for (let i = categoriesData.length - 1; i >= 0; i--) {
      if (ids.includes(categoriesData[i].id)) {
        categoriesData.splice(i, 1);
      }
    }

    res.end(JSON.stringify(successResponse({
      deleted: initialLength - categoriesData.length,
      ids
    })));
  },
};
