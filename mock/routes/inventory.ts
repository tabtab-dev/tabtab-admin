/**
 * Inventory Mock 路由
 * @description 库存管理相关的 Mock API 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { successResponse, paginatedResponse } from '../utils/response';
import { warehousesData, stockData } from '../data/inventory';

/**
 * 库存管理路由
 */
export const inventoryRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  // 仓库管理
  'GET /mock-api/warehouses': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    let filteredData = [...warehousesData];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData.filter(w =>
        w.name.toLowerCase().includes(lowerSearch) ||
        w.code.toLowerCase().includes(lowerSearch) ||
        w.location.toLowerCase().includes(lowerSearch)
      );
    }

    if (status) {
      filteredData = filteredData.filter(w => w.status === status);
    }

    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);

    res.end(JSON.stringify(paginatedResponse(data, total, page, pageSize)));
  },

  'GET /mock-api/warehouses/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const warehouse = warehousesData.find(w => w.id === id);

    if (warehouse) {
      res.end(JSON.stringify(successResponse(warehouse)));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '仓库不存在' }));
    }
  },

  'POST /mock-api/warehouses': (req, res) => {
    const newWarehouse = {
      id: `wh-${Date.now()}`,
      name: req.body?.name || '新仓库',
      code: req.body?.code || `WH-${Date.now()}`,
      location: req.body?.location || '',
      manager: req.body?.manager || '',
      phone: req.body?.phone || '',
      capacity: Number(req.body?.capacity || 0),
      status: req.body?.status || 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    warehousesData.unshift(newWarehouse);
    res.end(JSON.stringify(successResponse(newWarehouse)));
  },

  'PUT /mock-api/warehouses/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = warehousesData.findIndex(w => w.id === id);

    if (index !== -1) {
      warehousesData[index] = {
        ...warehousesData[index],
        ...req.body,
        id,
      };
      res.end(JSON.stringify(successResponse(warehousesData[index])));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '仓库不存在' }));
    }
  },

  'DELETE /mock-api/warehouses/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = warehousesData.findIndex(w => w.id === id);

    if (index !== -1) {
      warehousesData.splice(index, 1);
      res.end(JSON.stringify(successResponse({ id })));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '仓库不存在' }));
    }
  },

  // 库存管理
  'GET /mock-api/stock': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const warehouseId = url.searchParams.get('warehouseId') || '';

    let filteredData = [...stockData];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData.filter(s =>
        s.productName.toLowerCase().includes(lowerSearch) ||
        s.sku.toLowerCase().includes(lowerSearch)
      );
    }

    if (warehouseId) {
      filteredData = filteredData.filter(s => s.warehouseId === warehouseId);
    }

    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);

    res.end(JSON.stringify(paginatedResponse(data, total, page, pageSize)));
  },

  'PATCH /mock-api/stock/:id': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const index = stockData.findIndex(s => s.id === id);

    if (index !== -1) {
      const quantity = Number(req.body?.quantity || stockData[index].quantity);
      stockData[index] = {
        ...stockData[index],
        quantity,
        available: quantity - stockData[index].reserved,
        lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      res.end(JSON.stringify(successResponse(stockData[index])));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ code: 404, data: null, message: '库存记录不存在' }));
    }
  },
};
