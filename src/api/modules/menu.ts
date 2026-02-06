/**
 * 菜单相关 API
 * @description 获取用户菜单、路由配置等接口
 */
import { request } from '../request';
import { requestMock } from '../request.mock';
import type { MenuResponse } from '@/types/menu';

/**
 * 菜单 API（正式接口）
 */
export const menuApi = {
  /**
   * 获取当前用户菜单和路由配置
   * @returns 菜单和路由数据
   */
  getMenus: () => request.get<MenuResponse>('/menu/list'),
};

/**
 * 菜单 API（Mock 接口）
 */
export const menuApiMock = {
  /**
   * 获取当前用户菜单和路由配置
   * @returns 菜单和路由数据
   */
  getMenus: () => requestMock.get<MenuResponse>('/menu/list'),
};
