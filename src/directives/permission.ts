/**
 * 权限控制指令
 * @description 提供 v-permission 指令，用于元素级权限控制
 *
 * 使用方式：
 * 1. 单个权限: v-permission="'user:create'"
 * 2. 多个权限(任一): v-permission:any="['user:create', 'user:update']"
 * 3. 多个权限(全部): v-permission:all="['user:create', 'user:update']"
 * 4. 角色检查: v-role="'admin'"
 * 5. 角色检查(任一): v-role:any="['admin', 'editor']"
 */

import type { Directive, DirectiveBinding } from 'vue';
import { watch, computed } from 'vue';
import { useAuthStore } from '@/stores/global/auth';
import type { PermissionMode } from '@/composables/usePermission';
import type { PermissionCode } from '@/constants/permissions';

/** 权限指令绑定值类型 */
export type PermissionBinding = PermissionCode | string | (PermissionCode | string)[];

/** 角色指令绑定值类型 */
export type RoleBinding = string | string[];

/**
 * 检查权限的工具函数
 * @param requiredPermissions - 需要的权限列表
 * @param userPermissions - 用户拥有的权限列表
 * @param mode - 检查模式
 * @returns 是否通过检查
 */
function checkPermissions(
  requiredPermissions: string[],
  userPermissions: string[],
  mode: PermissionMode = 'all'
): boolean {
  // 超级权限检查
  if (userPermissions.includes('*')) {
    return true;
  }

  if (mode === 'any') {
    return requiredPermissions.some(perm => userPermissions.includes(perm));
  }
  return requiredPermissions.every(perm => userPermissions.includes(perm));
}

/**
 * 检查角色的工具函数
 * @param requiredRoles - 需要的角色列表
 * @param userRole - 用户当前角色
 * @param mode - 检查模式
 * @returns 是否通过检查
 */
function checkRoles(
  requiredRoles: string[],
  userRole: string | undefined,
  mode: PermissionMode = 'any'
): boolean {
  if (!userRole) return false;

  if (mode === 'all') {
    return requiredRoles.every(role => userRole === role);
  }
  return requiredRoles.some(role => userRole === role);
}

/**
 * 处理无权限情况
 * @param el - 元素
 * @param binding - 指令绑定
 */
function handleNoPermission(el: HTMLElement, binding: DirectiveBinding): void {
  if (binding.modifiers.disabled) {
    // 禁用模式
    el.setAttribute('disabled', 'true');
    el.setAttribute('aria-disabled', 'true');
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.5';
    el.style.cursor = 'not-allowed';
  } else if (binding.modifiers.hidden) {
    // 隐藏模式
    el.style.visibility = 'hidden';
  } else {
    // 默认：隐藏元素
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');
  }
}

/**
 * 恢复元素状态
 * @param el - 元素
 * @param binding - 指令绑定
 */
function restoreElement(el: HTMLElement, binding: DirectiveBinding): void {
  if (binding.modifiers.disabled) {
    el.removeAttribute('disabled');
    el.removeAttribute('aria-disabled');
    el.style.pointerEvents = '';
    el.style.opacity = '';
    el.style.cursor = '';
  } else if (binding.modifiers.hidden) {
    el.style.visibility = '';
  } else {
    el.style.display = '';
    el.removeAttribute('aria-hidden');
  }
}

/**
 * 创建权限检查 watcher
 * @param el - 元素
 * @param binding - 指令绑定
 * @param authStore - auth store 实例
 * @returns 停止 watcher 的函数
 */
function createPermissionWatcher(
  el: HTMLElement,
  binding: DirectiveBinding<PermissionBinding>,
  authStore: ReturnType<typeof useAuthStore>
): () => void {
  const { value, arg } = binding;

  // 创建计算属性来监听权限变化
  const hasAuth = computed(() => {
    if (!authStore.isAuthenticated) {
      return false;
    }

    const userPermissions = authStore.user?.permissions || [];
    const permissions = Array.isArray(value) ? value : [value];
    const mode: PermissionMode = arg === 'any' ? 'any' : 'all';

    return checkPermissions(permissions as string[], userPermissions, mode);
  });

  // 立即执行一次检查
  if (hasAuth.value) {
    restoreElement(el, binding);
  } else {
    handleNoPermission(el, binding);
  }

  // 监听权限变化
  const stopWatch = watch(
    hasAuth,
    (newValue) => {
      if (newValue) {
        restoreElement(el, binding);
      } else {
        handleNoPermission(el, binding);
      }
    },
    { immediate: false }
  );

  return stopWatch;
}

