/**
 * 分类模块 Mock 接口
 * @description 分类管理相关接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 分类数据
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
  {
    id: 't-001',
    name: '热销',
    color: '#ff4d4f',
    productCount: 45,
    createdAt: '2024-01-10',
  },
  {
    id: 't-002',
    name: '新品',
    color: '#1890ff',
    productCount: 32,
    createdAt: '2024-01-11',
  },
  {
    id: 't-003',
    name: '限时特惠',
    color: '#faad14',
    productCount: 28,
    createdAt: '2024-01-12',
  },
  {
    id: 't-004',
    name: '爆款',
    color: '#52c41a',
    productCount: 56,
    createdAt: '2024-01-13',
  },
  {
    id: 't-005',
    name: '精选',
    color: '#722ed1',
    productCount: 38,
    createdAt: '2024-01-14',
  },
  {
    id: 't-006',
    name: '推荐',
    color: '#13c2c2',
    productCount: 42,
    createdAt: '2024-01-15',
  },
  {
    id: 't-007',
    name: '人气',
    color: '#eb2f96',
    productCount: 35,
    createdAt: '2024-01-16',
  },
  {
    id: 't-008',
    name: '特价',
    color: '#fa541c',
    productCount: 29,
    createdAt: '2024-01-17',
  },
];

export default [
  // 获取分类列表
  {
    url: '/mock-api/categories',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, status } = query;

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
      const start = (Number(page) - 1) * Number(pageSize);
      const list = filteredData.slice(start, start + Number(pageSize));

      return {
        code: 200,
        data: { list, total, page: Number(page), pageSize: Number(pageSize) },
        message: 'success',
      };
    },
  },
  // 获取分类树形结构
  {
    url: '/mock-api/categories/tree',
    method: 'get',
    response: () => {
      const buildTree = (data: any[], parentId = '') => {
        return data
          .filter(item => item.parentId === parentId)
          .map(item => ({
            ...item,
            children: buildTree(data, item.id),
          }));
      };

      return { code: 200, data: buildTree(categoriesData), message: 'success' };
    },
  },
  // 创建分类
  {
    url: '/mock-api/categories',
    method: 'post',
    response: ({ body }) => {
      const newCategory = {
        id: `c-${Date.now()}`,
        name: body.name,
        code: body.code || `CAT-${Date.now()}`,
        level: body.level || 1,
        parentId: body.parentId || '',
        parentName: body.parentName || '',
        sort: body.sort || 0,
        status: body.status || 'active',
        productCount: 0,
        description: body.description || '',
        createdAt: new Date().toISOString().split('T')[0],
      };

      categoriesData.unshift(newCategory);
      return { code: 200, data: newCategory, message: 'success' };
    },
  },
  // 更新分类
  {
    url: '/mock-api/categories/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = categoriesData.findIndex(c => c.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '分类不存在' };
      }

      categoriesData[index] = { ...categoriesData[index], ...body };
      return { code: 200, data: categoriesData[index], message: 'success' };
    },
  },
  // 删除分类
  {
    url: '/mock-api/categories/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = categoriesData.findIndex(c => c.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '分类不存在' };
      }

      // 检查是否有子分类
      const hasChildren = categoriesData.some(c => c.parentId === query.id);
      if (hasChildren) {
        return { code: 400, data: null, message: '该分类下存在子分类，无法删除' };
      }

      categoriesData.splice(index, 1);
      return { code: 200, data: null, message: 'success' };
    },
  },

  // =============== 标签接口 ===============

  // 获取标签列表
  {
    url: '/mock-api/tags',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search } = query;

      let filteredData = [...tagsData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(t =>
          t.name.toLowerCase().includes(lowerSearch)
        );
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
  // 获取标签详情
  {
    url: '/mock-api/tags/:id',
    method: 'get',
    response: ({ query }) => {
      const tag = tagsData.find(t => t.id === query.id);
      if (!tag) {
        return { code: 404, data: null, message: '标签不存在' };
      }
      return { code: 200, data: tag, message: 'success' };
    },
  },
  // 创建标签
  {
    url: '/mock-api/tags',
    method: 'post',
    response: ({ body }) => {
      const newTag = {
        id: `t-${Date.now()}`,
        name: body.name,
        color: body.color || '#1890ff',
        productCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      tagsData.unshift(newTag);
      return { code: 200, data: newTag, message: 'success' };
    },
  },
  // 更新标签
  {
    url: '/mock-api/tags/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = tagsData.findIndex(t => t.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '标签不存在' };
      }

      tagsData[index] = { ...tagsData[index], ...body };
      return { code: 200, data: tagsData[index], message: 'success' };
    },
  },
  // 删除标签
  {
    url: '/mock-api/tags/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = tagsData.findIndex(t => t.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '标签不存在' };
      }

      tagsData.splice(index, 1);
      return { code: 200, data: null, message: 'success' };
    },
  },
  // 批量删除标签
  {
    url: '/mock-api/tags/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const { ids } = body;
      tagsData = tagsData.filter(t => !ids.includes(t.id));
      return { code: 200, data: null, message: 'success' };
    },
  },
] as MockMethod[];
