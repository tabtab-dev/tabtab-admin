/**
 * 菜单相关 API
 * @description 获取用户菜单、路由配置等接口
 */
import { request } from '../client';
import type { MenuResponse } from '@/types/menu';

/**
 * 菜单 API
 */
export const menuApi = {
  /**
   * 获取当前用户菜单和路由配置
   * @returns 菜单和路由数据
   */
  getMenus: () => request.get<MenuResponse>('/menu/list'),
};
