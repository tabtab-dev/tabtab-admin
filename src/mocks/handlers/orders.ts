/**
 * 订单模块 MSW handlers
 * @description 订单管理相关接口
 */
import { http, HttpResponse, delay } from 'msw';
import Mock from 'mockjs';

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

export const orderHandlers = [
  http.get('/mock-api/orders', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');

    let filteredData = [...ordersData];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData.filter(
        (o: any) =>
          o.orderNo.toLowerCase().includes(lowerSearch) ||
          o.customer.toLowerCase().includes(lowerSearch) ||
          o.email.toLowerCase().includes(lowerSearch)
      );
    }

    if (status) {
      filteredData = filteredData.filter((o: any) => o.status === status);
    }

    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const list = filteredData.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 200,
      data: { list, total, page, pageSize },
      message: 'success',
    });
  }),

  http.get('/mock-api/orders/:id', async ({ params }) => {
    await delay(200);
    const order = ordersData.find((o: any) => o.id === params.id);
    if (!order) {
      return HttpResponse.json({ code: 404, data: null, message: '订单不存在' });
    }
    return HttpResponse.json({ code: 200, data: order, message: 'success' });
  }),

  http.post('/mock-api/orders', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
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

    ordersData.unshift(newOrder as any);
    return HttpResponse.json({ code: 200, data: newOrder, message: 'success' });
  }),

  http.put('/mock-api/orders/:id', async ({ params, request }) => {
    await delay(300);
    const index = ordersData.findIndex((o: any) => o.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '订单不存在' });
    }

    const body = (await request.json()) as Record<string, unknown>;
    ordersData[index] = { ...ordersData[index], ...body } as any;
    return HttpResponse.json({ code: 200, data: ordersData[index], message: 'success' });
  }),

  http.delete('/mock-api/orders/:id', async ({ params }) => {
    await delay(200);
    const index = ordersData.findIndex((o: any) => o.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '订单不存在' });
    }

    ordersData.splice(index, 1);
    return HttpResponse.json({ code: 200, data: { id: params.id }, message: 'success' });
  }),

  http.post('/mock-api/orders/batch-delete', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { ids?: string[] };
    const ids = body.ids || [];
    const initialLength = ordersData.length;
    ordersData = ordersData.filter((o: any) => !ids.includes(o.id));

    return HttpResponse.json({
      code: 200,
      data: { deleted: initialLength - ordersData.length, ids },
      message: 'success',
    });
  }),
];
