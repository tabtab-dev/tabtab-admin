/**
 * 菜单类型定义
 * @description 定义菜单相关的类型接口
 */
import type { Component } from 'vue';

/**
 * 基础菜单项类型
 * 用于 API 返回的数据结构
 */
export interface MenuItem {
  /** 唯一标识 */
  key: string;
  /** 菜单标题 */
  title: string;
  /** 路由路径 */
  path: string;
  /** 图标名称（对应 lucide-vue-next 的图标） */
  icon?: string;
  /** 徽标数量（可选） */
  badge?: number;
  /** 子菜单 */
  children?: MenuItem[];
  /** 菜单分组 */
  group?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否默认展开 */
  defaultExpanded?: boolean;
  /** i18n 翻译 key */
  i18nKey: string;
  /** 组件路径（用于动态路由） */
  component?: string;
  /** 是否在菜单中隐藏 */
  hidden?: boolean;
  /** 权限码列表（用于权限控制） */
  permissions?: string[];
  /** 角色列表（用于角色控制） */
  roles?: string[];
}

/**
 * 侧边栏菜单项类型
 * 用于 Sidebar 组件内部，包含图标名称
 */
export interface SidebarMenuItem {
  /** 唯一标识 */
  key: string;
  /** 菜单标题（显示用，实际使用 i18nKey 翻译） */
  title: string;
  /** 路由路径 */
  path: string;
  /** 图标名称（对应 lucide-vue-next 的图标名称） */
  icon?: string;
  /** 徽标数量（可选） */
  badge?: number;
  /** 子菜单 */
  children?: SidebarMenuItem[];
  /** 菜单分组 */
  group?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否默认展开 */
  defaultExpanded?: boolean;
  /** i18n 翻译 key */
  i18nKey: string;
  /** 是否在菜单中隐藏 */
  hidden?: boolean;
  /** 权限码列表（用于权限控制） */
  permissions?: string[];
  /** 角色列表（用于角色控制） */
  roles?: string[];
}

/**
 * 路由配置类型
 */
export interface RouteConfig {
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  name: string;
  /** 组件路径 */
  component: string;
  /** 元数据 */
  meta: {
    /** 页面标题 i18n key */
    titleKey: string;
    /** 是否需要认证 */
    requiresAuth?: boolean;
    /** 图标 */
    icon?: string;
    /** 权限码列表 */
    permissions?: string[];
    /** 角色列表 */
    roles?: string[];
  };
  /** 子路由 */
  children?: RouteConfig[];
}

/**
 * 菜单响应数据
 */
export interface MenuResponse {
  /** 菜单列表 */
  menus: MenuItem[];
  /** 路由配置列表 */
  routes: RouteConfig[];
}

/**
 * 侧栏配置
 */
export interface SidebarConfig {
  /** 菜单列表 */
  menus: SidebarMenuItem[];
  /** 折叠状态宽度（px） */
  collapsedWidth: number;
  /** 展开状态最小宽度（px） */
  minWidth: number;
  /** 展开状态最大宽度（px） */
  maxWidth: number;
  /** 默认展开宽度（px） */
  defaultWidth: number;
}

/**
 * 菜单分组配置
 */
export interface MenuGroup {
  /** 分组 key */
  key: string;
  /** 分组标题 i18n key */
  titleKey: string;
  /** 分组排序 */
  order?: number;
}
