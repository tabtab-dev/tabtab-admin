/**
 * 图标工具函数
 * @description 提供动态图标加载和缓存功能
 */
import { ref, type Component } from 'vue';

/**
 * 图标缓存映射
 * 缓存已加载的图标组件
 */
const iconCache = new Map<string, Component>();

/**
 * 动态加载图标组件
 * @param iconName - 图标名称（如 'LayoutDashboard', 'Users' 等）
 * @returns 图标组件或 undefined
 */
export async function loadIcon(iconName?: string): Promise<Component | undefined> {
  if (!iconName) return undefined;

  // 检查缓存
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }

  try {
    // 动态导入 lucide-vue-next 图标
    const module = await import('lucide-vue-next');
    const icon = module[iconName as keyof typeof module] as Component;

    if (icon) {
      iconCache.set(iconName, icon);
      return icon;
    }

    console.warn(`[useIcon] Icon not found: ${iconName}`);
    return undefined;
  } catch (error) {
    console.warn(`[useIcon] Failed to load icon: ${iconName}`, error);
    return undefined;
  }
}

/**
 * 批量加载图标
 * @param iconNames - 图标名称数组
 * @returns 图标名称到组件的映射
 */
export async function loadIcons(iconNames: string[]): Promise<Record<string, Component>> {
  const result: Record<string, Component> = {};

  await Promise.all(
    iconNames.map(async (name) => {
      const icon = await loadIcon(name);
      if (icon) {
        result[name] = icon;
      }
    })
  );

  return result;
}

/**
 * 同步获取已缓存的图标
 * @param iconName - 图标名称
 * @returns 图标组件或 undefined
 */
export function getCachedIcon(iconName?: string): Component | undefined {
  if (!iconName) return undefined;
  return iconCache.get(iconName);
}

/**
 * 检查图标是否已缓存
 * @param iconName - 图标名称
 * @returns 是否已缓存
 */
export function hasIconCached(iconName?: string): boolean {
  if (!iconName) return false;
  return iconCache.has(iconName);
}

/**
 * 清除图标缓存
 */
export function clearIconCache(): void {
  iconCache.clear();
}

/**
 * 使用图标（带响应式缓存）
 * @param iconName - 图标名称
 * @returns 图标组件的 ref
 */
export function useIcon(iconName?: string) {
  const icon = ref<Component | undefined>(getCachedIcon(iconName));

  // 如果图标未缓存，异步加载
  if (iconName && !icon.value) {
    loadIcon(iconName).then((loadedIcon) => {
      if (loadedIcon) {
        icon.value = loadedIcon;
      }
    });
  }

  return icon;
}