/**
 * 创建角色检查 watcher
 * @param el - 元素
 * @param binding - 指令绑定
 * @param authStore - auth store 实例
 * @returns 停止 watcher 的函数
 */
function createRoleWatcher(
  el: HTMLElement,
  binding: DirectiveBinding<RoleBinding>,
  authStore: ReturnType<typeof useAuthStore>
): () => void {
  const { value, arg } = binding;

  // 创建计算属性来监听角色变化
  const hasAuth = computed(() => {
    if (!authStore.isAuthenticated || !authStore.user) {
      return false;
    }

    const roles = Array.isArray(value) ? value : [value];
    const mode: PermissionMode = arg === 'all' ? 'all' : 'any';

    return checkRoles(roles, authStore.user.role, mode);
  });

  // 立即执行一次检查
  if (hasAuth.value) {
    restoreElement(el, binding);
  } else {
    handleNoPermission(el, binding);
  }

  // 监听角色变化
  const stopWatch = watch(
    hasAuth,
    (newValue) => {
      if (newValue) {
        restoreElement(el, binding);
      } else {
        handleNoPermission(el, binding);
      }
    },
    { immediate: false }
  );

  return stopWatch;
}

// 存储每个元素的 watcher 清理函数
const permissionWatchers = new WeakMap<HTMLElement, () => void>();
const roleWatchers = new WeakMap<HTMLElement, () => void>();

/**
 * 权限指令
 * @example
 * <!-- 单个权限 -->
 * <Button v-permission="'user:create'">新建</Button>
 *
 * <!-- 多个权限（任一） -->
 * <Button v-permission:any="['user:create', 'user:update']">操作</Button>
 *
 * <!-- 多个权限（全部） -->
 * <Button v-permission:all="['user:create', 'user:update']">管理</Button>
 *
 * <!-- 禁用模式（无权限时禁用而非隐藏） -->
 * <Button v-permission.disabled="'user:delete'">删除</Button>
 */
export const permissionDirective: Directive<HTMLElement, PermissionBinding> = {
  mounted(el, binding) {
    const authStore = useAuthStore();
    const stopWatch = createPermissionWatcher(el, binding, authStore);
    permissionWatchers.set(el, stopWatch);
  },
  updated(el, binding) {
    // 清理旧的 watcher
    const oldStopWatch = permissionWatchers.get(el);
    if (oldStopWatch) {
      oldStopWatch();
    }
    // 创建新的 watcher
    const authStore = useAuthStore();
    const stopWatch = createPermissionWatcher(el, binding, authStore);
    permissionWatchers.set(el, stopWatch);
  },
  unmounted(el) {
    // 清理 watcher
    const stopWatch = permissionWatchers.get(el);
    if (stopWatch) {
      stopWatch();
      permissionWatchers.delete(el);
    }
  },
};

/**
 * 角色指令
 * @example
 * <!-- 单个角色 -->
 * <Button v-role="'admin'">管理员操作</Button>
 *
 * <!-- 多个角色（任一） -->
 * <Button v-role:any="['admin', 'editor']">编辑操作</Button>
 *
 * <!-- 禁用模式 -->
 * <Button v-role.disabled="'admin'">管理员操作</Button>
 */
export const roleDirective: Directive<HTMLElement, RoleBinding> = {
  mounted(el, binding) {
    const authStore = useAuthStore();
    const stopWatch = createRoleWatcher(el, binding, authStore);
    roleWatchers.set(el, stopWatch);
  },
  updated(el, binding) {
    // 清理旧的 watcher
    const oldStopWatch = roleWatchers.get(el);
    if (oldStopWatch) {
      oldStopWatch();
    }
    // 创建新的 watcher
    const authStore = useAuthStore();
    const stopWatch = createRoleWatcher(el, binding, authStore);
    roleWatchers.set(el, stopWatch);
  },
  unmounted(el) {
    // 清理 watcher
    const stopWatch = roleWatchers.get(el);
    if (stopWatch) {
      stopWatch();
      roleWatchers.delete(el);
    }
  },
};

/**
 * 注册权限指令
 * @param app - Vue 应用实例
 */
export function registerPermissionDirectives(app: {
  directive: (name: string, directive: Directive) => void;
}): void {
  app.directive('permission', permissionDirective);
  app.directive('role', roleDirective);
}
