import { computed, type Ref } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 菜单工具函数
 * 提供菜单相关的通用逻辑
 */
export function useMenuUtils(expandedKeys?: Ref<Set<string>>) {
  const route = useRoute();

  /**
   * 判断是否激活
   * 使用精确匹配策略，避免同级菜单的误判
   * @param path 菜单路径
   * @returns 是否激活
   */
  const isActive = (path: string): boolean => {
    // 1. 完全匹配
    if (route.path === path) return true;

    // 2. 根路径特殊处理
    if (path === '/') return false;

    // 3. 子路由匹配 - 只匹配直接子级，不匹配其他分支的子路由
    // 例如：/products 匹配 /products/123，但不匹配 /products/categories/xxx
    const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
    if (!route.path.startsWith(pathWithSlash)) return false;

    // 获取剩余路径部分
    const remainingPath = route.path.slice(pathWithSlash.length);
    // 如果剩余部分不包含 /，说明是直接子级；否则是更深层的子路由
    return !remainingPath.includes('/');
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
    return children.some(child => isActive(child.path));
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
    getAriaCurrent,
    getAriaExpanded,
  };
}

/**
 * 缓存计算结果的百分比转换函数
 */
const percentCache = new Map<number, number>();

/**
 * 将像素转换为百分比（带缓存）
 * @param px 像素值
 * @param windowWidth 窗口宽度
 * @returns 百分比值
 */
export function pxToPercent(px: number, windowWidth: number): number {
  const cacheKey = `${px}-${windowWidth}`;
  
  if (percentCache.has(cacheKey)) {
    return percentCache.get(cacheKey)!;
  }
  
  const percent = (px / windowWidth) * 100;
  
  // 限制缓存大小
  if (percentCache.size > 100) {
    const firstKey = percentCache.keys().next().value;
    percentCache.delete(firstKey);
  }
  
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
