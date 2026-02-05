import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import { updateDocumentTitle } from '@/i18n';
import { useMenuStore } from '@/stores/menu';

/**
 * 基础路由配置
 * 包含登录页和 404 页面（固定路由）
 * 其他路由通过动态方式从后端获取
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, titleKey: 'pages.login.title' }
  },
  {
    path: '/',
    name: 'Root',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true, titleKey: 'menu.dashboard' }
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

/**
 * 全局前置守卫
 * 处理认证和动态菜单加载
 */
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  // 同时检查 token 和 user 是否存在，确保登录状态完整
  const isAuthenticated = !!(token && userStr);
  const menuStore = useMenuStore();

  // 更新页面标题
  updateDocumentTitle(to);

  // 如果已登录但菜单未加载，先加载菜单
  if (isAuthenticated && !menuStore.isLoaded && to.path !== '/login') {
    const success = await menuStore.fetchMenus();
    if (!success) {
      // 加载菜单失败，可能是 token 过期
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      next({ name: 'Login' });
      return;
    }

    // 关键修复：动态路由加载完成后，如果当前目标路由匹配到了404，
    // 说明动态路由刚刚被添加，需要重新导航以触发正确的路由匹配
    if (to.name === 'NotFound') {
      next({ path: to.fullPath, replace: true, query: to.query, hash: to.hash });
      return;
    }
  }

  // 认证检查
  if (to.meta.requiresAuth !== false && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Root' });
  } else {
    next();
  }
});

export default router;
