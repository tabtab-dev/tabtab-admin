/**
 * 路由映射工具
 * @description 使用 Vite 的 import.meta.glob 自动扫描 views 目录，根据后端返回的路径匹配组件
 */

import type { RouteRecordRaw } from 'vue-router';
import type { RouteConfig } from '@/types/menu';

/**
 * 自动扫描所有视图组件
 * key: /src/views/XXX.vue
 * value: () => import('/src/views/XXX.vue')
 */
const modules = import.meta.glob('@/views/**/*.vue');

/**
 * 组件缓存映射
 * 将 component 路径缓存到模块加载函数
 */
const componentCache = new Map<string, () => Promise<any>>();

/**
 * 初始化组件映射
 * 扫描所有视图组件并建立映射关系
 */
function initComponentMap() {
  for (const [path, loader] of Object.entries(modules)) {
    // 从 /src/views/Users.vue 提取 users
    const match = path.match(/\/src\/views\/(.+)\.vue$/);
    if (match) {
      const fileName = match[1];
      // 建立多种格式的映射
      // Users → /users
      // UsersAnalysis → /users-analysis
      // Categories → /categories
      const kebabName = fileName
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();

      componentCache.set(`/${kebabName}`, loader);
      componentCache.set(fileName.toLowerCase(), loader);
    }
  }
}

// 初始化组件映射
initComponentMap();

/**
 * 将 component 路径转换为组件导入函数
 * @param componentPath - 后端返回的 component 路径（如 /users）
 * @returns 组件导入函数
 */
export function getComponent(componentPath: string): (() => Promise<any>) | undefined {
  // 直接查找缓存
  if (componentCache.has(componentPath)) {
    return componentCache.get(componentPath);
  }

  // 尝试多种格式匹配
  // /users → users
  const normalizedPath = componentPath.toLowerCase().replace(/^\//, '');

  if (componentCache.has(normalizedPath)) {
    return componentCache.get(normalizedPath);
  }

  // 尝试查找包含该名称的组件
  for (const [key, loader] of componentCache.entries()) {
    if (key.includes(normalizedPath) || normalizedPath.includes(key.replace('/', ''))) {
      return loader;
    }
  }

  console.warn(`[RouteMapping] Component not found for: ${componentPath}`);
  return undefined;
}

/**
 * 将路由配置转换为 Vue Router 路由记录
 * @param routes - 路由配置数组
 * @returns Vue Router 路由记录数组
 */
export function convertToRouteRecords(routes: RouteConfig[]): RouteRecordRaw[] {
  return routes.map((route) => {
    const componentLoader = getComponent(route.component);

    const routeRecord: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      component: componentLoader || (() => import('@/views/NotFound.vue')),
      meta: route.meta,
    };

    if (route.children && route.children.length > 0) {
      routeRecord.children = convertToRouteRecords(route.children);
    }

    return routeRecord;
  });
}

/**
 * 获取所有可用的组件路径（用于调试）
 * @returns 组件路径列表
 */
export function getAvailableComponents(): string[] {
  return Array.from(componentCache.keys());
}
