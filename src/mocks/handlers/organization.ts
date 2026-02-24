/**
 * 组织架构模块 MSW handlers
 * @description 组织架构管理相关接口
 */
import { http, HttpResponse, delay } from 'msw';

let organizationData = [
  {
    id: '1',
    name: '总公司',
    code: 'HQ',
    parentId: null,
    leader: '张总',
    memberCount: 150,
    sort: 1,
    status: 'active',
    description: '公司总部',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '技术部',
    code: 'TECH',
    parentId: '1',
    leader: '李经理',
    memberCount: 50,
    sort: 1,
    status: 'active',
    description: '负责技术研发',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: '产品部',
    code: 'PRODUCT',
    parentId: '1',
    leader: '王经理',
    memberCount: 20,
    sort: 2,
    status: 'active',
    description: '负责产品设计',
    createdAt: '2024-01-02',
  },
  {
    id: '4',
    name: '市场部',
    code: 'MARKET',
    parentId: '1',
    leader: '赵经理',
    memberCount: 30,
    sort: 3,
    status: 'active',
    description: '负责市场推广',
    createdAt: '2024-01-03',
  },
  {
    id: '5',
    name: '前端组',
    code: 'FE',
    parentId: '2',
    leader: '陈组长',
    memberCount: 15,
    sort: 1,
    status: 'active',
    description: '前端开发团队',
    createdAt: '2024-01-04',
  },
  {
    id: '6',
    name: '后端组',
    code: 'BE',
    parentId: '2',
    leader: '刘组长',
    memberCount: 20,
    sort: 2,
    status: 'active',
    description: '后端开发团队',
    createdAt: '2024-01-04',
  },
];

export const organizationHandlers = [
  http.get('/mock-api/organizations', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');

    let filteredData = [...organizationData];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData.filter(
        o =>
          o.name.toLowerCase().includes(lowerSearch) ||
          o.code.toLowerCase().includes(lowerSearch)
      );
    }

    if (status) {
      filteredData = filteredData.filter(o => o.status === status);
    }

    return HttpResponse.json({
      code: 200,
      data: { list: filteredData, total: filteredData.length, page: 1, pageSize: 100 },
      message: 'success',
    });
  }),

  http.get('/mock-api/organizations/:id', async ({ params }) => {
    await delay(200);
    const org = organizationData.find(o => o.id === params.id);
    if (!org) {
      return HttpResponse.json({ code: 404, data: null, message: '组织不存在' });
    }
    return HttpResponse.json({ code: 200, data: org, message: 'success' });
  }),

  http.post('/mock-api/organizations', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newOrg = {
      id: String(Date.now()),
      name: body.name as string,
      code: body.code as string,
      parentId: (body.parentId as string) || null,
      leader: (body.leader as string) || '',
      memberCount: 0,
      sort: (body.sort as number) || 0,
      status: (body.status as string) || 'active',
      description: (body.description as string) || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    organizationData.push(newOrg);
    return HttpResponse.json({ code: 200, data: newOrg, message: 'success' });
  }),

  http.put('/mock-api/organizations/:id', async ({ params, request }) => {
    await delay(300);
    const index = organizationData.findIndex(o => o.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '组织不存在' });
    }

    const body = (await request.json()) as Record<string, unknown>;
    organizationData[index] = { ...organizationData[index], ...body } as typeof organizationData[0];
    return HttpResponse.json({ code: 200, data: organizationData[index], message: 'success' });
  }),

  http.delete('/mock-api/organizations/:id', async ({ params }) => {
    await delay(200);
    const index = organizationData.findIndex(o => o.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '组织不存在' });
    }

    const hasChildren = organizationData.some(o => o.parentId === params.id);
    if (hasChildren) {
      return HttpResponse.json({ code: 400, data: null, message: '该组织下存在子组织，无法删除' });
    }

    organizationData.splice(index, 1);
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),

  http.patch('/mock-api/organizations/:id/status', async ({ params, request }) => {
    await delay(200);
    const index = organizationData.findIndex(o => o.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '组织不存在' });
    }

    const body = (await request.json()) as { status?: string };
    organizationData[index].status = body.status || 'active';
    return HttpResponse.json({ code: 200, data: organizationData[index], message: 'success' });
  }),
];
