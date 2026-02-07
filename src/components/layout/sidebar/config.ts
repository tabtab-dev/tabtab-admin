/**
 * 侧边栏配置
 * @description 侧边栏配置和工具函数
 */
import type { Component } from 'vue';
import type { MenuItem, SidebarMenuItem, SidebarConfig, MenuGroup } from '@/types/menu';

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

    console.warn(`[SidebarConfig] Icon not found: ${iconName}`);
    return undefined;
  } catch (error) {
    console.warn(`[SidebarConfig] Failed to load icon: ${iconName}`, error);
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
 * 将 API 菜单项转换为 Sidebar 菜单项
 * @param menu - API 菜单项
 * @param iconMap - 图标组件映射（可选，用于批量加载优化）
 * @returns Sidebar 菜单项
 */
export function convertMenuItem(
  menu: MenuItem,
  iconMap?: Record<string, Component>
): SidebarMenuItem {
  return {
    key: menu.key,
    title: menu.title,
    path: menu.path,
    icon: menu.icon ? iconMap?.[menu.icon] : undefined,
    badge: menu.badge,
    group: menu.group,
    disabled: menu.disabled,
    defaultExpanded: menu.defaultExpanded,
    i18nKey: menu.i18nKey,
    hidden: menu.hidden,
    permissions: menu.permissions,
    roles: menu.roles,
    children: menu.children?.map((child) => convertMenuItem(child, iconMap)),
  };
}

/**
 * 异步转换菜单列表（带图标加载）
 * @param menus - API 菜单列表
 * @returns 转换后的 Sidebar 菜单列表
 */
export async function convertMenuItems(menus: MenuItem[]): Promise<SidebarMenuItem[]> {
  // 收集所有需要的图标名称
  const iconNames = new Set<string>();
  const collectIcons = (items: MenuItem[]) => {
    items.forEach((item) => {
      if (item.icon) {
        iconNames.add(item.icon);
      }
      if (item.children) {
        collectIcons(item.children);
      }
    });
  };
  collectIcons(menus);

  // 批量加载图标
  const iconMap = await loadIcons(Array.from(iconNames));

  // 转换菜单
  return menus.map((menu) => convertMenuItem(menu, iconMap));
}

/**
 * 默认侧栏配置
 */
export const defaultSidebarConfig: SidebarConfig = {
  collapsedWidth: 64,
  minWidth: 200,
  maxWidth: 400,
  defaultWidth: 260,
  menus: [],
};

/**
 * 菜单分组配置 - 使用 i18nKey
 */
export const menuGroups: MenuGroup[] = [
  { key: 'main', titleKey: 'menu.groupMain', order: 1 },
  { key: 'analytics', titleKey: 'menu.groupAnalytics', order: 2 },
  { key: 'system', titleKey: 'menu.groupSystem', order: 3 },
];

/**
 * 获取分组标题
 * @param groupKey - 分组 key
 * @returns 分组标题 i18n key
 */
export function getGroupTitleKey(groupKey: string): string {
  const group = menuGroups.find((g) => g.key === groupKey);
  return group?.titleKey || 'menu.groupMain';
}

/**
 * 按分组组织菜单
 * @param menus - 菜单列表
 * @returns 分组后的菜单映射
 */
export function groupMenus(menus: SidebarMenuItem[]): Record<string, SidebarMenuItem[]> {
  const groups: Record<string, SidebarMenuItem[]> = {};

  menus.forEach((item) => {
    const group = item.group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
  });

  return groups;
}
