/**
 * 路由守卫统一导出
 * @description 统一导出所有路由守卫工具函数
 */

import { useAuthStore } from '@/stores/global/auth';
import { STORAGE_KEYS } from '@/constants/common';

/**
 * 检查用户是否已认证
 * 优先从 localStorage 读取，避免 Pinia 状态恢复时机问题
 */
export function checkAuthentication(): boolean {
  // 直接从 localStorage 读取，避免 Pinia 状态恢复时机问题
  // 因为在路由守卫执行时，Pinia 插件可能还没有完成状态恢复
  if (typeof localStorage !== 'undefined') {
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const hasAuth = !!(parsed?.token && parsed?.user);
        console.log('[Auth Guard] checkAuthentication from localStorage:', hasAuth, parsed?.token?.slice(0, 20) + '...');
        return hasAuth;
      } catch {
        console.warn('[Auth Guard] Failed to parse auth data from localStorage');
      }
    }
  }

  // 降级：尝试从 Pinia store 读取
  try {
    const authStore = useAuthStore();
    console.log('[Auth Guard] checkAuthentication from store:', authStore.isAuthenticated);
    return authStore.isAuthenticated;
  } catch (error) {
    console.warn('[Auth Guard] Failed to get auth state from store:', error);
  }

  return false;
}

/**
 * 检查用户是否有指定权限
 * @param permissions - 权限列表
 * @returns 是否拥有所有权限
 */
export function checkPermissions(permissions: string[]): boolean {
  try {
    const authStore = useAuthStore();
    return permissions.every(perm => authStore.hasPermission(perm));
  } catch {
    return false;
  }
}

// 导出权限守卫
export {
  permissionGuard,
  checkPermission,
  checkRole,
  createPermissionGuard,
} from './permissionGuard';

export type {
  PermissionMode,
  RoutePermission,
} from './permissionGuard';
