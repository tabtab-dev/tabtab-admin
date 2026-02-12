/**
 * 分类和标签领域类型定义
 */

import type { CATEGORY_STATUS } from '@/constants';

/** 分类状态类型 */
export type CategoryStatus = typeof CATEGORY_STATUS[keyof typeof CATEGORY_STATUS];

/**
 * 分类基础信息
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  sortOrder: number;
  status: CategoryStatus;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 标签基础信息
 */
export interface Tag {
  id: string;
  name: string;
  color?: string;
  productCount?: number;
  createdAt: string;
}

/**
 * 分类列表查询参数
 */
export interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  parentId?: string;
  isActive?: boolean;
}

/**
 * 创建分类参数
 */
export interface CreateCategoryParams {
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
}

/**
 * 更新分类参数
 */
export interface UpdateCategoryParams {
  name?: string;
  description?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 创建标签参数
 */
export interface CreateTagParams {
  name: string;
  color?: string;
}

/**
 * 更新标签参数
 */
export interface UpdateTagParams {
  name?: string;
  color?: string;
}
