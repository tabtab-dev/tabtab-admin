/**
 * TabBar 类型定义
 * @description 定义标签栏相关的类型接口
 */
import type { Component } from 'vue';

/**
 * 标签页项
 */
export interface TabItem {
  /** 路由路径 */
  path: string;
  /** 标题（国际化 key） */
  title: string;
  /** 图标名称（对应 lucide-vue-next 的图标） */
  icon?: string;
  /** 是否固定（不可关闭） */
  affix?: boolean;
  /** 是否加载中 */
  isLoading?: boolean;
  /** 是否刷新中 */
  isRefreshing?: boolean;
}

/**
 * 标签栏右键菜单项
 */
export interface TabContextMenuItem {
  /** 菜单项 key */
  key: string;
  /** 菜单项标签 */
  label: string;
  /** 图标名称 */
  icon?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示分隔线 */
  divider?: boolean;
}

/**
 * 标签栏配置
 */
export interface TabBarConfig {
  /** 是否显示标签栏 */
  showTabBar: boolean;
  /** 是否启用右键菜单 */
  enableContextMenu: boolean;
  /** 是否启用拖拽排序 */
  enableDragSort: boolean;
  /** 最大标签数量 */
  maxTabs: number;
  /** 是否持久化到 localStorage */
  persist: boolean;
}
