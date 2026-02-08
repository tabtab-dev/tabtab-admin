import type { Ref } from 'vue';
import type { MenuItem, SidebarMenuItem } from '@/types/menu';

export type MatchMode = 'exact' | 'startsWith' | 'smart';

export interface UseMenuUtilsOptions {
  expandedKeys?: Ref<Set<string>>;
  matchMode?: MatchMode;
}

export function useMenuUtils(options: UseMenuUtilsOptions = {}) {
  const route = useRoute();
  const { expandedKeys, matchMode = 'smart' } = options;

  const isActive = (path: string): boolean => {
    const currentPath = route.path;

    switch (matchMode) {
      case 'exact':
        return currentPath === path;

      case 'startsWith':
        if (path === '/') return currentPath === '/';
        return currentPath.startsWith(path);

      case 'smart':
      default:
        if (currentPath === path) return true;
        if (path === '/') return false;

        const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
        if (!currentPath.startsWith(pathWithSlash)) return false;

        const remainingPath = currentPath.slice(pathWithSlash.length);
        return !remainingPath.includes('/');
    }
  };

  const isExpanded = (key: string): boolean => {
    return expandedKeys?.value.has(key) ?? false;
  };

  const hasActiveChild = (children?: Array<{ path: string }>): boolean => {
    if (!children) return false;
    return children.some((child) => isActive(child.path));
  };

  const getExpandedKeysByPath = (menus: MenuItem[] | SidebarMenuItem[]): Set<string> => {
    const keys = new Set<string>();

    const traverse = (items: (MenuItem | SidebarMenuItem)[], parentKeys: string[] = []) => {
      for (const item of items) {
        const currentKeys = [...parentKeys, item.key];

        if (isActive(item.path)) {
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

  const getAriaCurrent = (path: string): 'page' | undefined => {
    return isActive(path) ? 'page' : undefined;
  };

  const getAriaExpanded = (key: string): boolean | undefined => {
    if (!expandedKeys) return undefined;
    return isExpanded(key);
  };

  return {
    isActive,
    isExpanded,
    hasActiveChild,
    getExpandedKeysByPath,
    getAriaCurrent,
    getAriaExpanded,
  };
}

export function formatBadge(num: number): string {
  return num > 99 ? '99+' : String(num);
}

export function getButtonVariant(active: boolean): 'default' | 'ghost' {
  return active ? 'default' : 'ghost';
}

export function getIconClass(active: boolean): string {
  return active
    ? 'h-5 w-5 text-primary-foreground'
    : 'h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors';
}

export function filterMenusByPermission(
  menus: MenuItem[] | SidebarMenuItem[],
  userPermissions: string[] = [],
  userRoles: string[] = []
): (MenuItem | SidebarMenuItem)[] {
  return menus.filter((menu) => {
    if (menu.permissions?.length) {
      const hasPermission = menu.permissions.some((p) => userPermissions.includes(p));
      if (!hasPermission) return false;
    }

    if (menu.roles?.length) {
      const hasRole = menu.roles.some((r) => userRoles.includes(r));
      if (!hasRole) return false;
    }

    if (menu.children?.length) {
      menu.children = filterMenusByPermission(
        menu.children,
        userPermissions,
        userRoles
      ) as typeof menu.children;
    }

    return true;
  });
}

export function flattenMenus<T extends { children?: T[] }>(menus: T[]): T[] {
  return menus.reduce((acc: T[], item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenMenus(item.children));
    }
    return acc;
  }, []);
}

export function findMenuByPath<T extends { path: string; children?: T[] }>(
  menus: T[],
  path: string
): T | undefined {
  for (const menu of menus) {
    if (menu.path === path) return menu;
    if (menu.children) {
      const found = findMenuByPath(menu.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

export function pxToPercent(px: number, windowWidth: number): number {
  return (px / windowWidth) * 100;
}
