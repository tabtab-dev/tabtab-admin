/**
 * 分类模块 MSW handlers
 * @description 分类管理相关接口
 */
import { http, HttpResponse, delay } from 'msw';

let categoriesData = [
  {
    id: 'c-001',
    name: '电子产品',
    code: 'CAT-001',
    level: 1,
    parentId: '',
    parentName: '',
    sort: 1,
    status: 'active',
    productCount: 15,
    description: '各类电子设备',
    createdAt: '2024-01-15',
  },
  {
    id: 'c-002',
    name: '手机配件',
    code: 'CAT-002',
    level: 1,
    parentId: '',
    parentName: '',
    sort: 2,
    status: 'active',
    productCount: 25,
    description: '手机相关配件',
    createdAt: '2024-01-16',
  },
  {
    id: 'c-003',
    name: '电脑配件',
    code: 'CAT-003',
    level: 1,
    parentId: '',
    parentName: '',
    sort: 3,
    status: 'active',
    productCount: 18,
    description: '电脑相关配件',
    createdAt: '2024-01-17',
  },
  {
    id: 'c-004',
    name: '智能设备',
    code: 'CAT-004',
    level: 1,
    parentId: '',
    parentName: '',
    sort: 4,
    status: 'active',
    productCount: 12,
    description: '智能家居设备',
    createdAt: '2024-01-18',
  },
  {
    id: 'c-005',
    name: '耳机',
    code: 'CAT-005',
    level: 2,
    parentId: 'c-001',
    parentName: '电子产品',
    sort: 1,
    status: 'active',
    productCount: 8,
    description: '各类耳机产品',
    createdAt: '2024-01-19',
  },
  {
    id: 'c-006',
    name: '手表',
    code: 'CAT-006',
    level: 2,
    parentId: 'c-001',
    parentName: '电子产品',
    sort: 2,
    status: 'active',
    productCount: 5,
    description: '智能手表',
    createdAt: '2024-01-20',
  },
];

let tagsData = [
  { id: 't-001', name: '热销', color: '#ff4d4f', productCount: 45, createdAt: '2024-01-10' },
  { id: 't-002', name: '新品', color: '#1890ff', productCount: 32, createdAt: '2024-01-11' },
  { id: 't-003', name: '限时特惠', color: '#faad14', productCount: 28, createdAt: '2024-01-12' },
  { id: 't-004', name: '爆款', color: '#52c41a', productCount: 56, createdAt: '2024-01-13' },
  { id: 't-005', name: '精选', color: '#722ed1', productCount: 38, createdAt: '2024-01-14' },
  { id: 't-006', name: '推荐', color: '#13c2c2', productCount: 42, createdAt: '2024-01-15' },
  { id: 't-007', name: '人气', color: '#eb2f96', productCount: 35, createdAt: '2024-01-16' },
  { id: 't-008', name: '特价', color: '#fa541c', productCount: 29, createdAt: '2024-01-17' },
];

export const categoryHandlers = [
  http.get('/mock-api/categories', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');

    let filteredData = [...categoriesData];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData.filter(
        c =>
          c.name.toLowerCase().includes(lowerSearch) ||
          c.code.toLowerCase().includes(lowerSearch)
      );
    }

    if (status) {
      filteredData = filteredData.filter(c => c.status === status);
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

  http.get('/mock-api/categories/tree', async () => {
    await delay(200);
    const buildTree = (data: any[], parentId = '') => {
      return data
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildTree(data, item.id),
        }));
    };

    return HttpResponse.json({ code: 200, data: buildTree(categoriesData), message: 'success' });
  }),

  http.post('/mock-api/categories', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newCategory = {
      id: `c-${Date.now()}`,
      name: body.name as string,
      code: (body.code as string) || `CAT-${Date.now()}`,
      level: (body.level as number) || 1,
      parentId: (body.parentId as string) || '',
      parentName: (body.parentName as string) || '',
      sort: (body.sort as number) || 0,
      status: (body.status as string) || 'active',
      productCount: 0,
      description: (body.description as string) || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    categoriesData.unshift(newCategory);
    return HttpResponse.json({ code: 200, data: newCategory, message: 'success' });
  }),

  http.put('/mock-api/categories/:id', async ({ params, request }) => {
    await delay(300);
    const index = categoriesData.findIndex(c => c.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '分类不存在' });
    }

    const body = (await request.json()) as Record<string, unknown>;
    categoriesData[index] = { ...categoriesData[index], ...body } as typeof categoriesData[0];
    return HttpResponse.json({ code: 200, data: categoriesData[index], message: 'success' });
  }),

  http.delete('/mock-api/categories/:id', async ({ params }) => {
    await delay(200);
    const index = categoriesData.findIndex(c => c.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '分类不存在' });
    }

    const hasChildren = categoriesData.some(c => c.parentId === params.id);
    if (hasChildren) {
      return HttpResponse.json({ code: 400, data: null, message: '该分类下存在子分类，无法删除' });
    }

    categoriesData.splice(index, 1);
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),

  http.get('/mock-api/tags', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const search = url.searchParams.get('search');

    let filteredData = [...tagsData];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData.filter(t => t.name.toLowerCase().includes(lowerSearch));
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

  http.get('/mock-api/tags/:id', async ({ params }) => {
    await delay(200);
    const tag = tagsData.find(t => t.id === params.id);
    if (!tag) {
      return HttpResponse.json({ code: 404, data: null, message: '标签不存在' });
    }
    return HttpResponse.json({ code: 200, data: tag, message: 'success' });
  }),

  http.post('/mock-api/tags', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newTag = {
      id: `t-${Date.now()}`,
      name: body.name as string,
      color: (body.color as string) || '#1890ff',
      productCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    tagsData.unshift(newTag);
    return HttpResponse.json({ code: 200, data: newTag, message: 'success' });
  }),

  http.put('/mock-api/tags/:id', async ({ params, request }) => {
    await delay(300);
    const index = tagsData.findIndex(t => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '标签不存在' });
    }

    const body = (await request.json()) as Record<string, unknown>;
    tagsData[index] = { ...tagsData[index], ...body } as typeof tagsData[0];
    return HttpResponse.json({ code: 200, data: tagsData[index], message: 'success' });
  }),

  http.delete('/mock-api/tags/:id', async ({ params }) => {
    await delay(200);
    const index = tagsData.findIndex(t => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '标签不存在' });
    }

    tagsData.splice(index, 1);
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),

  http.post('/mock-api/tags/batch-delete', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { ids?: string[] };
    const { ids } = body;
    tagsData = tagsData.filter(t => !ids?.includes(t.id));
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),
];
