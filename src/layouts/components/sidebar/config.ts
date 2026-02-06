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

/**
 * 菜单项类型
 */
export interface MenuItem {
  /** 唯一标识 */
  key: string;
  /** 菜单标题（显示用，实际使用 i18nKey 翻译） */
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
  menus: [
    {
      key: 'dashboard',
      title: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      group: 'main',
      i18nKey: 'menu.dashboard',
    },
    {
      key: 'users',
      title: 'Users',
      path: '/users',
      icon: Users,
      group: 'main',
      i18nKey: 'menu.users',
    },
    {
      key: 'orders',
      title: 'Orders',
      path: '/orders',
      icon: ShoppingCart,
      badge: 30,
      group: 'main',
      i18nKey: 'menu.orders',
    },
    {
      key: 'products',
      title: 'Products',
      path: '/products',
      icon: Package,
      group: 'main',
      defaultExpanded: true,
      i18nKey: 'menu.products',
      children: [
        {
          key: 'product-list',
          title: 'Product List',
          path: '/products',
          icon: FileText,
          i18nKey: 'menu.productList',
        },
        {
          key: 'product-categories',
          title: 'Categories',
          path: '/products/categories',
          icon: Tags,
          i18nKey: 'menu.categories',
          children: [
            {
              key: 'category-level1',
              title: 'Level 1',
              path: '/products/categories/level1',
              icon: FolderTree,
              i18nKey: 'menu.categoryLevel1',
            },
            {
              key: 'category-level2',
              title: 'Level 2',
              path: '/products/categories/level2',
              icon: Layers,
              i18nKey: 'menu.categoryLevel2',
            },
            {
              key: 'category-tags',
              title: 'Tags',
              path: '/products/categories/tags',
              icon: Box,
              i18nKey: 'menu.tags',
            },
          ],
        },
        {
          key: 'product-inventory',
          title: 'Inventory',
          path: '/products/inventory',
          icon: Warehouse,
          i18nKey: 'menu.inventory',
          children: [
            {
              key: 'inventory-stock',
              title: 'Stock',
              path: '/products/inventory/stock',
              icon: ClipboardList,
              i18nKey: 'menu.stock',
            },
            {
              key: 'inventory-warehouse',
              title: 'Warehouse',
              path: '/products/inventory/warehouse',
              icon: Building,
              i18nKey: 'menu.warehouse',
              children: [
                {
                  key: 'warehouse-beijing',
                  title: 'Beijing',
                  path: '/products/inventory/warehouse/beijing',
                  icon: MapPin,
                  i18nKey: 'menu.warehouseBeijing',
                },
                {
                  key: 'warehouse-shanghai',
                  title: 'Shanghai',
                  path: '/products/inventory/warehouse/shanghai',
                  icon: MapPin,
                  i18nKey: 'menu.warehouseShanghai',
                },
              ],
            },
            {
              key: 'inventory-logistics',
              title: 'Logistics',
              path: '/products/inventory/logistics',
              icon: Truck,
              i18nKey: 'menu.logistics',
            },
          ],
        },
      ],
    },
    {
      key: 'analytics',
      title: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      group: 'analytics',
      i18nKey: 'menu.analytics',
      children: [
        {
          key: 'analytics-traffic',
          title: 'Traffic',
          path: '/analytics/traffic',
          icon: TrendingUp,
          i18nKey: 'menu.traffic',
        },
        {
          key: 'analytics-sales',
          title: 'Sales',
          path: '/analytics/sales',
          icon: DollarSign,
          i18nKey: 'menu.sales',
        },
        {
          key: 'analytics-users',
          title: 'Users Analysis',
          path: '/analytics/users',
          icon: UserCircle,
          i18nKey: 'menu.usersAnalysis',
        },
      ],
    },
    {
      key: 'settings',
      title: 'Settings',
      path: '/settings',
      icon: Settings,
      group: 'system',
      i18nKey: 'menu.settings',
    },
    {
      key: 'tform-demo',
      title: 'TForm Demo',
      path: '/tform-demo',
      icon: FormInput,
      group: 'system',
      i18nKey: 'menu.tformDemo',
    },
    {
      key: 'ttable-demo',
      title: 'TTable Demo',
      path: '/ttable-demo',
      icon: Table,
      group: 'system',
      i18nKey: 'menu.ttableDemo',
    },
    {
      key: 'tmodal-demo',
      title: 'TModal Demo',
      path: '/tmodal-demo',
      icon: MessageSquare,
      group: 'system',
      i18nKey: 'menu.tmodalDemo',
    },
    {
      key: 'tdrawer-demo',
      title: 'TDrawer Demo',
      path: '/tdrawer-demo',
      icon: PanelRight,
      group: 'system',
      i18nKey: 'menu.tdrawerDemo',
    },
  ],
};

/**
 * 路由标题映射 - 使用 i18nKey 而不是直接翻译
 */
export const routeTitleMap: Record<string, string> = {
  '/': 'menu.dashboard',
  '/users': 'menu.users',
  '/orders': 'menu.orders',
  '/products': 'menu.products',
  '/products/categories': 'menu.categories',
  '/products/categories/level1': 'menu.categoryLevel1',
  '/products/categories/level2': 'menu.categoryLevel2',
  '/products/categories/tags': 'menu.tags',
  '/products/inventory': 'menu.inventory',
  '/products/inventory/stock': 'menu.stock',
  '/products/inventory/warehouse': 'menu.warehouse',
  '/products/inventory/warehouse/beijing': 'menu.warehouseBeijing',
  '/products/inventory/warehouse/shanghai': 'menu.warehouseShanghai',
  '/products/inventory/logistics': 'menu.logistics',
  '/analytics': 'menu.analytics',
  '/analytics/traffic': 'menu.traffic',
  '/analytics/sales': 'menu.sales',
  '/analytics/users': 'menu.usersAnalysis',
  '/settings': 'menu.settings',
  '/tform-demo': 'menu.tformDemo',
  '/ttable-demo': 'menu.ttableDemo',
  '/tmodal-demo': 'menu.tmodalDemo',
  '/tdrawer-demo': 'menu.tdrawerDemo',
};

/**
 * 获取路由标题的 i18n key
 * @param path 路由路径
 * @returns i18n key
 */
export function getRouteTitleKey(path: string): string {
  return routeTitleMap[path] || path;
}

/**
 * 导航项（用于 Header 显示）- 使用 i18nKey
 */
export const navigationItems = [
  { titleKey: 'menu.dashboard', path: '/' },
  { titleKey: 'menu.users', path: '/users' },
  { titleKey: 'menu.orders', path: '/orders' },
  { titleKey: 'menu.products', path: '/products' },
  { titleKey: 'menu.analytics', path: '/analytics' },
  { titleKey: 'menu.settings', path: '/settings' },
];

/**
 * 菜单分组配置 - 使用 i18nKey
 */
export const menuGroups = [
  { key: 'main', titleKey: 'menu.groupMain' },
  { key: 'analytics', titleKey: 'menu.groupAnalytics' },
  { key: 'system', titleKey: 'menu.groupSystem' },
];
