/**
 * 菜单类型定义
 * @description 定义菜单和路由相关的类型接口，参考后端返回的数据格式
 */

/**
 * 路由元数据
 */
export interface RouteMeta {
  /** 页面标题 */
  title: string;
  /** 图标（lucide 图标名称） */
  icon?: string;
  /** 是否缓存页面 */
  keepAlive?: boolean;
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean;
  /** 菜单排序 */
  order?: number;
  /** 是否需要认证 */
  requiresAuth?: boolean;
  /** 权限码列表 */
  permissions?: string[];
  /** 角色列表 */
  roles?: string[];
  /** i18n 翻译 key */
  i18nKey?: string;
  /** 徽标数量（菜单上显示数字角标） */
  badge?: number;
}

/**
 * 后端返回的路由配置
 * 参考后端接口返回的数据格式
 */
export interface RouteConfig {
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  name: string;
  /**
   * 组件路径
   * - BasicLayout: 使用基础布局（用于有子路由的父级）
   * - /xxx/xxx: 相对于 views 目录的组件路径
   */
  component?: string;
  /** 路由元数据 */
  meta: RouteMeta;
  /** 重定向路径 */
  redirect?: string;
  /** 子路由 */
  children?: RouteConfig[];
}

/**
 * 后端返回的菜单项
 * 用于侧边栏菜单展示
 */
export interface MenuItem {
  /** 路由路径（与 RouteConfig.path 对应） */
  path: string;
  /** 菜单标题 */
  title: string;
  /** 图标（lucide 图标名称） */
  icon?: string;
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean;
  /** 菜单排序 */
  order?: number;
  /** 子菜单 */
  children?: MenuItem[];
  /** i18n 翻译 key */
  i18nKey?: string;
  /** 徽标数量 */
  badge?: number;
}

/**
 * 菜单和路由响应数据
 * @description 直接返回 RouteConfig 数组，前端自行提取菜单数据
 */
export type MenuResponse = RouteConfig[];

/**
 * 侧边栏菜单项
 * 用于 Sidebar 组件内部
 */
export interface SidebarMenuItem {
  /** 唯一标识 */
  key: string;
  /** 菜单标题 */
  title: string;
  /** 路由路径 */
  path: string;
  /** 图标名称 */
  icon?: string;
  /** 子菜单 */
  children?: SidebarMenuItem[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否默认展开 */
  defaultExpanded?: boolean;
  /** i18n 翻译 key */
  i18nKey?: string;
  /** 徽标数量 */
  badge?: number;
}

/**
 * 侧边栏配置
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
  /** 分组标题 */
  titleKey: string;
  /** 分组排序 */
  order?: number;
}
