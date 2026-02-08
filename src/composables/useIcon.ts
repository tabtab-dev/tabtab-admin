/**
 * 图标工具函数
 * @description 提供图标获取功能，使用 unplugin-icons 实现按需加载
 */
import { h, type Component } from 'vue';

/**
 * 图标名称映射表
 * 用于将图标名称转换为 unplugin-icons 的导入路径
 */
const iconCache = new Map<string, Component>();

/**
 * 动态导入图标组件
 * @param iconName - 图标名称（如 'layout-dashboard', 'users' 等）
 * @returns 图标组件或 undefined
 */
export async function getIcon(iconName?: string): Promise<Component | undefined> {
  if (!iconName) return undefined;

  // 检查缓存
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }

  try {
    // 将驼峰命名转换为 kebab-case
    const kebabName = iconName
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();

    // 动态导入图标
    const module = await import(`~icons/lucide/${kebabName}.js`);
    const component = module.default;

    // 缓存组件
    iconCache.set(iconName, component);
    return component;
  } catch {
    return undefined;
  }
}

/**
 * 批量获取图标
 * @param iconNames - 图标名称数组
 * @returns 图标名称到组件的映射
 */
export async function getIcons(iconNames: string[]): Promise<Record<string, Component>> {
  const result: Record<string, Component> = {};

  await Promise.all(
    iconNames.map(async (name) => {
      const icon = await getIcon(name);
      if (icon) {
        result[name] = icon;
      }
    })
  );

  return result;
}

/**
 * 检查图标是否存在
 * @param iconName - 图标名称
 * @returns 是否存在
 */
export function hasIcon(iconName?: string): boolean {
  if (!iconName) return false;
  return iconCache.has(iconName);
}

/**
 * 获取所有已缓存的图标名称
 * @returns 图标名称数组
 */
export function getAvailableIcons(): string[] {
  return Array.from(iconCache.keys());
}

/**
 * 使用图标（带响应式缓存）
 * @param iconName - 图标名称
 * @returns 图标组件的 ref
 */
export function useIcon(iconName?: string) {
  return {
    // 返回一个渲染函数，用于在模板中使用
    render: () => {
      if (!iconName) return null;
      const cached = iconCache.get(iconName);
      if (cached) {
        return h(cached);
      }
      return null;
    },
  };
}

/**
 * 清除图标缓存
 */
export function clearIconCache(): void {
  iconCache.clear();
}

// 为了向后兼容，保留旧函数名
export const loadIcon = getIcon;
export const loadIcons = getIcons;
export const getCachedIcon = getIcon;
export const hasIconCached = hasIcon;
