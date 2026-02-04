import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';

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
        path: 'demo',
        name: 'Demo',
        meta: { title: '功能演示' },
        children: [
          {
            path: 'smart-form',
            name: 'SmartFormDemo',
            component: () => import('@/views/demo/SmartFormDemo.vue'),
            meta: { title: 'SmartForm 表单' }
          },
          {
            path: 'smart-table',
            name: 'SmartTableDemo',
            redirect: '/demo/smart-table/basic',
            meta: { title: 'SmartTable 表格' },
            children: [
              {
                path: 'basic',
                name: 'SmartTableBasic',
                component: () => import('@/components/smart-table/examples/BasicExample.vue'),
                meta: { title: '基础示例' }
              },
              {
                path: 'actions',
                name: 'SmartTableActions',
                component: () => import('@/components/smart-table/examples/ActionsExample.vue'),
                meta: { title: '操作菜单' }
              },
              {
                path: 'async',
                name: 'SmartTableAsync',
                component: () => import('@/components/smart-table/examples/AsyncExample.vue'),
                meta: { title: '异步加载' }
              },
              {
                path: 'custom',
                name: 'SmartTableCustom',
                component: () => import('@/components/smart-table/examples/CustomRenderExample.vue'),
                meta: { title: '自定义渲染' }
              },
              {
                path: 'slot',
                name: 'SmartTableSlot',
                component: () => import('@/components/smart-table/examples/SlotRenderExample.vue'),
                meta: { title: '插槽渲染' }
              }
            ]
          }
        ]
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

/**
 * 更新浏览器页面标题
 * @param to - 目标路由对象
 */
function updatePageTitle(to: RouteLocationNormalized): void {
  const title = to.meta?.title as string | undefined;
  const defaultTitle = 'TABTAB';
  document.title = title ? `${title} - ${defaultTitle}` : defaultTitle;
}

router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('token');

  // 更新页面标题
  updatePageTitle(to);

  if (to.meta.requiresAuth !== false && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
