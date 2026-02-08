/**
 * 侧边栏配置
 * @description 侧边栏配置和工具函数
 */
import type { MenuItem, SidebarMenuItem, SidebarConfig, MenuGroup } from '@/types/menu';

/**
 * 将 API 菜单项转换为 Sidebar 菜单项
 * @param menu - API 菜单项
 * @returns Sidebar 菜单项
 */
export function convertMenuItem(menu: MenuItem): SidebarMenuItem {
  return {
    key: menu.key,
    title: menu.title,
    path: menu.path,
    icon: menu.icon,
    badge: menu.badge,
    group: menu.group,
    disabled: menu.disabled,
    defaultExpanded: menu.defaultExpanded,
    i18nKey: menu.i18nKey,
    hidden: menu.hidden,
    permissions: menu.permissions,
    roles: menu.roles,
    children: menu.children?.map((child) => convertMenuItem(child)),
  };
}

/**
 * 转换菜单列表
 * @param menus - API 菜单列表
 * @returns 转换后的 Sidebar 菜单列表
 */
export function convertMenuItems(menus: MenuItem[]): SidebarMenuItem[] {
  return menus.map((menu) => convertMenuItem(menu));
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
