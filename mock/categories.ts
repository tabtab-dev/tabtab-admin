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
] as MockMethod[];
