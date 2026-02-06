import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import { updateDocumentTitle } from '@/i18n';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, titleKey: 'login.title' }
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { titleKey: 'menu.dashboard' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { titleKey: 'menu.users' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { titleKey: 'menu.orders' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
        meta: { titleKey: 'menu.products' }
      },
      {
        path: 'products/categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
        meta: { titleKey: 'menu.categories' }
      },
      {
        path: 'products/inventory',
        name: 'Inventory',
        component: () => import('@/views/Inventory.vue'),
        meta: { titleKey: 'menu.inventory' }
      },
      {
        path: 'products/categories/tags',
        name: 'Tags',
        component: () => import('@/views/Tags.vue'),
        meta: { titleKey: 'menu.tags' }
      },
      {
        path: 'products/inventory/warehouse',
        name: 'Warehouse',
        component: () => import('@/views/Warehouse.vue'),
        meta: { titleKey: 'menu.warehouse' }
      },
      {
        path: 'products/inventory/stock',
        name: 'Stock',
        component: () => import('@/views/Stock.vue'),
        meta: { titleKey: 'menu.stock' }
      },
      {
        path: 'products/inventory/logistics',
        name: 'Logistics',
        component: () => import('@/views/Logistics.vue'),
        meta: { titleKey: 'menu.logistics' }
      },
      {
        path: 'products/categories/level1',
        name: 'Level1',
        component: () => import('@/views/Level1.vue'),
        meta: { titleKey: 'menu.categoryLevel1' }
      },
      {
        path: 'products/categories/level2',
        name: 'Level2',
        component: () => import('@/views/Level2.vue'),
        meta: { titleKey: 'menu.categoryLevel2' }
      },
      {
        path: 'products/inventory/warehouse/beijing',
        name: 'Beijing',
        component: () => import('@/views/Beijing.vue'),
        meta: { titleKey: 'menu.warehouseBeijing' }
      },
      {
        path: 'products/inventory/warehouse/shanghai',
        name: 'Shanghai',
        component: () => import('@/views/Shanghai.vue'),
        meta: { titleKey: 'menu.warehouseShanghai' }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/Analytics.vue'),
        meta: { titleKey: 'menu.analytics' }
      },
      {
        path: 'analytics/traffic',
        name: 'Traffic',
        component: () => import('@/views/Traffic.vue'),
        meta: { titleKey: 'menu.traffic' }
      },
      {
        path: 'analytics/sales',
        name: 'Sales',
        component: () => import('@/views/Sales.vue'),
        meta: { titleKey: 'menu.sales' }
      },
      {
        path: 'analytics/users',
        name: 'UsersAnalysis',
        component: () => import('@/views/UsersAnalysis.vue'),
        meta: { titleKey: 'menu.usersAnalysis' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: { titleKey: 'menu.settings' }
      },
      {
        path: 'tform-demo',
        name: 'TFormDemo',
        component: () => import('@/views/TFormDemo.vue'),
        meta: { titleKey: 'menu.tformDemo' }
      },
      {
        path: 'ttable-demo',
        name: 'TTableDemo',
        component: () => import('@/views/TTableDemo.vue'),
        meta: { titleKey: 'menu.ttableDemo' }
      },
      {
        path: 'tmodal-demo',
        name: 'TModalDemo',
        component: () => import('@/views/TModalDemo.vue'),
        meta: { titleKey: 'menu.tmodalDemo' }
      },
      {
        path: 'tdrawer-demo',
        name: 'TDrawerDemo',
        component: () => import('@/views/TDrawerDemo.vue'),
        meta: { titleKey: 'menu.tdrawerDemo' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { titleKey: 'pages.notFound.title' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');

  // 更新页面标题
  updateDocumentTitle(to);

  if (to.meta.requiresAuth !== false && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
