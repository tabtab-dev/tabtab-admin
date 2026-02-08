/**
 * 权限守卫
 * @description 处理路由级别的权限控制
 */
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/global/auth';
import { toast } from 'vue-sonner';

/**
 * 权限检查模式
 * - all: 需要拥有所有权限
 * - any: 拥有任一权限即可
 */
export type PermissionMode = 'all' | 'any';

/**
 * 路由权限配置
 */
export interface RoutePermission {
  /** 权限列表 */
  permissions: string[];
  /** 检查模式 */
  mode?: PermissionMode;
  /** 无权限时的跳转路由，默认 404 */
  redirect?: string;
  /** 是否显示无权限提示 */
  showToast?: boolean;
}

/**
 * 检查用户是否有权限
 * @param permissions - 权限列表
 * @param mode - 检查模式
 * @returns 是否通过权限检查
 */
export function checkPermission(
  permissions: string[],
  mode: PermissionMode = 'all'
): boolean {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return false;
  }

  if (mode === 'all') {
    return permissions.every(perm => authStore.hasPermission(perm));
  } else {
    return permissions.some(perm => authStore.hasPermission(perm));
  }
}

/**
 * 检查用户角色
 * @param roles - 角色列表
 * @param mode - 检查模式
 * @returns 是否通过角色检查
 */
export function checkRole(
  roles: string[],
  mode: PermissionMode = 'any'
): boolean {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated || !authStore.user) {
    return false;
  }

  const userRole = authStore.user.role;

  if (mode === 'all') {
    return roles.every(role => userRole === role);
  } else {
    return roles.some(role => userRole === role);
  }
}

/**
 * 权限守卫
 * 检查路由元信息中的权限配置
 */
export function permissionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  // 检查权限配置
  const permissionConfig = to.meta.permission as RoutePermission | undefined;

  if (permissionConfig?.permissions?.length) {
    const { permissions, mode = 'all', redirect = 'NotFound', showToast = true } = permissionConfig;

    const hasPermission = checkPermission(permissions, mode);

    if (!hasPermission) {
      if (showToast) {
        toast.error('您没有权限访问此页面');
      }
      next({ name: redirect });
      return;
    }
  }

  // 检查角色配置（简化版）
  const roles = to.meta.roles as string[] | undefined;
  if (roles?.length) {
    const hasRole = checkRole(roles, 'any');

    if (!hasRole) {
      toast.error('您没有权限访问此页面');
      next({ name: 'NotFound' });
      return;
    }
  }

  next();
}

/**
 * 创建权限守卫（用于动态权限检查）
 * @param permissionConfig - 权限配置
 * @returns 守卫函数
 */
export function createPermissionGuard(permissionConfig: RoutePermission) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const { permissions, mode = 'all', redirect = 'NotFound', showToast = true } = permissionConfig;

    const hasPermission = checkPermission(permissions, mode);

    if (!hasPermission) {
      if (showToast) {
        toast.error('您没有权限访问此页面');
      }
      next({ name: redirect });
      return;
    }

    next();
  };
}

/**
 * 使用示例：
 *
 * // 在路由配置中使用
 * {
 *   path: '/admin/users',
 *   component: () => import('@/views/admin/Users.vue'),
 *   meta: {
 *     permission: {
 *       permissions: ['user:read'],
 *       mode: 'all',
 *       redirect: 'NotFound'
 *     }
 *   }
 * }
 *
 * // 或简化版角色检查
 * {
 *   path: '/admin/settings',
 *   component: () => import('@/views/admin/Settings.vue'),
 *   meta: {
 *     roles: ['admin']
 *   }
 * }
 *
 * // 在组件中使用
 * import { checkPermission } from '@/router/guards/permissionGuard';
 *
 * const canEdit = checkPermission(['user:edit']);
 * const canDelete = checkPermission(['user:delete']);
 */
