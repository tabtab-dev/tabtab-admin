import { computed, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuItem, SidebarMenuItem } from '@/types/menu';

/**
 * 激活匹配模式
 */
export type MatchMode = 'exact' | 'startsWith' | 'smart';

/**
 * 菜单工具函数选项
 */
export interface UseMenuUtilsOptions {
  /** 展开的菜单 keys */
  expandedKeys?: Ref<Set<string>>;
  /** 激活匹配模式 */
  matchMode?: MatchMode;
}

/**
 * 菜单工具函数
 * 提供菜单相关的通用逻辑
 */
export function useMenuUtils(options: UseMenuUtilsOptions = {}) {
  const route = useRoute();
  const { expandedKeys, matchMode = 'smart' } = options;

  /**
   * 判断是否激活
   * @param path 菜单路径
   * @returns 是否激活
   */
  const isActive = (path: string): boolean => {
    const currentPath = route.path;

    switch (matchMode) {
      case 'exact':
        // 完全匹配
        return currentPath === path;

      case 'startsWith':
        // 简单前缀匹配
        if (path === '/') {
          return currentPath === '/';
        }
        return currentPath.startsWith(path);

      case 'smart':
      default:
        // 智能匹配策略
        // 1. 完全匹配
        if (currentPath === path) return true;

        // 2. 根路径特殊处理
        if (path === '/') return false;

        // 3. 子路由匹配 - 只匹配直接子级，不匹配其他分支的子路由
        // 例如：/products 匹配 /products/123，但不匹配 /products/categories/xxx
        const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
        if (!currentPath.startsWith(pathWithSlash)) return false;

        // 获取剩余路径部分
        const remainingPath = currentPath.slice(pathWithSlash.length);
        // 如果剩余部分不包含 /，说明是直接子级；否则是更深层的子路由
        return !remainingPath.includes('/');
    }
  };

  /**
   * 判断是否展开
   * @param key 菜单key
   * @returns 是否展开
   */
  const isExpanded = (key: string): boolean => {
    return expandedKeys?.value.has(key) ?? false;
  };

  /**
   * 判断子菜单是否有激活项
   * @param children 子菜单列表
   * @returns 是否有激活的子菜单
   */
  const hasActiveChild = (children?: Array<{ path: string }>): boolean => {
    if (!children) return false;
    return children.some((child) => isActive(child.path));
  };

  /**
   * 递归查找激活的菜单项
   * @param menus 菜单列表
   * @returns 激活的菜单项路径
   */
  const findActiveMenu = (menus: Array<{ path: string; children?: Array<{ path: string }> }>): string | null => {
    for (const menu of menus) {
      if (isActive(menu.path)) {
        return menu.path;
      }
      if (menu.children) {
        const activeChild = findActiveMenu(menu.children);
        if (activeChild) {
          return activeChild;
        }
      }
    }
    return null;
  };

  /**
   * 获取应该展开的菜单 keys（基于当前激活路径）
   * @param menus 菜单列表
   * @returns 应该展开的菜单 key 集合
   */
  const getExpandedKeysByPath = (menus: MenuItem[] | SidebarMenuItem[]): Set<string> => {
    const keys = new Set<string>();

    const traverse = (items: (MenuItem | SidebarMenuItem)[], parentKeys: string[] = []) => {
      for (const item of items) {
        const currentKeys = [...parentKeys, item.key];

        if (isActive(item.path)) {
          // 如果当前菜单激活，添加所有父级 key
          parentKeys.forEach((key) => keys.add(key));
          return true;
        }

        if (item.children) {
          const hasActive = traverse(item.children, currentKeys);
          if (hasActive) {
            keys.add(item.key);
            return true;
          }
        }
      }
      return false;
    };

    traverse(menus);
    return keys;
  };

  /**
   * 获取 ARIA current 属性值
   * @param path 菜单路径
   * @returns 'page' 或 undefined
   */
  const getAriaCurrent = (path: string): 'page' | undefined => {
    return isActive(path) ? 'page' : undefined;
  };

  /**
   * 获取 ARIA expanded 属性值
   * @param key 菜单key
   * @returns boolean 或 undefined
   */
  const getAriaExpanded = (key: string): boolean | undefined => {
    if (!expandedKeys) return undefined;
    return isExpanded(key);
  };

  return {
    isActive,
    isExpanded,
    hasActiveChild,
    findActiveMenu,
    getExpandedKeysByPath,
    getAriaCurrent,
    getAriaExpanded,
  };
}

