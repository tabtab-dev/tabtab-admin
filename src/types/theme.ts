/**
 * 主题类型定义
 */

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
}

export interface LayoutConfig {
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  sidebarCollapsed: boolean;
  headerHeight: number;
  radius: number;
  fontSize: 'sm' | 'base' | 'lg';
  animations: boolean;
  showTabBar: boolean;
  showBreadcrumb: boolean;
  fixedTabBar: boolean;
}

export interface PresetTheme {
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}
