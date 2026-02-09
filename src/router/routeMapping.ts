/**
 * 路由映射工具
 * @description 将后端返回的路由配置转换为 Vue Router 路由记录
 */

import type { RouteRecordRaw } from 'vue-router';
import type { RouteConfig, RouteMeta } from '@/types/menu';

/**
 * 自动扫描 views 目录下所有 Vue 组件
 */
const modules = import.meta.glob('@/views/**/*.vue', {
  eager: false,
  import: 'default',
});

/**
 * 组件缓存映射
 * key: 标准化的路径（如 /system/user/index）
 * value: 组件加载函数
 */
const componentCache = new Map<string, () => Promise<any>>();

/**
 * 布局组件映射
 */
const layoutCache = new Map<string, () => Promise<any>>();

/**
 * 标准化路径
 * @param path - 文件路径
 * @returns 标准化后的路径
 */
function normalizePath(path: string): string {
  return path.replace(/^\//, '').toLowerCase();
}

/**
 * 初始化组件映射
 * 扫描所有视图组件并建立路径映射
 */
function initComponentMap() {
  for (const [fullPath, loader] of Object.entries(modules)) {
    // 从 /src/views/system/user/index.vue 提取 system/user/index
    const match = fullPath.match(/\/src\/views\/(.+)\.vue$/);
    if (match) {
      const relativePath = match[1];
      const normalizedPath = normalizePath(relativePath);
      componentCache.set(normalizedPath, loader as () => Promise<any>);
    }
  }

  // 注册布局组件
  layoutCache.set('basiclayout', () => import('@/layouts/BasicLayout.vue'));
  layoutCache.set('blanklayout', () => import('@/layouts/BlankLayout.vue'));

  if (import.meta.env.DEV) {
    console.log('[RouteMapping] 已加载组件:', Array.from(componentCache.keys()));
  }
}

// 初始化组件映射
initComponentMap();

/**
 * 获取组件加载函数
 * @param componentPath - 组件路径（如 /system/user/index 或 BasicLayout）
 * @returns 组件加载函数
 */
function getComponentLoader(componentPath: string): (() => Promise<any>) | undefined {
  if (!componentPath) {
    return undefined;
  }

  // 处理布局组件（如 BasicLayout）
  const layoutKey = componentPath.toLowerCase().replace(/-/g, '');
  if (layoutCache.has(layoutKey)) {
    return layoutCache.get(layoutKey);
  }

  // 处理普通组件路径
  const normalizedPath = normalizePath(componentPath);

  // 直接匹配
  if (componentCache.has(normalizedPath)) {
    return componentCache.get(normalizedPath);
  }

  // 尝试添加 /index 后缀
  const indexPath = `${normalizedPath}/index`;
  if (componentCache.has(indexPath)) {
    return componentCache.get(indexPath);
  }

  // 尝试作为目录查找
  const dirPath = normalizedPath.replace(/\/index$/, '');
  if (componentCache.has(dirPath)) {
    return componentCache.get(dirPath);
  }

  if (import.meta.env.DEV) {
    console.warn(`[RouteMapping] 未找到组件: ${componentPath} (标准化: ${normalizedPath})`);
  }

  return undefined;
}

/**
 * 转换路由元数据
 * @param meta - 后端返回的元数据
 * @returns Vue Router 元数据
 */
function convertMeta(meta: RouteMeta): Record<string, any> {
  return {
    title: meta.title,
    icon: meta.icon,
    keepAlive: meta.keepAlive ?? false,
    hideInMenu: meta.hideInMenu ?? false,
    order: meta.order ?? 0,
    requiresAuth: meta.requiresAuth ?? true,
    permissions: meta.permissions,
    roles: meta.roles,
    group: meta.group,
  };
}

/**
 * 将后端路由配置转换为 Vue Router 路由记录
 * @param routes - 后端路由配置数组
 * @returns Vue Router 路由记录数组
 */
export function convertToRouteRecords(routes: RouteConfig[]): RouteRecordRaw[] {
  return routes.map((route) => {
    const routeRecord: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      meta: convertMeta(route.meta),
    };

    // 处理组件
    if (route.component) {
      const componentLoader = getComponentLoader(route.component);
      if (componentLoader) {
        routeRecord.component = componentLoader;
      } else if (import.meta.env.DEV) {
        console.warn(`[RouteMapping] 组件未找到，使用 NotFound 占位: ${route.component}`);
        routeRecord.component = () => import('@/views/NotFound.vue');
      }
    }

    // 处理重定向
    if (route.redirect) {
      routeRecord.redirect = route.redirect;
    }

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      routeRecord.children = convertToRouteRecords(route.children);
    }

    return routeRecord;
  });
}

/**
 * 检查组件是否存在
 * @param componentPath - 组件路径
 * @returns 是否存在
 */
export function hasComponent(componentPath: string): boolean {
  if (!componentPath) return false;

  const layoutKey = componentPath.toLowerCase().replace(/-/g, '');
  if (layoutCache.has(layoutKey)) return true;

  const normalizedPath = normalizePath(componentPath);
  if (componentCache.has(normalizedPath)) return true;
  if (componentCache.has(`${normalizedPath}/index`)) return true;

  return false;
}
