/**
 * 用户管理相关 API
 * @description 用户的增删改查等接口
 */
import { request } from '../request';
import { requestMock } from '../request.mock';
import type { User } from '@/stores/users';
import type { PaginationData } from '@/composables/useHttpRequest';

/**
 * 创建用户参数
 */
export interface CreateUserParams {
  name: string;
  email: string;
  role: User['role'];
  status?: User['status'];
  avatar?: string;
}

/**
 * 更新用户参数
 */
export interface UpdateUserParams {
  name?: string;
  email?: string;
  role?: User['role'];
  status?: User['status'];
  avatar?: string;
}

/**
 * 查询用户列表参数
 */
export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: User['role'];
  status?: User['status'];
}

/**
 * 用户 API（正式接口）
 */
export const usersApi = {
  /**
   * 获取用户列表
   * @param params - 查询参数
   * @returns 分页用户列表
   */
  getUsers: (params: GetUsersParams = {}) =>
    request.get<PaginationData<User>>('/users', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        role: params.role,
        status: params.status,
      },
    }),

  /**
   * 根据 ID 获取用户详情
   * @param id - 用户 ID
   * @returns 用户详情
   */
  getUserById: (id: string) => request.get<User>(`/users/${id}`),

  /**
   * 创建用户
   * @param data - 用户数据
   * @returns 创建的用户
   */
  createUser: (data: CreateUserParams) =>
    request.post<User>('/users', data),

  /**
   * 更新用户
   * @param id - 用户 ID
   * @param data - 更新数据
   * @returns 更新后的用户
   */
  updateUser: (id: string, data: UpdateUserParams) =>
    request.put<User>(`/users/${id}`, data),

  /**
   * 删除用户
   * @param id - 用户 ID
   * @returns 删除结果
   */
  deleteUser: (id: string) => request.delete<void>(`/users/${id}`),

  /**
   * 批量删除用户
   * @param ids - 用户 ID 数组
   * @returns 删除结果
   */
  batchDeleteUsers: (ids: string[]) =>
    request.post<void>('/users/batch-delete', { ids }),

  /**
   * 更新用户状态
   * @param id - 用户 ID
   * @param status - 新状态
   * @returns 更新结果
   */
  updateUserStatus: (id: string, status: User['status']) =>
    request.patch<User>(`/users/${id}/status`, { status }),

  /**
   * 上传用户头像
   * @param id - 用户 ID
   * @param file - 头像文件
   * @returns 头像 URL
   */
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request.post<{ avatarUrl: string }>(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

/**
 * 用户 API（Mock 接口）
 */
export const usersApiMock = {
  /**
   * 获取用户列表
   * @param params - 查询参数
   * @returns 分页用户列表
   */
  getUsers: (params: GetUsersParams = {}) =>
    requestMock.get<PaginationData<User>>('/users', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        search: params.search,
        role: params.role,
        status: params.status,
      },
    }),

  /**
   * 根据 ID 获取用户详情
   * @param id - 用户 ID
   * @returns 用户详情
   */
  getUserById: (id: string) => requestMock.get<User>(`/users/${id}`),

  /**
   * 创建用户
   * @param data - 用户数据
   * @returns 创建的用户
   */
  createUser: (data: CreateUserParams) =>
    requestMock.post<User>('/users', data),

  /**
   * 更新用户
   * @param id - 用户 ID
   * @param data - 更新数据
   * @returns 更新后的用户
   */
  updateUser: (id: string, data: UpdateUserParams) =>
    requestMock.put<User>(`/users/${id}`, data),

  /**
   * 删除用户
   * @param id - 用户 ID
   * @returns 删除结果
   */
  deleteUser: (id: string) => requestMock.delete<void>(`/users/${id}`),

  /**
   * 批量删除用户
   * @param ids - 用户 ID 数组
   * @returns 删除结果
   */
  batchDeleteUsers: (ids: string[]) =>
    requestMock.post<void>('/users/batch-delete', { ids }),

  /**
   * 更新用户状态
   * @param id - 用户 ID
   * @param status - 新状态
   * @returns 更新结果
   */
  updateUserStatus: (id: string, status: User['status']) =>
    requestMock.patch<User>(`/users/${id}/status`, { status }),

  /**
   * 上传用户头像
   * @param id - 用户 ID
   * @param file - 头像文件
   * @returns 头像 URL
   */
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return requestMock.post<{ avatarUrl: string }>(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};