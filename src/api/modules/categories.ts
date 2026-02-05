/**
 * 分类和标签管理相关 API
 * @description 分类和标签的增删改查等接口
 */
import { request } from '../client';
import type { Category, Tag } from '@/stores/business/categories';
import type { PaginationData } from '../types';

/**
 * 创建分类参数
 */
export interface CreateCategoryParams {
  name: string;
  code: string;
  level: 1 | 2;
  parentId?: string;
  sort: number;
  description?: string;
}

/**
 * 更新分类参数
 */
export interface UpdateCategoryParams {
  name?: string;
  code?: string;
  level?: 1 | 2;
  parentId?: string;
  sort?: number;
  status?: Category['status'];
  description?: string;
}

/**
 * 查询分类列表参数
 */
export interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  level?: 1 | 2;
  status?: Category['status'];
}

/**
 * 创建标签参数
 */
export interface CreateTagParams {
  name: string;
  color: string;
}

/**
 * 更新标签参数
 */
export interface UpdateTagParams {
  name?: string;
  color?: string;
}

/**
 * 分类和标签 API
 */
export const categoriesApi = {
  /**
   * 获取分类列表
   * @param params - 查询参数
   * @returns 分页分类列表
   */
  getCategories: (params: GetCategoriesParams = {}) =>
    request.get<PaginationData<Category>>('/categories', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        level: params.level,
        status: params.status,
      },
    }),

  /**
   * 根据 ID 获取分类详情
   * @param id - 分类 ID
   * @returns 分类详情
   */
  getCategoryById: (id: string) => request.get<Category>(`/categories/${id}`),

  /**
   * 创建分类
   * @param data - 分类数据
   * @returns 创建的分类
   */
  createCategory: (data: CreateCategoryParams) =>
    request.post<Category>('/categories', data),

  /**
   * 更新分类
   * @param id - 分类 ID
   * @param data - 更新数据
   * @returns 更新后的分类
   */
  updateCategory: (id: string, data: UpdateCategoryParams) =>
    request.put<Category>(`/categories/${id}`, data),

  /**
   * 删除分类
   * @param id - 分类 ID
   * @returns 删除结果
   */
  deleteCategory: (id: string) => request.delete<void>(`/categories/${id}`),

  /**
   * 批量删除分类
   * @param ids - 分类 ID 数组
   * @returns 删除结果
   */
  batchDeleteCategories: (ids: string[]) =>
    request.post<void>('/categories/batch-delete', { ids }),

  /**
   * 获取标签列表
   * @param params - 查询参数
   * @returns 分页标签列表
   */
  getTags: (params: { page?: number; pageSize?: number; search?: string } = {}) =>
    request.get<PaginationData<Tag>>('/tags', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
      },
    }),

  /**
   * 根据 ID 获取标签详情
   * @param id - 标签 ID
   * @returns 标签详情
   */
  getTagById: (id: string) => request.get<Tag>(`/tags/${id}`),

  /**
   * 创建标签
   * @param data - 标签数据
   * @returns 创建的标签
   */
  createTag: (data: CreateTagParams) =>
    request.post<Tag>('/tags', data),

  /**
   * 更新标签
   * @param id - 标签 ID
   * @param data - 更新数据
   * @returns 更新后的标签
   */
  updateTag: (id: string, data: UpdateTagParams) =>
    request.put<Tag>(`/tags/${id}`, data),

  /**
   * 删除标签
   * @param id - 标签 ID
   * @returns 删除结果
   */
  deleteTag: (id: string) => request.delete<void>(`/tags/${id}`),

  /**
   * 批量删除标签
   * @param ids - 标签 ID 数组
   * @returns 删除结果
   */
  batchDeleteTags: (ids: string[]) =>
    request.post<void>('/tags/batch-delete', { ids }),
};
