/**
 * 库存管理相关 API
 * @description 仓库和库存的增删改查等接口
 */
import { request } from '../client';
import type { Warehouse, StockItem, PaginationData } from '@/types';

/**
 * 创建仓库参数
 */
export interface CreateWarehouseParams {
  name: string;
  code: string;
  location: string;
  manager: string;
  phone: string;
  capacity: number;
}

/**
 * 更新仓库参数
 */
export interface UpdateWarehouseParams {
  name?: string;
  code?: string;
  location?: string;
  manager?: string;
  phone?: string;
  status?: Warehouse['status'];
  capacity?: number;
}

/**
 * 查询仓库列表参数
 */
export interface GetWarehousesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: Warehouse['status'];
}

/**
 * 查询库存列表参数
 */
export interface GetStockParams {
  page?: number;
  pageSize?: number;
  search?: string;
  warehouseId?: string;
}

/**
 * 库存管理 API
 */
export const inventoryApi = {
  /**
   * 获取仓库列表
   * @param params - 查询参数
   * @returns 分页仓库列表
   */
  getWarehouses: (params: GetWarehousesParams = {}) =>
    request.get<PaginationData<Warehouse>>('/warehouses', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        status: params.status,
      },
    }),

  /**
   * 根据 ID 获取仓库详情
   * @param id - 仓库 ID
   * @returns 仓库详情
   */
  getWarehouseById: (id: string) => request.get<Warehouse>(`/warehouses/${id}`),

  /**
   * 创建仓库
   * @param data - 仓库数据
   * @returns 创建的仓库
   */
  createWarehouse: (data: CreateWarehouseParams) =>
    request.post<Warehouse>('/warehouses', data),

  /**
   * 更新仓库
   * @param id - 仓库 ID
   * @param data - 更新数据
   * @returns 更新后的仓库
   */
  updateWarehouse: (id: string, data: UpdateWarehouseParams) =>
    request.put<Warehouse>(`/warehouses/${id}`, data),

  /**
   * 删除仓库
   * @param id - 仓库 ID
   * @returns 删除结果
   */
  deleteWarehouse: (id: string) => request.delete<void>(`/warehouses/${id}`),

  /**
   * 获取库存列表
   * @param params - 查询参数
   * @returns 分页库存列表
   */
  getStock: (params: GetStockParams = {}) =>
    request.get<PaginationData<StockItem>>('/stock', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        warehouseId: params.warehouseId,
      },
    }),

  /**
   * 更新库存
   * @param id - 库存项 ID
   * @param quantity - 新数量
   * @returns 更新结果
   */
  updateStock: (id: string, quantity: number) =>
    request.patch<StockItem>(`/stock/${id}`, { quantity }),
};
