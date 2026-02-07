/**
 * 分类和标签相关类型定义
 */

import type { BaseModel } from './base';
import type { CATEGORY_STATUS } from '@/constants';

/** 分类状态类型 */
export type CategoryStatus = typeof CATEGORY_STATUS[keyof typeof CATEGORY_STATUS];

/** 分类模型 */
export interface Category extends BaseModel {
  /** 分类名称 */
  name: string;
  /** 分类编码 */
  code: string;
  /** 层级 */
  level: 1 | 2;
  /** 父级ID */
  parentId?: string;
  /** 父级名称 */
  parentName?: string;
  /** 排序 */
  sort: number;
  /** 状态 */
  status: CategoryStatus;
  /** 产品数量 */
  productCount: number;
  /** 描述 */
  description?: string;
}

/** 标签模型 */
export interface Tag extends BaseModel {
  /** 标签名称 */
  name: string;
  /** 标签颜色 */
  color: string;
  /** 产品数量 */
  productCount: number;
}
