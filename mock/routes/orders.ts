/**
 * Orders Mock 路由
 * @description 订单管理相关的 Mock API 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { successResponse, paginatedResponse } from '../../mock/utils/response';
import { ordersData } from '../../mock/data/orders';

/**
 * 获取订单列表
 */
export const ordersRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  'GET /mock-api/orders': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const keyword = url.searchParams.get('keyword') || '';
    const status = url.searchParams.get('status') || '';

    let filteredData = [...ordersData];

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredData = filteredData.filter(o =>
        o.orderNo.toLowerCase().includes(lowerKeyword) ||
        o.customer.toLowerCase().includes(lowerKeyword) ||
        o.email.toLowerCase().includes(lowerKeyword)
      );
    }

    if (status) {
      filteredData = filteredData.filter(o => o.status === status);
    }

    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);

    res.end(JSON.stringify(paginatedResponse(data, total, page, pageSize)));
  },

  'GET /mock-api/orders/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const order = ordersData.find(o => o.id === id);

    if (order) {
      res.end(JSON.stringify(successResponse(order)));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '订单不存在' }));
    }
  },

  'POST /mock-api/orders': (req, res) => {
    const newOrder = {
      id: `o-${Date.now()}`,
      orderNo: `ORD-${Date.now()}`,
      customer: req.body?.customer || '新客户',
      email: req.body?.email || '',
      phone: req.body?.phone || '',
      address: req.body?.address || '',
      items: Number(req.body?.items || 1),
      total: Number(req.body?.total || 0),
      status: req.body?.status || 'pending',
      note: req.body?.note || '',
      date: new Date().toISOString().split('T')[0],
    };

    ordersData.unshift(newOrder);
    res.end(JSON.stringify(successResponse(newOrder)));
  },

  'PUT /mock-api/orders/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = ordersData.findIndex(o => o.id === id);

    if (index !== -1) {
      ordersData[index] = {
        ...ordersData[index],
        ...req.body,
        id,
      };
      res.end(JSON.stringify(successResponse(ordersData[index])));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '订单不存在' }));
    }
  },

  'DELETE /mock-api/orders/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = ordersData.findIndex(o => o.id === id);

    if (index !== -1) {
      ordersData.splice(index, 1);
      res.end(JSON.stringify(successResponse({ id })));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '订单不存在' }));
    }
  },

  'POST /mock-api/orders/batch-delete': (req, res) => {
    const ids = req.body?.ids || [];
    const initialLength = ordersData.length;

    for (let i = ordersData.length - 1; i >= 0; i--) {
      if (ids.includes(ordersData[i].id)) {
        ordersData.splice(i, 1);
      }
    }

    res.end(JSON.stringify(successResponse({
      deleted: initialLength - ordersData.length,
      ids
    })));
  },
};
