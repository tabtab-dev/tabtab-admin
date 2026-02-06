/**
 * 菜单 Mock 数据
 * @description 提供菜单和路由配置的模拟数据
 */

import type { MenuItem, RouteConfig } from '@/types/menu';

/**
 * 菜单数据
 */
export const menuData: MenuItem[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    group: 'main',
    i18nKey: 'menu.dashboard',
  },
  {
    key: 'users',
    title: 'Users',
    path: '/users',
    icon: 'Users',
    group: 'main',
    i18nKey: 'menu.users',
  },
  {
    key: 'orders',
    title: 'Orders',
    path: '/orders',
    icon: 'ShoppingCart',
    badge: 30,
    group: 'main',
    i18nKey: 'menu.orders',
  },
  {
    key: 'products',
    title: 'Products',
    path: '/products',
    icon: 'Package',
    group: 'main',
    defaultExpanded: true,
    i18nKey: 'menu.products',
    children: [
      {
        key: 'product-list',
        title: 'Product List',
        path: '/products',
        icon: 'FileText',
        i18nKey: 'menu.productList',
      },
      {
        key: 'product-categories',
        title: 'Categories',
        path: '/products/categories',
        icon: 'Tags',
        i18nKey: 'menu.categories',
        children: [
          {
            key: 'category-level1',
            title: 'Level 1',
            path: '/products/categories/level1',
            icon: 'FolderTree',
            i18nKey: 'menu.categoryLevel1',
          },
          {
            key: 'category-level2',
            title: 'Level 2',
            path: '/products/categories/level2',
            icon: 'Layers',
            i18nKey: 'menu.categoryLevel2',
          },
          {
            key: 'category-tags',
            title: 'Tags',
            path: '/products/categories/tags',
            icon: 'Box',
            i18nKey: 'menu.tags',
          },
        ],
      },
      {
        key: 'product-inventory',
        title: 'Inventory',
        path: '/products/inventory',
        icon: 'Warehouse',
        i18nKey: 'menu.inventory',
        children: [
          {
            key: 'inventory-stock',
            title: 'Stock',
            path: '/products/inventory/stock',
            icon: 'ClipboardList',
            i18nKey: 'menu.stock',
          },
          {
            key: 'inventory-warehouse',
            title: 'Warehouse',
            path: '/products/inventory/warehouse',
            icon: 'Building',
            i18nKey: 'menu.warehouse',
            children: [
              {
                key: 'warehouse-beijing',
                title: 'Beijing',
                path: '/products/inventory/warehouse/beijing',
                icon: 'MapPin',
                i18nKey: 'menu.warehouseBeijing',
              },
              {
                key: 'warehouse-shanghai',
                title: 'Shanghai',
                path: '/products/inventory/warehouse/shanghai',
                icon: 'MapPin',
                i18nKey: 'menu.warehouseShanghai',
              },
            ],
          },
          {
            key: 'inventory-logistics',
            title: 'Logistics',
            path: '/products/inventory/logistics',
            icon: 'Truck',
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
    icon: 'BarChart3',
    group: 'analytics',
    i18nKey: 'menu.analytics',
    children: [
      {
        key: 'analytics-traffic',
        title: 'Traffic',
        path: '/analytics/traffic',
        icon: 'TrendingUp',
        i18nKey: 'menu.traffic',
      },
      {
        key: 'analytics-sales',
        title: 'Sales',
        path: '/analytics/sales',
        icon: 'DollarSign',
        i18nKey: 'menu.sales',
      },
      {
        key: 'analytics-users',
        title: 'Users Analysis',
        path: '/analytics/users',
        icon: 'UserCircle',
        i18nKey: 'menu.usersAnalysis',
      },
    ],
  },
  {
    key: 'settings',
    title: 'Settings',
    path: '/settings',
    icon: 'Settings',
    group: 'system',
    i18nKey: 'menu.settings',
  },
  {
    key: 'tform-demo',
    title: 'TForm Demo',
    path: '/tform-demo',
    icon: 'FormInput',
    group: 'system',
    i18nKey: 'menu.tformDemo',
  },
  {
    key: 'ttable-demo',
    title: 'TTable Demo',
    path: '/ttable-demo',
    icon: 'Table',
    group: 'system',
    i18nKey: 'menu.ttableDemo',
  },
  {
    key: 'tmodal-demo',
    title: 'TModal Demo',
    path: '/tmodal-demo',
    icon: 'MessageSquare',
    group: 'system',
    i18nKey: 'menu.tmodalDemo',
  },
  {
    key: 'tdrawer-demo',
    title: 'TDrawer Demo',
    path: '/tdrawer-demo',
    icon: 'PanelRight',
    group: 'system',
    i18nKey: 'menu.tdrawerDemo',
  },
];

/**
 * 将菜单路径转换为 component 格式
 * @param path - 菜单路径（如 /products/categories）
 * @returns component 格式（如 /categories）
 */
function pathToComponent(path: string): string {
  // 根路径特殊处理
  if (path === '/') {
    return '/dashboard';
  }

  // 获取最后一段路径
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  // 转换为 kebab-case
  return '/' + lastSegment.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 生成路由名称
 * @param path - 菜单路径
 * @param key - 菜单key（用于确保唯一性）
 * @returns 路由名称
 */
function generateRouteName(path: string, key?: string): string {
  // 移除开头的斜杠，将路径转换为驼峰命名
  const normalized = path.replace(/^\//, '').replace(/-/g, '/');
  const segments = normalized.split('/').filter(Boolean);

  // 将每个 segment 首字母大写
  const pascalCase = segments
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())
    .join('');

  // 如果路径生成名称为空，使用 key
  const baseName = pascalCase || 'Dashboard';

  // 如果有 key 且与 baseName 不同，追加 key 以确保唯一性
  if (key && key !== baseName.toLowerCase().replace(/-/g, '')) {
    const keySuffix = key
      .split('-')
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())
      .join('');
    return baseName + keySuffix;
  }

  return baseName;
}

/**
 * 将菜单项转换为路由配置
 * @param menu - 菜单项
 * @param parentPath - 父路径（用于计算相对路径）
 * @returns 路由配置
 */
function menuToRouteConfig(menu: MenuItem, parentPath: string = ''): RouteConfig {
  // 计算相对路径：如果是子菜单，移除父路径前缀
  let relativePath = menu.path;
  if (parentPath) {
    if (menu.path === parentPath) {
      // 子路由和父路由路径相同，使用空字符串（默认子路由）
      relativePath = '';
    } else if (menu.path.startsWith(parentPath + '/')) {
      relativePath = menu.path.slice(parentPath.length + 1); // 移除父路径和斜杠
    }
  }

  return {
    path: relativePath,
    name: generateRouteName(menu.path, menu.key),
    component: pathToComponent(menu.path),
    meta: {
      title: menu.title,
      icon: menu.icon,
      i18nKey: menu.i18nKey,
      requiresAuth: true,
    },
    children: menu.children?.map(child => menuToRouteConfig(child, menu.path)),
  };
}

/**
 * 路由配置数据
 */
export const routeData: RouteConfig[] = menuData.map(menuToRouteConfig);