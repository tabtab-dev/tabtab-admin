/**
 * 产品相关类型定义
 */

import type { BaseModel } from './base';
import type { PRODUCT_STATUS } from '@/constants';

/** 产品状态类型 */
export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

/** 产品模型 */
export interface Product extends BaseModel {
  /** SKU */
  sku: string;
  /** 产品名称 */
  name: string;
  /** 分类 */
  category: string;
  /** 价格 */
  price: number;
  /** 库存 */
  stock: number;
  /** 状态 */
  status: ProductStatus;
  /** 销量 */
  sales: number;
  /** 描述 */
  description?: string;
}
