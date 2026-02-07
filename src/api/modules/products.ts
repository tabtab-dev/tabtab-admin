/**
 * 产品管理相关 API
 * @description 产品的增删改查等接口
 */
import { request } from '../client';
import type { Product, PaginationData } from '@/types';

/**
 * 创建产品参数
 */
export interface CreateProductParams {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
}

/**
 * 更新产品参数
 */
export interface UpdateProductParams {
  sku?: string;
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  description?: string;
}

/**
 * 查询产品列表参数
 */
export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: Product['status'];
}

/**
 * 产品 API
 */
export const productsApi = {
  /**
   * 获取产品列表
   * @param params - 查询参数
   * @returns 分页产品列表
   */
  getProducts: (params: GetProductsParams = {}) =>
    request.get<PaginationData<Product>>('/products', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        category: params.category,
        status: params.status,
      },
    }),

  /**
   * 根据 ID 获取产品详情
   * @param id - 产品 ID
   * @returns 产品详情
   */
  getProductById: (id: string) => request.get<Product>(`/products/${id}`),

  /**
   * 创建产品
   * @param data - 产品数据
   * @returns 创建的产品
   */
  createProduct: (data: CreateProductParams) =>
    request.post<Product>('/products', data),

  /**
   * 更新产品
   * @param id - 产品 ID
   * @param data - 更新数据
   * @returns 更新后的产品
   */
  updateProduct: (id: string, data: UpdateProductParams) =>
    request.put<Product>(`/products/${id}`, data),

  /**
   * 删除产品
   * @param id - 产品 ID
   * @returns 删除结果
   */
  deleteProduct: (id: string) => request.delete<void>(`/products/${id}`),

  /**
   * 批量删除产品
   * @param ids - 产品 ID 数组
   * @returns 删除结果
   */
  batchDeleteProducts: (ids: string[]) =>
    request.post<void>('/products/batch-delete', { ids }),

  /**
   * 更新产品库存
   * @param id - 产品 ID
   * @param stock - 新库存数量
   * @returns 更新结果
   */
  updateStock: (id: string, stock: number) =>
    request.patch<Product>(`/products/${id}/stock`, { stock }),
};
