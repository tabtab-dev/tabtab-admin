import { defineStore, acceptHMRUpdate } from 'pinia';
import { THEME_MODE, STORAGE_KEYS } from '@/constants/common';

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

// 基础亮色颜色（所有主题共享）
const baseLightColors = {
  secondary: 'oklch(0.97 0 0)',
  secondaryForeground: 'oklch(0.205 0 0)',
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: 'oklch(1 0 0)',
  cardForeground: 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.145 0 0)',
  muted: 'oklch(0.97 0 0)',
  mutedForeground: 'oklch(0.556 0 0)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
};

// 基础暗色颜色（所有主题共享）
const baseDarkColors = {
  secondary: 'oklch(0.269 0 0)',
  secondaryForeground: 'oklch(0.985 0 0)',
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  cardForeground: 'oklch(0.985 0 0)',
  popover: 'oklch(0.205 0 0)',
  popoverForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  destructive: 'oklch(0.704 0.191 22.216)',
};

// 主题色配置（只定义每个主题特有的颜色）
const themeConfigs: Record<string, { name: string; primary: string; primaryForeground?: string; accent?: string; accentForeground?: string }> = {
  default: { name: '默认', primary: 'oklch(0.205 0 0)', primaryForeground: 'oklch(0.985 0 0)' },
  blue: { name: '蓝色', primary: 'oklch(0.546 0.245 262.881)' },
  green: { name: '绿色', primary: 'oklch(0.527 0.154 150.069)' },
  purple: { name: '紫色', primary: 'oklch(0.558 0.288 302.321)' },
  orange: { name: '橙色', primary: 'oklch(0.646 0.222 41.116)' },
  red: { name: '红色', primary: 'oklch(0.577 0.245 27.325)' },
  pink: { name: '粉色', primary: 'oklch(0.606 0.285 349.5)' },
  teal: { name: '青绿', primary: 'oklch(0.6 0.118 184.704)' },
  indigo: { name: '靛蓝', primary: 'oklch(0.511 0.262 276.5)' },
  yellow: { name: '黄色', primary: 'oklch(0.769 0.188 70.08)', primaryForeground: 'oklch(0.205 0 0)' },
  cyan: { name: '青色', primary: 'oklch(0.696 0.17 162.48)', primaryForeground: 'oklch(0.205 0 0)' },
  amber: { name: '琥珀金', primary: 'oklch(0.75 0.18 85)', primaryForeground: 'oklch(0.25 0.05 85)' },
};

// 生成完整主题配置
function generateThemeColors(config: typeof themeConfigs[string]): { light: ThemeColors; dark: ThemeColors } {
  const primary = config.primary;
  const primaryForeground = config.primaryForeground || 'oklch(0.985 0 0)';
  const accent = config.accent || primary;
  const accentForeground = config.accentForeground || primaryForeground;

  return {
    light: {
      ...baseLightColors,
      primary,
      primaryForeground,
      accent,
      accentForeground,
      ring: primary,
    },
    dark: {
      ...baseDarkColors,
      primary,
      primaryForeground,
      accent,
      accentForeground,
      ring: primary,
    },
  };
}

// 生成预设主题
export const presetThemes: Record<string, { name: string; colors: { light: ThemeColors; dark: ThemeColors } }> = Object.fromEntries(
  Object.entries(themeConfigs).map(([key, config]) => [
    key,
    { name: config.name, colors: generateThemeColors(config) },
  ])
);

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
}

export const defaultLayoutConfig: LayoutConfig = {
  sidebarWidth: 280,
  sidebarCollapsedWidth: 72,
  sidebarCollapsed: false,
  headerHeight: 56,
  radius: 0.625,
  fontSize: 'base',
  animations: true,
  showTabBar: true,
  showBreadcrumb: true,
};

const cssVarMap: Record<keyof ThemeColors, string> = {
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  destructive: '--destructive',
};

export const useThemeStore = defineStore(
  'theme',
  () => {
    const currentTheme = ref<string>('default');
    const currentMode = ref<'light' | 'dark'>(THEME_MODE.LIGHT);
    const layoutConfig = ref<LayoutConfig>({ ...defaultLayoutConfig });

    const currentColors = computed(() => {
      const theme = presetThemes[currentTheme.value];
      return theme?.colors[currentMode.value] || presetThemes.default.colors.light;
    });

    const availableThemes = computed(() =>
      Object.entries(presetThemes).map(([key, value]) => ({ key, name: value.name }))
    );

    const applyThemeColors = () => {
      const colors = currentColors.value;
      if (!colors) return;
      const root = document.documentElement;

      Object.entries(cssVarMap).forEach(([key, cssVar]) => {
        root.style.setProperty(cssVar, colors[key as keyof ThemeColors]);
      });
    };

    const applyLayoutConfig = () => {
      const config = layoutConfig.value;
      const root = document.documentElement;

      root.style.setProperty('--radius', `${config.radius}rem`);
      root.style.setProperty('--sidebar-width', `${config.sidebarWidth}px`);
      root.style.setProperty('--sidebar-collapsed-width', `${config.sidebarCollapsedWidth}px`);
      root.style.setProperty('--header-height', `${config.headerHeight}px`);

      const fontSizeMap = { sm: '14px', base: '16px', lg: '18px' };
      root.style.setProperty('--font-size-base', fontSizeMap[config.fontSize]);

      root.classList.toggle('reduce-motion', !config.animations);
    };

    const setTheme = (theme: string) => {
      if (presetThemes[theme]) {
        currentTheme.value = theme;
        applyThemeColors();
      }
    };

    const setMode = (mode: 'light' | 'dark') => {
      currentMode.value = mode;
      document.documentElement.classList.toggle('dark', mode === THEME_MODE.DARK);
      applyThemeColors();
    };

    const toggleMode = async () => {
      const newMode = currentMode.value === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;

      if ('startViewTransition' in document) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transition = (document as any).startViewTransition(() => setMode(newMode));
        await transition.ready;

        document.documentElement.animate(
          [
            { clipPath: 'circle(0% at 50% 50%)' },
            { clipPath: 'circle(150% at 50% 50%)' },
          ],
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      } else {
        setMode(newMode);
      }
    };

    const updateLayoutConfig = (config: Partial<LayoutConfig>) => {
      layoutConfig.value = { ...layoutConfig.value, ...config };
      applyLayoutConfig();
    };

    const resetLayoutConfig = () => {
      layoutConfig.value = { ...defaultLayoutConfig };
      applyLayoutConfig();
    };

    const init = () => {
      applyThemeColors();
      applyLayoutConfig();
    };

    watch([currentTheme, currentMode], applyThemeColors, { immediate: true });
    watch(layoutConfig, applyLayoutConfig, { deep: true, immediate: true });

    return {
      currentTheme,
      currentMode,
      layoutConfig,
      currentColors,
      availableThemes,
      setTheme,
      setMode,
      toggleMode,
      updateLayoutConfig,
      resetLayoutConfig,
      init,
    };
  },
  {
    persist: {
      key: STORAGE_KEYS.THEME,
      pick: ['currentTheme', 'currentMode', 'layoutConfig'],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot));
}
