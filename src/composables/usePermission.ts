/**
 * 权限控制组合式函数
 * @description 提供权限检查相关功能，用于组件内权限控制
 */

import { computed } from 'vue';
import { useAuthStore } from '@/stores/global/auth';
import type { PermissionCode } from '@/constants/permissions';

/** 权限检查模式 */
export type PermissionMode = 'all' | 'any';

/**
 * 权限控制组合式函数
 * @returns 权限检查相关方法
 */
export function usePermission() {
  const authStore = useAuthStore();

  /**
   * 检查是否拥有指定权限
   * @param permission - 权限码
   * @returns 是否拥有权限
   */
  const hasPermission = (permission: PermissionCode | string): boolean => {
    return authStore.hasPermission(permission);
  };

  /**
   * 检查是否拥有任意一个权限
   * @param permissions - 权限码列表
   * @returns 是否拥有任意一个权限
   */
  const hasAnyPermission = (permissions: (PermissionCode | string)[]): boolean => {
    if (!permissions.length) return true;
    return permissions.some(perm => authStore.hasPermission(perm));
  };

  /**
   * 检查是否拥有所有权限
   * @param permissions - 权限码列表
   * @returns 是否拥有所有权限
   */
  const hasAllPermissions = (permissions: (PermissionCode | string)[]): boolean => {
    if (!permissions.length) return true;
    return permissions.every(perm => authStore.hasPermission(perm));
  };

  /**
   * 检查是否拥有指定角色
   * @param role - 角色名称
   * @returns 是否拥有该角色
   */
  const hasRole = (role: string): boolean => {
    return authStore.user?.role === role;
  };

  /**
   * 检查是否拥有任意一个角色
   * @param roles - 角色列表
   * @returns 是否拥有任意一个角色
   */
  const hasAnyRole = (roles: string[]): boolean => {
    if (!roles.length) return true;
    return roles.some(role => authStore.user?.role === role);
  };

  /**
   * 检查权限（支持单权限、多权限 any/all 模式）
   * @param permission - 单个权限或权限数组
   * @param mode - 检查模式，多权限时有效
   * @returns 是否通过权限检查
   */
  const checkPermission = (
    permission: PermissionCode | string | (PermissionCode | string)[],
    mode: PermissionMode = 'all'
  ): boolean => {
    if (Array.isArray(permission)) {
      return mode === 'any'
        ? hasAnyPermission(permission)
        : hasAllPermissions(permission);
    }
    return hasPermission(permission);
  };

  /**
   * 创建响应式权限计算属性
   * @param permission - 权限码
   * @returns 响应式的权限状态
   */
  const usePermissionRef = (permission: PermissionCode | string) => {
    return computed(() => hasPermission(permission));
  };

  /**
   * 检查是否为管理员
   */
  const isAdmin = computed(() => authStore.isAdmin);

  /**
   * 检查是否已认证
   */
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  return {
    // 方法
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    checkPermission,
    usePermissionRef,

    // 计算属性
    isAdmin,
    isAuthenticated,
  };
}

/**
 * 权限检查工具函数（用于非组件环境）
 * @description 在指令、路由守卫等非 setup 环境中使用
 */
export function checkPermissionUtil(
  permissions: string[],
  userPermissions: string[],
  mode: PermissionMode = 'all'
): boolean {
  if (!permissions.length) return true;

  if (mode === 'any') {
    return permissions.some(perm => userPermissions.includes(perm));
  }
  return permissions.every(perm => userPermissions.includes(perm));
}

/**
 * 检查是否拥有超级权限（*）
 * @param userPermissions - 用户权限列表
 * @returns 是否拥有超级权限
 */
export function hasSuperPermission(userPermissions: string[]): boolean {
  return userPermissions.includes('*');
}
