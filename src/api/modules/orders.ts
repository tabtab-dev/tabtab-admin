/**
 * 订单管理相关 API
 * @description 订单的增删改查等接口
 */
import { request } from '../client';
import type { Order } from '@/types/models';
import type { PaginationData } from '../types';

/**
 * 创建订单参数
 */
export interface CreateOrderParams {
  customer: string;
  email: string;
  phone: string;
  items: number;
  address: string;
  note?: string;
}

/**
 * 更新订单参数
 */
export interface UpdateOrderParams {
  customer?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
}

/**
 * 查询订单列表参数
 */
export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: Order['status'];
}

/**
 * 订单 API
 */
export const ordersApi = {
  /**
   * 获取订单列表
   * @param params - 查询参数
   * @returns 分页订单列表
   */
  getOrders: (params: GetOrdersParams = {}) =>
    request.get<PaginationData<Order>>('/orders', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        status: params.status,
      },
    }),

  /**
   * 根据 ID 获取订单详情
   * @param id - 订单 ID
   * @returns 订单详情
   */
  getOrderById: (id: string) => request.get<Order>(`/orders/${id}`),

  /**
   * 创建订单
   * @param data - 订单数据
   * @returns 创建的订单
   */
  createOrder: (data: CreateOrderParams) =>
    request.post<Order>('/orders', data),

  /**
   * 更新订单
   * @param id - 订单 ID
   * @param data - 更新数据
   * @returns 更新后的订单
   */
  updateOrder: (id: string, data: UpdateOrderParams) =>
    request.put<Order>(`/orders/${id}`, data),

  /**
   * 删除订单
   * @param id - 订单 ID
   * @returns 删除结果
   */
  deleteOrder: (id: string) => request.delete<void>(`/orders/${id}`),

  /**
   * 批量删除订单
   * @param ids - 订单 ID 数组
   * @returns 删除结果
   */
  batchDeleteOrders: (ids: string[]) =>
    request.post<void>('/orders/batch-delete', { ids }),

  /**
   * 更新订单状态
   * @param id - 订单 ID
   * @param status - 新状态
   * @returns 更新结果
   */
  updateOrderStatus: (id: string, status: Order['status']) =>
    request.patch<Order>(`/orders/${id}/status`, { status }),
};
