import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { checkAuthentication } from './guards';
import { useMenuStore } from '@/stores/global/menu';
import { useAuthStore } from '@/stores/global/auth';
import { updateDocumentTitle } from '@/i18n';
import { requestCache } from '@/api/client';

/**
 * 基础路由配置
 * 包含登录页和 404 页面（固定路由）
 * 其他路由通过动态方式从后端获取
 * 所有页面组件使用懒加载，优化首屏性能
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/index.vue'),
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
        component: () => import('@/views/dashboard/index.vue'),
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
  // 使用 Hash 模式，支持 GitHub Pages 部署
  history: createWebHashHistory(),
  routes,
  // 滚动行为配置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果有保存的位置（浏览器前进/后退），恢复到之前的位置
      return savedPosition;
    } else if (to.hash) {
      // 如果有锚点，滚动到锚点位置
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else {
      // 默认滚动到顶部
      return { top: 0, left: 0 };
    }
  },
});

/**
 * 全局前置守卫
 * 按顺序执行：标题更新 -> 认证检查 -> 菜单加载 -> 权限检查
 */
router.beforeEach(async (to, from, next) => {
  // 1. 更新页面标题
  updateDocumentTitle(to);

  // 2. 认证检查 - 优先从 localStorage 读取，避免 Pinia 状态恢复时机问题
  const isAuthenticated = checkAuthentication();

  // 处理登录页访问
  if (to.name === 'Login') {
    if (isAuthenticated) {
      // 已登录用户访问登录页，重定向到首页
      next({ name: 'Root' });
      return;
    }
    next();
    return;
  }

  // 处理需要认证的页面
  const requiresAuth = to.meta.requiresAuth !== false;
  if (requiresAuth && !isAuthenticated) {
    // 未登录，重定向到登录页
    next({
      name: 'Login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined
    });
    return;
  }

  // 3. 处理动态路由（仅对已登录用户）
  // 如果当前路由匹配到了 404，且菜单还没加载，尝试加载菜单
  if (isAuthenticated && to.name === 'NotFound') {
    const menuStore = useMenuStore();

    if (!menuStore.isLoaded) {
      const success = await menuStore.fetchMenus();

      if (success) {
        // 动态路由已添加，重新导航到目标路径
        next({
          path: to.fullPath,
          replace: true,
          query: to.query,
          hash: to.hash
        });
        return;
      }
    }
  }

  // 4. 权限检查（如果路由需要特定权限）
  if (to.meta.permissions) {
    const authStore = useAuthStore();
    const requiredPermissions = to.meta.permissions as string[];
    const hasPermission = requiredPermissions.every(perm => authStore.hasPermission(perm));

    if (!hasPermission) {
      next({ name: 'NotFound' });
      return;
    }
  }

  // 正常放行
  next();
});

/**
 * 全局后置钩子
 * 清理工作、日志记录等
 */
router.afterEach((to, from) => {
  // 记录路由切换日志（仅在开发环境）
  if (import.meta.env.DEV) {
    console.log(`[Router] ${from.fullPath} -> ${to.fullPath}`);
  }

  // 清理过期的请求缓存
  if (requestCache && typeof requestCache.clear === 'function') {
    // 可以在这里添加特定缓存的清理逻辑
  }
});

/**
 * 全局错误处理
 */
router.onError((error) => {
  console.error('[Router Error]', error);

  // 动态导入失败时的处理
  if (error.message?.includes('Failed to fetch dynamically imported module')) {
    console.error('动态导入模块失败，可能是网络问题或代码分割错误');
  }
});

export default router;
