/**
 * 菜单相关 API
 * @description 获取用户菜单、路由配置和菜单管理等接口
 */
import { request } from '../client';
import type { MenuResponse } from '@/types/menu';
import type { PaginationData } from '@/types';

/**
 * 菜单数据（后端原始格式）
 */
export interface Menu {
  id: string;
  name: string;
  title: string;
  path: string;
  component: string;
  icon: string;
  parentId: string | null;
  sort: number;
  status: 'active' | 'inactive';
  hidden: boolean;
  keepAlive: boolean;
  external: boolean;
  permission: string;
  createdAt: string;
}

/**
 * 创建菜单参数
 */
export interface CreateMenuParams {
  name: string;
  title: string;
  path: string;
  component: string;
  icon?: string;
  parentId?: string | null;
  sort?: number;
  status?: 'active' | 'inactive';
  hidden?: boolean;
  keepAlive?: boolean;
  external?: boolean;
  permission?: string;
}

/**
 * 更新菜单参数
 */
export interface UpdateMenuParams {
  name?: string;
  title?: string;
  path?: string;
  component?: string;
  icon?: string;
  parentId?: string | null;
  sort?: number;
  status?: 'active' | 'inactive';
  hidden?: boolean;
  keepAlive?: boolean;
  external?: boolean;
  permission?: string;
}

/**
 * 查询菜单列表参数
 */
export interface GetMenusParams {
  search?: string;
}

/**
 * 菜单 API
 */
export const menuApi = {
  /**
   * 获取当前用户菜单和路由配置
   * @returns 菜单和路由数据
   */
  getUserMenus: () => request.get<MenuResponse>('/menu/list'),

  /**
   * 获取菜单列表（用于菜单管理）
   * @param params - 查询参数
   * @returns 菜单列表
   */
  getMenus: (params: GetMenusParams = {}) =>
    request.get<PaginationData<Menu>>('/menus', {
      params: {
        search: params.search,
      },
    }),

  /**
   * 根据 ID 获取菜单详情
   * @param id - 菜单 ID
   * @returns 菜单详情
   */
  getMenuById: (id: string) => request.get<Menu>(`/menus/${id}`),

  /**
   * 创建菜单
   * @param data - 菜单数据
   * @returns 创建的菜单
   */
  createMenu: (data: CreateMenuParams) => request.post<Menu>('/menus', data),

  /**
   * 更新菜单
   * @param id - 菜单 ID
   * @param data - 更新数据
   * @returns 更新后的菜单
   */
  updateMenu: (id: string, data: UpdateMenuParams) =>
    request.put<Menu>(`/menus/${id}`, data),

  /**
   * 删除菜单
   * @param id - 菜单 ID
   * @returns 删除结果
   */
  deleteMenu: (id: string) => request.delete<void>(`/menus/${id}`),

  /**
   * 更新菜单状态
   * @param id - 菜单 ID
   * @param status - 新状态
   * @returns 更新结果
   */
  updateMenuStatus: (id: string, status: 'active' | 'inactive') =>
    request.patch<Menu>(`/menus/${id}/status`, { status }),
};