/**
 * 创建 LRU 缓存
 * @param maxSize 最大缓存数量
 * @returns LRU 缓存实例
 */
export function createLRUCache<K, V>(maxSize: number) {
  const cache = new Map<K, V>();

  return {
    get(key: K): V | undefined {
      const value = cache.get(key);
      if (value !== undefined) {
        // 移动到末尾（最近使用）
        cache.delete(key);
        cache.set(key, value);
      }
      return value;
    },

    set(key: K, value: V): void {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        // 删除最久未使用的（第一个）
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }
      cache.set(key, value);
    },

    has(key: K): boolean {
      return cache.has(key);
    },

    clear(): void {
      cache.clear();
    },

    get size(): number {
      return cache.size;
    },
  };
}

/**
 * 百分比转换缓存（使用 LRU）
 */
const percentCache = createLRUCache<string, number>(100);

/**
 * 将像素转换为百分比（带 LRU 缓存）
 * @param px 像素值
 * @param windowWidth 窗口宽度
 * @returns 百分比值
 */
export function pxToPercent(px: number, windowWidth: number): number {
  const cacheKey = `${px}-${windowWidth}`;

  const cached = percentCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const percent = (px / windowWidth) * 100;
  percentCache.set(cacheKey, percent);
  return percent;
}

/**
 * 格式化徽标数字
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatBadge(num: number): string {
  return num > 99 ? '99+' : String(num);
}

/**
 * 获取按钮变体
 * @param active 是否激活
 * @returns 按钮变体
 */
export function getButtonVariant(active: boolean): 'default' | 'ghost' {
  return active ? 'default' : 'ghost';
}

/**
 * 获取图标类名
 * @param active 是否激活
 * @returns 类名字符串
 */
export function getIconClass(active: boolean): string {
  return active
    ? 'h-5 w-5 text-primary-foreground'
    : 'h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors';
}

/**
 * 过滤有权限的菜单
 * @param menus 菜单列表
 * @param userPermissions 用户权限码列表
 * @param userRoles 用户角色列表
 * @returns 过滤后的菜单列表
 */
export function filterMenusByPermission(
  menus: MenuItem[] | SidebarMenuItem[],
  userPermissions: string[] = [],
  userRoles: string[] = []
): (MenuItem | SidebarMenuItem)[] {
  return menus.filter((menu) => {
    // 检查权限
    if (menu.permissions && menu.permissions.length > 0) {
      const hasPermission = menu.permissions.some((p) => userPermissions.includes(p));
      if (!hasPermission) return false;
    }

    // 检查角色
    if (menu.roles && menu.roles.length > 0) {
      const hasRole = menu.roles.some((r) => userRoles.includes(r));
      if (!hasRole) return false;
    }

    // 递归过滤子菜单
    if (menu.children && menu.children.length > 0) {
      menu.children = filterMenusByPermission(
        menu.children,
        userPermissions,
        userRoles
      ) as typeof menu.children;
    }

    return true;
  });
}

/**
 * 扁平化菜单列表
 * @param menus 菜单列表
 * @returns 扁平化后的菜单列表
 */
export function flattenMenus<T extends { children?: T[] }>(menus: T[]): T[] {
  return menus.reduce((acc: T[], item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenMenus(item.children));
    }
    return acc;
  }, []);
}

/**
 * 根据路径查找菜单项
 * @param menus 菜单列表
 * @param path 路径
 * @returns 菜单项或 undefined
 */
export function findMenuByPath<T extends { path: string; children?: T[] }>(
  menus: T[],
  path: string
): T | undefined {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu;
    }
    if (menu.children) {
      const found = findMenuByPath(menu.children, path);
      if (found) return found;
    }
  }
  return undefined;
}
