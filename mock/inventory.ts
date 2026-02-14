/**
 * 库存管理模块 Mock 接口
 * @description 仓库和库存管理相关接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 仓库数据
let warehousesData = [
  {
    id: '1',
    name: '北京仓库',
    code: 'WH-BJ-001',
    location: '北京市朝阳区',
    manager: '张三',
    phone: '13800138001',
    capacity: 10000,
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '上海仓库',
    code: 'WH-SH-001',
    location: '上海市浦东新区',
    manager: '李四',
    phone: '13800138002',
    capacity: 8000,
    status: 'active',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: '广州仓库',
    code: 'WH-GZ-001',
    location: '广州市天河区',
    manager: '王五',
    phone: '13800138003',
    capacity: 6000,
    status: 'active',
    createdAt: '2024-01-03',
  },
];

// 库存数据
let stockData = Mock.mock({
  'list|50': [
    {
      id: '@id',
      productId: 'p-@integer(1, 20)',
      productName: '@ctitle(4, 8)',
      sku: 'SKU-@string("number", 6)',
      warehouseId: '@pick(["1", "2", "3"])',
      quantity: '@integer(10, 500)',
      minStock: '@integer(10, 100)',
      createdAt: '@date("yyyy-MM-dd")',
    },
  ],
}).list;

export default [
  // 获取仓库列表
  {
    url: '/mock-api/warehouses',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, status } = query;

      let filteredData = [...warehousesData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          w =>
            w.name.toLowerCase().includes(lowerSearch) ||
            w.code.toLowerCase().includes(lowerSearch)
        );
      }

      if (status) {
        filteredData = filteredData.filter(w => w.status === status);
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
  // 获取仓库详情
  {
    url: '/mock-api/warehouses/:id',
    method: 'get',
    response: ({ query }) => {
      const warehouse = warehousesData.find(w => w.id === query.id);
      if (!warehouse) {
        return { code: 404, data: null, message: '仓库不存在' };
      }
      return { code: 200, data: warehouse, message: 'success' };
    },
  },
  // 创建仓库
  {
    url: '/mock-api/warehouses',
    method: 'post',
    response: ({ body }) => {
      const newWarehouse = {
        id: String(Date.now()),
        name: body.name,
        code: body.code || `WH-${Date.now()}`,
        location: body.location,
        manager: body.manager,
        phone: body.phone,
        capacity: body.capacity || 5000,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };

      warehousesData.push(newWarehouse);
      return { code: 200, data: newWarehouse, message: 'success' };
    },
  },
  // 更新仓库
  {
    url: '/mock-api/warehouses/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = warehousesData.findIndex(w => w.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '仓库不存在' };
      }

      warehousesData[index] = { ...warehousesData[index], ...body };
      return { code: 200, data: warehousesData[index], message: 'success' };
    },
  },
  // 删除仓库
  {
    url: '/mock-api/warehouses/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = warehousesData.findIndex(w => w.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '仓库不存在' };
      }

      warehousesData.splice(index, 1);
      return { code: 200, data: null, message: 'success' };
    },
  },
  // 获取库存列表
  {
    url: '/mock-api/stock',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, warehouseId } = query;

      let filteredData = [...stockData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          s =>
            s.productName.toLowerCase().includes(lowerSearch) ||
            s.sku.toLowerCase().includes(lowerSearch)
        );
      }

      if (warehouseId) {
        filteredData = filteredData.filter(s => s.warehouseId === warehouseId);
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
  // 更新库存
  {
    url: '/mock-api/stock/:id',
    method: 'patch',
    response: ({ query, body }) => {
      const index = stockData.findIndex(s => s.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '库存记录不存在' };
      }

      stockData[index].quantity = body.quantity;
      return { code: 200, data: stockData[index], message: 'success' };
    },
  },
] as MockMethod[];
