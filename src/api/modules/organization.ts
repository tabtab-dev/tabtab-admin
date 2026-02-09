/**
 * 组织架构相关 API
 * @description 部门的增删改查等接口
 */
import { request } from '../client';
import type { PaginationData } from '@/types';

/**
 * 部门数据
 */
export interface Organization {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  leader: string;
  memberCount: number;
  sort: number;
  status: 'active' | 'inactive';
  description: string;
  createdAt: string;
}

/**
 * 创建部门参数
 */
export interface CreateOrganizationParams {
  name: string;
  code: string;
  parentId?: string | null;
  leader?: string;
  sort?: number;
  status?: 'active' | 'inactive';
  description?: string;
}

/**
 * 更新部门参数
 */
export interface UpdateOrganizationParams {
  name?: string;
  code?: string;
  parentId?: string | null;
  leader?: string;
  sort?: number;
  status?: 'active' | 'inactive';
  description?: string;
}

/**
 * 查询部门列表参数
 */
export interface GetOrganizationsParams {
  search?: string;
}

/**
 * 组织架构 API
 */
export const organizationApi = {
  /**
   * 获取部门列表
   * @param params - 查询参数
   * @returns 部门列表
   */
  getOrganizations: (params: GetOrganizationsParams = {}) =>
    request.get<PaginationData<Organization>>('/organizations', {
      params: {
        search: params.search,
      },
    }),

  /**
   * 根据 ID 获取部门详情
   * @param id - 部门 ID
   * @returns 部门详情
   */
  getOrganizationById: (id: string) => request.get<Organization>(`/organizations/${id}`),

  /**
   * 创建部门
   * @param data - 部门数据
   * @returns 创建的部门
   */
  createOrganization: (data: CreateOrganizationParams) =>
    request.post<Organization>('/organizations', data),

  /**
   * 更新部门
   * @param id - 部门 ID
   * @param data - 更新数据
   * @returns 更新后的部门
   */
  updateOrganization: (id: string, data: UpdateOrganizationParams) =>
    request.put<Organization>(`/organizations/${id}`, data),

  /**
   * 删除部门
   * @param id - 部门 ID
   * @returns 删除结果
   */
  deleteOrganization: (id: string) => request.delete<void>(`/organizations/${id}`),

  /**
   * 更新部门状态
   * @param id - 部门 ID
   * @param status - 新状态
   * @returns 更新结果
   */
  updateOrganizationStatus: (id: string, status: 'active' | 'inactive') =>
    request.patch<Organization>(`/organizations/${id}/status`, { status }),
};
