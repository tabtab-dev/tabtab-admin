/**
 * 角色管理相关 API
 * @description 角色的增删改查和权限分配等接口
 */
import { request } from '../client';
import type { PaginationData } from '@/types';

/**
 * 角色数据
 */
export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

/**
 * 创建角色参数
 */
export interface CreateRoleParams {
  name: string;
  code: string;
  description?: string;
  permissions?: string[];
  status?: 'active' | 'inactive';
}

/**
 * 更新角色参数
 */
export interface UpdateRoleParams {
  name?: string;
  code?: string;
  description?: string;
  permissions?: string[];
  status?: 'active' | 'inactive';
}

/**
 * 查询角色列表参数
 */
export interface GetRolesParams {
  search?: string;
}

/**
 * 角色 API
 */
export const roleApi = {
  /**
   * 获取角色列表
   * @param params - 查询参数
   * @returns 角色列表
   */
  getRoles: (params: GetRolesParams = {}) =>
    request.get<PaginationData<Role>>('/roles', {
      params: {
        search: params.search,
      },
    }),

  /**
   * 根据 ID 获取角色详情
   * @param id - 角色 ID
   * @returns 角色详情
   */
  getRoleById: (id: string) => request.get<Role>(`/roles/${id}`),

  /**
   * 创建角色
   * @param data - 角色数据
   * @returns 创建的角色
   */
  createRole: (data: CreateRoleParams) =>
    request.post<Role>('/roles', data),

  /**
   * 更新角色
   * @param id - 角色 ID
   * @param data - 更新数据
   * @returns 更新后的角色
   */
  updateRole: (id: string, data: UpdateRoleParams) =>
    request.put<Role>(`/roles/${id}`, data),

  /**
   * 删除角色
   * @param id - 角色 ID
   * @returns 删除结果
   */
  deleteRole: (id: string) => request.delete<void>(`/roles/${id}`),

  /**
   * 更新角色状态
   * @param id - 角色 ID
   * @param status - 新状态
   * @returns 更新结果
   */
  updateRoleStatus: (id: string, status: 'active' | 'inactive') =>
    request.patch<Role>(`/roles/${id}/status`, { status }),

  /**
   * 更新角色权限
   * @param id - 角色 ID
   * @param permissions - 权限列表
   * @returns 更新结果
   */
  updateRolePermissions: (id: string, permissions: string[]) =>
    request.patch<Role>(`/roles/${id}/permissions`, { permissions }),
};
