/**
 * 菜单 Mock 数据
 * @description 提供菜单和路由配置的模拟数据，参考后端返回格式
 */

import type { MenuItem, RouteConfig } from '@/types/menu';

/**
 * 路由配置数据
 * 参考后端接口返回的路由格式
 */
export const routeData: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: '/Dashboard',
    meta: {
      title: '仪表盘',
      icon: 'LayoutDashboard',
      keepAlive: true,
      hideInMenu: false,
      order: 1,
      i18nKey: 'menu.dashboard',
    },
  },
  {
    path: '/system',
    name: 'system',
    component: 'BasicLayout',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Settings',
      keepAlive: false,
      hideInMenu: false,
      order: 10,
      i18nKey: 'menu.system',
      group: 'system',
    },
    children: [
      {
        path: '/system/user',
        name: 'system:user',
        component: '/system/user/index',
        meta: {
          title: '用户管理',
          icon: 'User',
          keepAlive: false,
          hideInMenu: false,
          order: 10,
          i18nKey: 'menu.systemUser',
          group: 'system',
        },
      },
      {
        path: '/system/role',
        name: 'system:role',
        component: '/system/role/index',
        meta: {
          title: '角色管理',
          icon: 'Shield',
          keepAlive: false,
          hideInMenu: false,
          order: 20,
          i18nKey: 'menu.systemRole',
          group: 'system',
        },
      },
      {
        path: '/system/menu',
        name: 'system:menu',
        component: '/system/menu/index',
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          keepAlive: false,
          hideInMenu: false,
          order: 30,
          i18nKey: 'menu.systemMenu',
          group: 'system',
        },
      },
      {
        path: '/system/organization',
        name: 'system:organization',
        component: '/system/organization/index',
        meta: {
          title: '组织架构',
          icon: 'Building2',
          keepAlive: false,
          hideInMenu: false,
          order: 40,
          i18nKey: 'menu.systemOrganization',
          group: 'system',
        },
      },
    ],
  },
  {
    path: '/products',
    name: 'products',
    component: 'BasicLayout',
    redirect: '/products/list',
    meta: {
      title: '商品管理',
      icon: 'Package',
      keepAlive: false,
      hideInMenu: false,
      order: 20,
      i18nKey: 'menu.products',
    },
    children: [
      {
        path: '/products/list',
        name: 'products:list',
        component: '/Products',
        meta: {
          title: '商品列表',
          icon: 'FileText',
          keepAlive: false,
          hideInMenu: false,
          order: 10,
          i18nKey: 'menu.productList',
        },
      },
      {
        path: '/products/categories',
        name: 'products:categories',
        component: '/Categories',
        meta: {
          title: '分类管理',
          icon: 'Tags',
          keepAlive: false,
          hideInMenu: false,
          order: 20,
          i18nKey: 'menu.categories',
        },
      },
      {
        path: '/products/inventory',
        name: 'products:inventory',
        component: '/Inventory',
        meta: {
          title: '库存管理',
          icon: 'Warehouse',
          keepAlive: false,
          hideInMenu: false,
          order: 30,
          i18nKey: 'menu.inventory',
        },
      },
      {
        path: '/products/warehouse',
        name: 'products:warehouse',
        component: '/Warehouse',
        meta: {
          title: '仓库管理',
          icon: 'Building2',
          keepAlive: false,
          hideInMenu: false,
          order: 40,
          i18nKey: 'menu.warehouse',
        },
      },
      {
        path: '/products/stock',
        name: 'products:stock',
        component: '/Stock',
        meta: {
          title: '库存盘点',
          icon: 'ClipboardList',
          keepAlive: false,
          hideInMenu: false,
          order: 50,
          i18nKey: 'menu.stock',
        },
      },
      {
        path: '/products/tags',
        name: 'products:tags',
        component: '/Tags',
        meta: {
          title: '标签管理',
          icon: 'Tag',
          keepAlive: false,
          hideInMenu: false,
          order: 60,
          i18nKey: 'menu.tags',
        },
      },
    ],
  },
  {
    path: '/orders',
    name: 'orders',
    component: 'BasicLayout',
    redirect: '/orders/list',
    meta: {
      title: '订单管理',
      icon: 'ShoppingCart',
      keepAlive: false,
      hideInMenu: false,
      order: 30,
      i18nKey: 'menu.orders',
      badge: 5,
    },
    children: [
      {
        path: '/orders/list',
        name: 'orders:list',
        component: '/Orders',
        meta: {
          title: '订单列表',
          icon: 'FileText',
          keepAlive: false,
          hideInMenu: false,
          order: 10,
          i18nKey: 'menu.orderList',
        },
      },
      {
        path: '/orders/logistics',
        name: 'orders:logistics',
        component: '/Logistics',
        meta: {
          title: '物流管理',
          icon: 'Truck',
          keepAlive: false,
          hideInMenu: false,
          order: 20,
          i18nKey: 'menu.logistics',
        },
      },
    ],
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: 'BasicLayout',
    redirect: '/analytics/overview',
    meta: {
      title: '数据分析',
      icon: 'ChartBar',
      keepAlive: false,
      hideInMenu: false,
      order: 40,
      i18nKey: 'menu.analytics',
    },
    children: [
      {
        path: '/analytics/overview',
        name: 'analytics:overview',
        component: '/Analytics',
        meta: {
          title: '数据概览',
          icon: 'BarChart3',
          keepAlive: false,
          hideInMenu: false,
          order: 5,
          i18nKey: 'menu.analyticsOverview',
        },
      },
      {
        path: '/analytics/traffic',
        name: 'analytics:traffic',
        component: '/Traffic',
        meta: {
          title: '流量分析',
          icon: 'TrendingUp',
          keepAlive: false,
          hideInMenu: false,
          order: 10,
          i18nKey: 'menu.traffic',
        },
      },
      {
        path: '/analytics/sales',
        name: 'analytics:sales',
        component: '/Sales',
        meta: {
          title: '销售分析',
          icon: 'DollarSign',
          keepAlive: false,
          hideInMenu: false,
          order: 20,
          i18nKey: 'menu.sales',
        },
      },
      {
        path: '/analytics/users',
        name: 'analytics:users',
        component: '/UsersAnalysis',
        meta: {
          title: '用户分析',
          icon: 'UserRound',
          keepAlive: false,
          hideInMenu: false,
          order: 30,
          i18nKey: 'menu.usersAnalysis',
        },
      },
    ],
  },
  {
    path: '/demos',
    name: 'demos',
    component: 'BasicLayout',
    redirect: '/demos/tform',
    meta: {
      title: '组件示例',
      icon: 'LayoutTemplate',
      keepAlive: false,
      hideInMenu: false,
      order: 50,
      i18nKey: 'menu.demos',
      group: 'demos',
    },
    children: [
      {
        path: '/demos/tform',
        name: 'demos:tform',
        component: '/demos/TFormDemo',
        meta: {
          title: '表单组件',
          icon: 'FormInput',
          keepAlive: false,
          hideInMenu: false,
          order: 10,
          i18nKey: 'menu.tformDemo',
          group: 'demos',
        },
      },
      {
        path: '/demos/ttable',
        name: 'demos:ttable',
        component: '/demos/TTableDemo',
        meta: {
          title: '表格组件',
          icon: 'Table',
          keepAlive: false,
          hideInMenu: false,
          order: 20,
          i18nKey: 'menu.ttableDemo',
          group: 'demos',
        },
      },
      {
        path: '/demos/tmodal',
        name: 'demos:tmodal',
        component: '/demos/TModalDemo',
        meta: {
          title: '弹窗组件',
          icon: 'MessageSquare',
          keepAlive: false,
          hideInMenu: false,
          order: 30,
          i18nKey: 'menu.tmodalDemo',
          group: 'demos',
        },
      },
      {
        path: '/demos/tdrawer',
        name: 'demos:tdrawer',
        component: '/demos/TDrawerDemo',
        meta: {
          title: '抽屉组件',
          icon: 'PanelRight',
          keepAlive: false,
          hideInMenu: false,
          order: 40,
          i18nKey: 'menu.tdrawerDemo',
          group: 'demos',
        },
      },
      {
        path: '/demos/ticon',
        name: 'demos:ticon',
        component: '/demos/TIconDemo',
        meta: {
          title: '图标组件',
          icon: 'Image',
          keepAlive: false,
          hideInMenu: false,
          order: 45,
          i18nKey: 'menu.ticonDemo',
          group: 'demos',
        },
      },
      {
        path: '/demos/permission',
        name: 'demos:permission',
        component: '/demos/PermissionDemo',
        meta: {
          title: '权限示例',
          icon: 'ShieldCheck',
          keepAlive: false,
          hideInMenu: false,
          order: 50,
          i18nKey: 'menu.permissionDemo',
          group: 'demos',
        },
      },
      {
        path: '/demos/nested',
        name: 'demos:nested',
        component: 'BasicLayout',
        redirect: '/demos/nested/level1',
        meta: {
          title: '嵌套菜单',
          icon: 'Layers',
          keepAlive: false,
          hideInMenu: false,
          order: 60,
          i18nKey: 'menu.nested',
          group: 'demos',
        },
        children: [
          {
            path: '/demos/nested/level1',
            name: 'demos:nested:level1',
            component: '/Level1',
            meta: {
              title: 'Level 1',
              icon: 'Circle',
              keepAlive: false,
              hideInMenu: false,
              order: 10,
              i18nKey: 'menu.level1',
              group: 'demos',
            },
          },
          {
            path: '/demos/nested/level2',
            name: 'demos:nested:level2',
            component: '/Level2',
            meta: {
              title: 'Level 2',
              icon: 'Circle',
              keepAlive: false,
              hideInMenu: false,
              order: 20,
              i18nKey: 'menu.level2',
              group: 'demos',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/settings',
    name: 'settings',
    component: '/Settings',
    meta: {
      title: '系统设置',
      icon: 'Settings2',
      keepAlive: false,
      hideInMenu: false,
      order: 60,
      i18nKey: 'menu.settings',
    },
  },
];

/**
 * 从路由配置生成菜单数据
 * 提取需要展示在侧边栏的菜单项
 */
function generateMenusFromRoutes(routes: RouteConfig[]): MenuItem[] {
  return routes
    .filter((route) => !route.meta.hideInMenu)
    .map((route) => {
      const menu: MenuItem = {
        path: route.path,
        title: route.meta.title,
        icon: route.meta.icon,
        hideInMenu: route.meta.hideInMenu,
        order: route.meta.order,
        i18nKey: route.meta.i18nKey,
        group: route.meta.group,
      };

      if (route.children && route.children.length > 0) {
        menu.children = generateMenusFromRoutes(route.children);
      }

      return menu;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * 菜单数据
 * 从路由配置自动生成
 */
export const menuData: MenuItem[] = generateMenusFromRoutes(routeData);
