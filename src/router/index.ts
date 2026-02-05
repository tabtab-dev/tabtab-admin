import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
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
        meta: { title: '仪表板' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
        meta: { title: '商品管理' }
      },
      {
        path: 'products/categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'products/inventory',
        name: 'Inventory',
        component: () => import('@/views/Inventory.vue'),
        meta: { title: '库存管理' }
      },
      {
        path: 'products/categories/tags',
        name: 'Tags',
        component: () => import('@/views/Tags.vue'),
        meta: { title: '标签管理' }
      },
      {
        path: 'products/inventory/warehouse',
        name: 'Warehouse',
        component: () => import('@/views/Warehouse.vue'),
        meta: { title: '仓库管理' }
      },
      {
        path: 'products/inventory/stock',
        name: 'Stock',
        component: () => import('@/views/Stock.vue'),
        meta: { title: '库存盘点' }
      },
      {
        path: 'products/inventory/logistics',
        name: 'Logistics',
        component: () => import('@/views/Logistics.vue'),
        meta: { title: '物流管理' }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/Analytics.vue'),
        meta: { title: '数据分析' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: { title: '系统设置' }
      },
      {
        path: 'tform-demo',
        name: 'TFormDemo',
        component: () => import('@/views/TFormDemo.vue'),
        meta: { title: 'TForm 演示' }
      },
      {
        path: 'ttable-demo',
        name: 'TTableDemo',
        component: () => import('@/views/TTableDemo.vue'),
        meta: { title: 'TTable 演示' }
      },
      {
        path: 'tmodal-demo',
        name: 'TModalDemo',
        component: () => import('@/views/TModalDemo.vue'),
        meta: { title: 'TModal 演示' }
      },
      {
        path: 'tdrawer-demo',
        name: 'TDrawerDemo',
        component: () => import('@/views/TDrawerDemo.vue'),
        meta: { title: 'TDrawer 演示' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (to.meta.requiresAuth !== false && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
