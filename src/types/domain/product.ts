/**
 * 产品领域类型定义
 */

import type { PRODUCT_STATUS } from '@/constants';

/** 产品状态类型 */
export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

/**
 * 产品基础信息
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: ProductStatus;
  categoryId: string;
  categoryName?: string;
  images: string[];
  tags: string[];
  sku: string;
  sales: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 产品列表查询参数
 */
export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * 创建产品参数
 */
export interface CreateProductParams {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: string;
  images?: string[];
  tags?: string[];
  sku?: string;
}

/**
 * 更新产品参数
 */
export interface UpdateProductParams {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  status?: ProductStatus;
  categoryId?: string;
  images?: string[];
  tags?: string[];
}
