/**
 * 主题配置文件
 * 用户可以在此文件中自定义主题配置
 * 复制 ThemeSettings.vue 中导出的配置内容替换此文件即可
 */

import type { LayoutConfig } from '@/types/theme';

/**
 * 自定义主题色配置
 * 可以添加新的主题或覆盖默认主题的颜色
 */
export const customThemeConfigs: Record<string, { 
  name: string; 
  primary: string; 
  primaryForeground?: string; 
  accent?: string; 
  accentForeground?: string; 
  darkPrimary?: string;
}> = {
  // 示例：自定义主题
  // myTheme: { 
  //   name: '我的主题', 
  //   primary: 'oklch(0.6 0.2 250)', 
  //   primaryForeground: 'oklch(0.985 0 0)' 
  // },
};

/**
 * 自定义布局配置
 * 覆盖默认布局配置
 */
export const customLayoutConfig: Partial<LayoutConfig> = {
  // 示例：自定义布局
  // sidebarWidth: 300,
  // radius: 0.75,
  // fontSize: 'lg',
};

/**
 * 从 localStorage 读取的用户配置（由 ThemeSettings.vue 导出功能生成）
 * 将此对象的内容复制到这里以持久化保存
 */
export const exportedUserConfig = {
  // 主题配置
  themeConfigs: {} as Record<string, { 
    name: string; 
    primary: string; 
    primaryForeground?: string; 
    accent?: string; 
    accentForeground?: string; 
    darkPrimary?: string;
  }>,
  
  // 布局配置
  layoutConfig: {} as Partial<LayoutConfig>,
};
