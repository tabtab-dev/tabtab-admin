/**
 * 图标工具函数
 * @description 提供图标获取功能，使用 unplugin-icons 实现按需加载
 */
import { ref, shallowRef, watch, type Component, type ShallowRef } from 'vue';

/**
 * 图标名称映射表
 * 用于将图标名称转换为 unplugin-icons 的导入路径
 */
const iconCache = new Map<string, Component>();

/**
 * 将驼峰命名转换为 kebab-case
 * @param name - 图标名称
 * @returns kebab-case 格式的名称
 */
function toKebabCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

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
    const kebabName = toKebabCase(iconName);
    // @vite-ignore
    const module = await import(`~icons/lucide/${kebabName}.js`);
    const component = module.default;

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
 * 清除图标缓存
 */
export function clearIconCache(): void {
  iconCache.clear();
}

/**
 * 使用图标（响应式版本）
 * @param iconName - 图标名称（可以是响应式 ref）
 * @returns 图标组件的 shallowRef 和加载状态
 * @example
 * ```ts
 * const { iconComponent, loading } = useIcon('settings');
 * // 在模板中使用: <component :is="iconComponent" />
 * ```
 */
export function useIcon(iconName: string | undefined | Ref<string | undefined>) {
  const nameRef = isRef(iconName) ? iconName : ref(iconName);
  const iconComponent: ShallowRef<Component | null> = shallowRef(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const load = async () => {
    const name = unref(nameRef);
    if (!name) {
      iconComponent.value = null;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const component = await getIcon(name);
      iconComponent.value = component || null;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      iconComponent.value = null;
    } finally {
      loading.value = false;
    }
  };

  // 监听名称变化，自动重新加载
  watch(nameRef, load, { immediate: true });

  return {
    iconComponent,
    loading,
    error,
    reload: load,
  };
}
