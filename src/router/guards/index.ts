/**
 * 路由守卫统一导出
 * @description 统一导出所有路由守卫工具函数
 */

import { useAuthStore } from '@/stores/global/auth';
import { STORAGE_KEYS } from '@/constants/common';

/**
 * 检查用户是否已认证
 * 优先从 Pinia store 获取，避免直接操作 localStorage
 */
export function checkAuthentication(): boolean {
  try {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
  } catch {
    // Store 未初始化时的降级处理
    // 从 Pinia 持久化存储的 'app-auth' key 中读取
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return !!(parsed?.token && parsed?.user);
      } catch {
        // 解析失败
      }
    }
    return false;
  }
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
