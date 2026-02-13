import type { LayoutConfig } from '@/types/theme';

/**
 * 主题配置
 * 可从设置页面复制 JSON 直接替换下面的值
 * 
 * 可用主题: default, slate, stone, red, rose, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink
 * 可用模式: light, dark
 */
export const themeConfig = {
  theme: 'lime',
  mode: 'light' as 'light' | 'dark',
  layout: {
    sidebarWidth: 280,
    sidebarCollapsed: false,
    radius: 0.625,
    fontSize: 'base' as 'sm' | 'base' | 'lg',
    animations: true,
    showTabBar: true,
    showBreadcrumb: true,
    fixedTabBar: false,
  } as Partial<LayoutConfig>,
  customThemes: {} as Record<string, {
    name: string;
    primary: string;
    primaryForeground?: string;
    accent?: string;
    accentForeground?: string;
    darkPrimary?: string;
  }>,
};
