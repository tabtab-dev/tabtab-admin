/**
 * Products Mock 路由
 * @description 产品管理相关的 Mock API 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { successResponse, paginatedResponse } from '../../mock/utils/response';
import { productsData } from '../../mock/data/products';

/**
 * 获取产品列表
 */
export const productsRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  'GET /mock-api/products': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const keyword = url.searchParams.get('keyword') || '';
    const status = url.searchParams.get('status') || '';

    let filteredData = [...productsData];

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredData = filteredData.filter(p =>
        p.name.toLowerCase().includes(lowerKeyword) ||
        p.sku.toLowerCase().includes(lowerKeyword) ||
        p.category.toLowerCase().includes(lowerKeyword)
      );
    }

    if (status) {
      filteredData = filteredData.filter(p => p.status === status);
    }

    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);

    res.end(JSON.stringify(paginatedResponse(data, total, page, pageSize)));
  },

  'GET /mock-api/products/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const product = productsData.find(p => p.id === id);

    if (product) {
      res.end(JSON.stringify(successResponse(product)));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '产品不存在' }));
    }
  },

  'POST /mock-api/products': (req, res) => {
    const newProduct = {
      id: `p-${Date.now()}`,
      name: req.body?.name || '新产品',
      sku: req.body?.sku || `SKU-${Date.now()}`,
      category: req.body?.category || '未分类',
      price: Number(req.body?.price || 0),
      stock: Number(req.body?.stock || 0),
      status: req.body?.status || 'active',
      description: req.body?.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    productsData.unshift(newProduct);
    res.end(JSON.stringify(successResponse(newProduct)));
  },

  'PUT /mock-api/products/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = productsData.findIndex(p => p.id === id);

    if (index !== -1) {
      productsData[index] = {
        ...productsData[index],
        ...req.body,
        id,
      };
      res.end(JSON.stringify(successResponse(productsData[index])));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '产品不存在' }));
    }
  },

  'DELETE /mock-api/products/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = productsData.findIndex(p => p.id === id);

    if (index !== -1) {
      productsData.splice(index, 1);
      res.end(JSON.stringify(successResponse({ id })));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '产品不存在' }));
    }
  },

  'POST /mock-api/products/batch-delete': (req, res) => {
    const ids = req.body?.ids || [];
    const initialLength = productsData.length;

    for (let i = productsData.length - 1; i >= 0; i--) {
      if (ids.includes(productsData[i].id)) {
        productsData.splice(i, 1);
      }
    }

    res.end(JSON.stringify(successResponse({
      deleted: initialLength - productsData.length,
      ids
    })));
  },
};
