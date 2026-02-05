import type { Component } from 'vue';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  FileText,
  Tags,
  Warehouse,
  TrendingUp,
  DollarSign,
  UserCircle,
  FolderTree,
  Layers,
  Box,
  Truck,
  ClipboardList,
  MapPin,
  Building,
  FormInput,
  Table,
  MessageSquare,
  PanelRight,
} from 'lucide-vue-next';
import type { MenuItem as ApiMenuItem } from '@/types/menu';

/**
 * 图标映射表
 * 将图标名称映射到实际的图标组件
 */
export const iconMap: Record<string, Component> = {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  FileText,
  Tags,
  Warehouse,
  TrendingUp,
  DollarSign,
  UserCircle,
  FolderTree,
  Layers,
  Box,
  Truck,
  ClipboardList,
  MapPin,
  Building,
  FormInput,
  Table,
  MessageSquare,
  PanelRight,
};

/**
 * 获取图标组件
 * @param iconName - 图标名称
 * @returns 图标组件或 undefined
 */
export function getIcon(iconName?: string): Component | undefined {
  if (!iconName) return undefined;
  return iconMap[iconName];
}

/**
 * 将 API 菜单项转换为 Sidebar 菜单项
 * @param menu - API 菜单项
 * @returns Sidebar 菜单项
 */
export function convertMenuItem(menu: ApiMenuItem): MenuItem {
  return {
    key: menu.key,
    title: menu.title,
    path: menu.path,
    icon: getIcon(menu.icon),
    badge: menu.badge,
    group: menu.group,
    disabled: menu.disabled,
    defaultExpanded: menu.defaultExpanded,
    i18nKey: menu.i18nKey,
    children: menu.children?.map(child => convertMenuItem(child)),
  };
}

/**
 * 菜单项类型（用于 Sidebar 组件）
 */
export interface MenuItem {
  /** 唯一标识 */
  key: string;
  /** 菜单标题（显示用，实际使用 i18nKey 翻译） */
  title: string;
  /** 路由路径 */
  path: string;
  /** 图标组件 */
  icon?: Component;
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
}

/**
 * 侧栏配置
 */
export interface SidebarConfig {
  /** 菜单列表 */
  menus: MenuItem[];
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
 * 默认侧栏配置
 * 使用 i18nKey 而不是直接翻译，确保响应式更新
 */
export const defaultSidebarConfig: SidebarConfig = {
  collapsedWidth: 64,
  minWidth: 200,
  maxWidth: 400,
  defaultWidth: 260,
  menus: [],
};

/**
 * 菜单分组配置 - 使用 i18nKey
 */
export const menuGroups = [
  { key: 'main', titleKey: 'menu.groupMain' },
  { key: 'analytics', titleKey: 'menu.groupAnalytics' },
  { key: 'system', titleKey: 'menu.groupSystem' },
];
