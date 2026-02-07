import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import { updateDocumentTitle } from '@/i18n';
import { useMenuStore } from '@/stores/global/menu';
import { useAuthStore } from '@/stores/global/auth';
import { requestCache } from '@/api/client';

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
 * 检查用户是否已认证
 * 优先从 Pinia store 获取，避免直接操作 localStorage
 */
function checkAuthentication(): boolean {
  try {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
  } catch {
    // Store 未初始化时的降级处理
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
}

/**
 * 处理动态菜单加载
 * 已登录且菜单未加载时调用
 */
async function handleDynamicMenus(to: RouteLocationNormalized): Promise<boolean> {
  const menuStore = useMenuStore();
  
  if (menuStore.isLoaded) {
    return true;
  }

  const success = await menuStore.fetchMenus();
  
  if (!success) {
    // 加载菜单失败，可能是 token 过期
    return false;
  }

  // 动态路由加载完成后，如果当前目标路由匹配到了404，
  // 说明动态路由刚刚被添加，需要重新导航以触发正确的路由匹配
  if (to.name === 'NotFound') {
    return false; // 返回 false 表示需要重新导航
  }

  return true;
}

/**
 * 全局前置守卫
 * 处理认证和动态菜单加载
 */
router.beforeEach(async (to, from, next) => {
  // 更新页面标题
  updateDocumentTitle(to);

  const isAuthenticated = checkAuthentication();
  const requiresAuth = to.meta.requiresAuth !== false;

  // 1. 处理登录页访问
  if (to.name === 'Login') {
    if (isAuthenticated) {
      // 已登录用户访问登录页，重定向到首页
      next({ name: 'Root' });
    } else {
      next();
    }
    return;
  }

  // 2. 处理需要认证的页面
  if (requiresAuth) {
    if (!isAuthenticated) {
      // 未登录，重定向到登录页
      next({ 
        name: 'Login',
        query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined
      });
      return;
    }

    // 已登录，检查是否需要加载菜单
    if (to.path !== '/login') {
      const menuLoaded = await handleDynamicMenus(to);
      
      if (!menuLoaded) {
        // Token 过期或菜单加载失败
        const authStore = useAuthStore();
        await authStore.logout();
        
        next({ 
          name: 'Login',
          query: { redirect: to.fullPath }
        });
        return;
      }

      // 动态路由刚添加，需要重新导航
      if (to.name === 'NotFound') {
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

  // 3. 正常放行
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
  // 在路由切换时清理缓存，避免内存泄漏
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
