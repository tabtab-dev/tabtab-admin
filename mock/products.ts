/**
 * 产品模块 Mock 接口
 * @description 产品管理相关接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 使用 mockjs 生成产品数据
const generateProducts = () => {
  const categories = ['电子产品', '配件', '家居', '服饰', '食品'];
  const statuses = ['active', 'inactive'];

  return Mock.mock({
    'list|50': [
      {
        id: '@id',
        name: '@ctitle(4, 8)',
        sku: 'SKU-@string("number", 6)',
        category: () => categories[Math.floor(Math.random() * categories.length)],
        price: '@float(10, 2000, 2, 2)',
        stock: '@integer(0, 500)',
        status: () => statuses[Math.floor(Math.random() * statuses.length)],
        description: '@csentence(10, 30)',
        createdAt: '@date("yyyy-MM-dd")',
      },
    ],
  }).list;
};

let productsData = generateProducts();

export default [
  // 获取产品列表
  {
    url: '/mock-api/products',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, status } = query;

      let filteredData = [...productsData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          p =>
            p.name.toLowerCase().includes(lowerSearch) ||
            p.sku.toLowerCase().includes(lowerSearch) ||
            p.category.toLowerCase().includes(lowerSearch)
        );
      }

      if (status) {
        filteredData = filteredData.filter(p => p.status === status);
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
  // 获取产品详情
  {
    url: '/mock-api/products/:id',
    method: 'get',
    response: ({ query }) => {
      const product = productsData.find(p => p.id === query.id);
      if (!product) {
        return { code: 404, data: null, message: '产品不存在' };
      }
      return { code: 200, data: product, message: 'success' };
    },
  },
  // 创建产品
  {
    url: '/mock-api/products',
    method: 'post',
    response: ({ body }) => {
      const newProduct = {
        id: Mock.mock('@id'),
        name: body.name || '新产品',
        sku: body.sku || `SKU-${Date.now()}`,
        category: body.category || '未分类',
        price: Number(body.price || 0),
        stock: Number(body.stock || 0),
        status: body.status || 'active',
        description: body.description || '',
        createdAt: new Date().toISOString().split('T')[0],
      };

      productsData.unshift(newProduct);
      return { code: 200, data: newProduct, message: 'success' };
    },
  },
  // 更新产品
  {
    url: '/mock-api/products/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = productsData.findIndex(p => p.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '产品不存在' };
      }

      productsData[index] = { ...productsData[index], ...body };
      return { code: 200, data: productsData[index], message: 'success' };
    },
  },
  // 删除产品
  {
    url: '/mock-api/products/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = productsData.findIndex(p => p.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '产品不存在' };
      }

      productsData.splice(index, 1);
      return { code: 200, data: { id: query.id }, message: 'success' };
    },
  },
  // 批量删除产品
  {
    url: '/mock-api/products/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids || [];
      const initialLength = productsData.length;
      productsData = productsData.filter(p => !ids.includes(p.id));

      return {
        code: 200,
        data: { deleted: initialLength - productsData.length, ids },
        message: 'success',
      };
    },
  },
] as MockMethod[];
