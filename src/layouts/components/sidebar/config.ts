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
} from 'lucide-vue-next';

/**
 * 菜单项类型
 */
export interface MenuItem {
  /** 唯一标识 */
  key: string;
  /** 菜单标题 */
  title: string;
  /** 路由路径 */
  path: string;
  /** 图标组件 */
  icon: Component;
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
 */
export const defaultSidebarConfig: SidebarConfig = {
  collapsedWidth: 64,
  minWidth: 200,
  maxWidth: 400,
  defaultWidth: 260,
  menus: [
    {
      key: 'dashboard',
      title: '仪表板',
      path: '/',
      icon: LayoutDashboard,
      group: 'main',
    },
    {
      key: 'users',
      title: '用户管理',
      path: '/users',
      icon: Users,
      group: 'main',
    },
    {
      key: 'orders',
      title: '订单管理',
      path: '/orders',
      icon: ShoppingCart,
      badge: 30,
      group: 'main',
    },
    {
      key: 'products',
      title: '商品管理',
      path: '/products',
      icon: Package,
      group: 'main',
      defaultExpanded: true,
      children: [
        {
          key: 'product-list',
          title: '商品列表',
          path: '/products',
          icon: FileText,
        },
        {
          key: 'product-categories',
          title: '分类管理',
          path: '/products/categories',
          icon: Tags,
          children: [
            {
              key: 'category-level1',
              title: '一级分类',
              path: '/products/categories/level1',
              icon: FolderTree,
            },
            {
              key: 'category-level2',
              title: '二级分类',
              path: '/products/categories/level2',
              icon: Layers,
            },
            {
              key: 'category-tags',
              title: '标签管理',
              path: '/products/categories/tags',
              icon: Box,
            },
          ],
        },
        {
          key: 'product-inventory',
          title: '库存管理',
          path: '/products/inventory',
          icon: Warehouse,
          children: [
            {
              key: 'inventory-stock',
              title: '库存盘点',
              path: '/products/inventory/stock',
              icon: ClipboardList,
            },
            {
              key: 'inventory-warehouse',
              title: '仓库管理',
              path: '/products/inventory/warehouse',
              icon: Building,
              children: [
                {
                  key: 'warehouse-beijing',
                  title: '北京仓库',
                  path: '/products/inventory/warehouse/beijing',
                  icon: MapPin,
                },
                {
                  key: 'warehouse-shanghai',
                  title: '上海仓库',
                  path: '/products/inventory/warehouse/shanghai',
                  icon: MapPin,
                },
              ],
            },
            {
              key: 'inventory-logistics',
              title: '物流管理',
              path: '/products/inventory/logistics',
              icon: Truck,
            },
          ],
        },
      ],
    },
    {
      key: 'analytics',
      title: '数据分析',
      path: '/analytics',
      icon: BarChart3,
      group: 'analytics',
      children: [
        {
          key: 'analytics-traffic',
          title: '流量分析',
          path: '/analytics/traffic',
          icon: TrendingUp,
        },
        {
          key: 'analytics-sales',
          title: '销售分析',
          path: '/analytics/sales',
          icon: DollarSign,
        },
        {
          key: 'analytics-users',
          title: '用户分析',
          path: '/analytics/users',
          icon: UserCircle,
        },
      ],
    },
    {
      key: 'settings',
      title: '系统设置',
      path: '/settings',
      icon: Settings,
      group: 'system',
    },
    {
      key: 'tform-demo',
      title: 'TForm 演示',
      path: '/tform-demo',
      icon: FormInput,
      group: 'system',
    },
    {
      key: 'ttable-demo',
      title: 'TTable 演示',
      path: '/ttable-demo',
      icon: Table,
      group: 'system',
    },
  ],
};

/**
 * 路由标题映射
 * 用于面包屑和页面标题显示
 */
export const routeTitleMap: Record<string, string> = {
  '/': '仪表板',
  '/users': '用户管理',
  '/orders': '订单管理',
  '/products': '商品管理',
  '/products/categories': '分类管理',
  '/products/categories/level1': '一级分类',
  '/products/categories/level2': '二级分类',
  '/products/categories/tags': '标签管理',
  '/products/inventory': '库存管理',
  '/products/inventory/stock': '库存盘点',
  '/products/inventory/warehouse': '仓库管理',
  '/products/inventory/warehouse/beijing': '北京仓库',
  '/products/inventory/warehouse/shanghai': '上海仓库',
  '/products/inventory/logistics': '物流管理',
  '/analytics': '数据分析',
  '/analytics/traffic': '流量分析',
  '/analytics/sales': '销售分析',
  '/analytics/users': '用户分析',
  '/settings': '系统设置',
  '/tform-demo': 'TForm 演示',
  '/ttable-demo': 'TTable 演示',
};

/**
 * 获取路由标题
 * @param path 路由路径
 * @returns 标题
 */
export function getRouteTitle(path: string): string {
  return routeTitleMap[path] || path;
}

/**
 * 导航项（用于 Header 显示）
 */
export const navigationItems = [
  { title: '仪表板', path: '/' },
  { title: '用户管理', path: '/users' },
  { title: '订单管理', path: '/orders' },
  { title: '商品管理', path: '/products' },
  { title: '数据分析', path: '/analytics' },
  { title: '系统设置', path: '/settings' },
];

/**
 * 菜单分组配置
 */
export const menuGroups = [
  { key: 'main', title: '主要菜单' },
  { key: 'analytics', title: '数据分析' },
  { key: 'system', title: '系统' },
];
