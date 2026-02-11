import { defineStore, acceptHMRUpdate } from 'pinia';
import { shallowRef } from 'vue';
import { THEME_MODE, STORAGE_KEYS } from '@/constants/common';
import { customThemeConfigs, customLayoutConfig, exportedUserConfig } from '@/config/theme.config';
import type { ThemeColors, LayoutConfig, PresetTheme } from '@/types/theme';

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

// 默认主题色配置（只定义每个主题特有的颜色）
// 基于 OKLCH 色彩空间优化，确保 WCAG 2.1 AA 级对比度和视觉美感
const defaultThemeConfigs: Record<string, { name: string; primary: string; primaryForeground?: string; accent?: string; accentForeground?: string; darkPrimary?: string }> = {
  // 中性色系 - 经典专业
  default: { name: '默认', primary: 'oklch(0.205 0 0)', primaryForeground: 'oklch(0.985 0 0)', darkPrimary: 'oklch(0.65 0 0)' },
  slate: { name: '岩灰', primary: 'oklch(0.55 0.04 260)', primaryForeground: 'oklch(0.985 0 0)' },
  stone: { name: '石色', primary: 'oklch(0.55 0.02 80)', primaryForeground: 'oklch(0.985 0 0)' },

  // 红色系 - 警告/重要
  red: { name: '红色', primary: 'oklch(0.55 0.22 25)', primaryForeground: 'oklch(0.985 0 0)' },
  rose: { name: '玫瑰', primary: 'oklch(0.58 0.18 15)', primaryForeground: 'oklch(0.985 0 0)' },

  // 橙色系 - 活力/温暖
  orange: { name: '橙色', primary: 'oklch(0.62 0.18 45)', primaryForeground: 'oklch(0.985 0 0)' },
  amber: { name: '琥珀', primary: 'oklch(0.72 0.16 75)', primaryForeground: 'oklch(0.25 0 0)' },

  // 黄色系 - 注意/乐观
  yellow: { name: '黄色', primary: 'oklch(0.78 0.17 85)', primaryForeground: 'oklch(0.25 0 0)' },

  // 绿色系 - 成功/自然
  lime: { name: '青柠', primary: 'oklch(0.72 0.2 125)', primaryForeground: 'oklch(0.25 0 0)' },
  green: { name: '绿色', primary: 'oklch(0.55 0.15 145)', primaryForeground: 'oklch(0.985 0 0)' },
  emerald: { name: '翠绿', primary: 'oklch(0.58 0.16 160)', primaryForeground: 'oklch(0.985 0 0)' },
  teal: { name: '青绿', primary: 'oklch(0.55 0.12 185)', primaryForeground: 'oklch(0.985 0 0)' },

  // 青色系 - 科技/未来
  cyan: { name: '青色', primary: 'oklch(0.65 0.14 195)', primaryForeground: 'oklch(0.25 0 0)' },
  sky: { name: '天空', primary: 'oklch(0.62 0.13 225)', primaryForeground: 'oklch(0.25 0 0)' },

  // 蓝色系 - 专业/可靠
  blue: { name: '蓝色', primary: 'oklch(0.55 0.2 260)', primaryForeground: 'oklch(0.985 0 0)' },
  indigo: { name: '靛蓝', primary: 'oklch(0.52 0.18 275)', primaryForeground: 'oklch(0.985 0 0)' },

  // 紫色系 - 创意/奢华
  violet: { name: '紫罗兰', primary: 'oklch(0.58 0.2 285)', primaryForeground: 'oklch(0.985 0 0)' },
  purple: { name: '紫色', primary: 'oklch(0.55 0.22 300)', primaryForeground: 'oklch(0.985 0 0)' },
  fuchsia: { name: '洋红', primary: 'oklch(0.6 0.22 325)', primaryForeground: 'oklch(0.985 0 0)' },

  // 粉色系 - 温柔/浪漫
  pink: { name: '粉色', primary: 'oklch(0.62 0.2 355)', primaryForeground: 'oklch(0.985 0 0)' },
};

/**
 * 合并默认配置、自定义配置文件配置和导出的用户配置
 */
const themeConfigs: Record<string, { name: string; primary: string; primaryForeground?: string; accent?: string; accentForeground?: string; darkPrimary?: string }> = {
  ...defaultThemeConfigs,
  ...customThemeConfigs,
  ...exportedUserConfig.themeConfigs,
};

// 生成完整主题配置
function generateThemeColors(config: typeof themeConfigs[string]): { light: ThemeColors; dark: ThemeColors } {
  const primary = config.primary;
  const darkPrimary = config.darkPrimary || primary;
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
      primary: darkPrimary,
      primaryForeground,
      accent: config.darkPrimary ? darkPrimary : accent,
      accentForeground,
      ring: darkPrimary,
    },
  };
}

// 生成预设主题
export const presetThemes: Record<string, PresetTheme> = Object.fromEntries(
  Object.entries(themeConfigs).map(([key, config]) => [
    key,
    { name: config.name, colors: generateThemeColors(config) },
  ])
);

/**
 * 默认布局配置
 */
const baseLayoutConfig: LayoutConfig = {
  sidebarWidth: 280,
  sidebarCollapsedWidth: 72,
  sidebarCollapsed: false,
  headerHeight: 56,
  radius: 0.625,
  fontSize: 'base',
  animations: true,
  showTabBar: true,
  showBreadcrumb: true,
  fixedTabBar: false,
};

/**
 * 合并后的默认布局配置（包含配置文件中的自定义配置）
 */
export const defaultLayoutConfig: LayoutConfig = {
  ...baseLayoutConfig,
  ...customLayoutConfig,
  ...exportedUserConfig.layoutConfig,
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
    const layoutConfig = shallowRef<LayoutConfig>({ ...defaultLayoutConfig });

    const currentColors = computed(() => {
      const theme = presetThemes[currentTheme.value];
      return theme?.colors[currentMode.value] || presetThemes.default.colors.light;
    });

    const availableThemes = computed(() =>
      Object.entries(presetThemes).map(([key, value]) => ({
        key,
        name: value.name,
        primaryColor: value.colors.light.primary,
      }))
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
        const transition = (document as Document & { startViewTransition: (callback: () => void) => { ready: Promise<void> } }).startViewTransition(() => setMode(newMode));
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
