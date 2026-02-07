/**
 * 图标工具函数
 * @description 提供图标获取功能，全量导入 lucide-vue-next
 */
import * as icons from 'lucide-vue-next';
import { shallowRef, type Component } from 'vue';

/**
 * 图标名称到组件的映射
 */
const iconMap = icons as unknown as Record<string, Component>;

/**
 * 获取图标组件
 * @param iconName - 图标名称（如 'LayoutDashboard', 'Users' 等）
 * @returns 图标组件或 undefined
 */
export function getIcon(iconName?: string): Component | undefined {
  if (!iconName) return undefined;
  return iconMap[iconName];
}

/**
 * 批量获取图标
 * @param iconNames - 图标名称数组
 * @returns 图标名称到组件的映射
 */
export function getIcons(iconNames: string[]): Record<string, Component> {
  const result: Record<string, Component> = {};

  iconNames.forEach((name) => {
    const icon = getIcon(name);
    if (icon) {
      result[name] = icon;
    }
  });

  return result;
}

/**
 * 检查图标是否存在
 * @param iconName - 图标名称
 * @returns 是否存在
 */
export function hasIcon(iconName?: string): boolean {
  if (!iconName) return false;
  return iconName in iconMap;
}

/**
 * 获取所有可用的图标名称
 * @returns 图标名称数组
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap).filter((key) => 
    // 过滤掉非组件导出（如 createIcons 等工具函数）
    typeof iconMap[key] === 'object' && iconMap[key] !== null
  );
}

/**
 * 使用图标（带响应式缓存）
 * @param iconName - 图标名称
 * @returns 图标组件的 ref
 * @deprecated 直接使用 getIcon 即可，无需异步加载
 */
export function useIcon(iconName?: string) {
  return shallowRef<Component | undefined>(getIcon(iconName));
}

/**
 * 清除图标缓存
 * @deprecated 全量导入模式下无需缓存
 */
export function clearIconCache(): void {
  // 全量导入模式下无需清除缓存
}

// 为了向后兼容，保留旧函数名
export const loadIcon = getIcon;
export const loadIcons = getIcons;
export const getCachedIcon = getIcon;
export const hasIconCached = hasIcon;
