/**
 * 订单模块 Mock 接口
 * @description 订单管理相关接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 使用 mockjs 生成订单数据
const generateOrders = () => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return Mock.mock({
    'list|50': [
      {
        id: '@id',
        orderNo: 'ORD-@datetime("yyyyMMddHHmmss")',
        customer: '@cname',
        email: '@email',
        phone: '@string("number", 11)',
        address: '@county(true)',
        items: '@integer(1, 10)',
        total: '@float(50, 5000, 2, 2)',
        status: () => statuses[Math.floor(Math.random() * statuses.length)],
        note: '@csentence(5, 15)',
        date: '@date("yyyy-MM-dd")',
      },
    ],
  }).list;
};

let ordersData = generateOrders();

export default [
  // 获取订单列表
  {
    url: '/mock-api/orders',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, status } = query;

      let filteredData = [...ordersData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          o =>
            o.orderNo.toLowerCase().includes(lowerSearch) ||
            o.customer.toLowerCase().includes(lowerSearch) ||
            o.email.toLowerCase().includes(lowerSearch)
        );
      }

      if (status) {
        filteredData = filteredData.filter(o => o.status === status);
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
  // 获取订单详情
  {
    url: '/mock-api/orders/:id',
    method: 'get',
    response: ({ query }) => {
      const order = ordersData.find(o => o.id === query.id);
      if (!order) {
        return { code: 404, data: null, message: '订单不存在' };
      }
      return { code: 200, data: order, message: 'success' };
    },
  },
  // 创建订单
  {
    url: '/mock-api/orders',
    method: 'post',
    response: ({ body }) => {
      const newOrder = {
        id: Mock.mock('@id'),
        orderNo: `ORD-${Date.now()}`,
        customer: body.customer || '新客户',
        email: body.email || '',
        phone: body.phone || '',
        address: body.address || '',
        items: Number(body.items || 1),
        total: Number(body.total || 0),
        status: body.status || 'pending',
        note: body.note || '',
        date: new Date().toISOString().split('T')[0],
      };

      ordersData.unshift(newOrder);
      return { code: 200, data: newOrder, message: 'success' };
    },
  },
  // 更新订单
  {
    url: '/mock-api/orders/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = ordersData.findIndex(o => o.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '订单不存在' };
      }

      ordersData[index] = { ...ordersData[index], ...body };
      return { code: 200, data: ordersData[index], message: 'success' };
    },
  },
  // 删除订单
  {
    url: '/mock-api/orders/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = ordersData.findIndex(o => o.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '订单不存在' };
      }

      ordersData.splice(index, 1);
      return { code: 200, data: { id: query.id }, message: 'success' };
    },
  },
  // 批量删除订单
  {
    url: '/mock-api/orders/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids || [];
      const initialLength = ordersData.length;
      ordersData = ordersData.filter(o => !ids.includes(o.id));

      return {
        code: 200,
        data: { deleted: initialLength - ordersData.length, ids },
        message: 'success',
      };
    },
  },
] as MockMethod[];
