import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed, watch } from 'vue';

/**
 * 主题颜色配置
 */
export interface ThemeColors {
  /** 主色 */
  primary: string;
  /** 主色前景 */
  primaryForeground: string;
  /** 次要色 */
  secondary: string;
  /** 次要色前景 */
  secondaryForeground: string;
  /** 强调色 */
  accent: string;
  /** 强调色前景 */
  accentForeground: string;
  /** 背景色 */
  background: string;
  /** 前景色 */
  foreground: string;
  /** 卡片色 */
  card: string;
  /** 卡片前景色 */
  cardForeground: string;
  /** 弹窗色 */
  popover: string;
  /** 弹窗前景色 */
  popoverForeground: string;
  /** 静音色 */
  muted: string;
  /** 静音前景色 */
  mutedForeground: string;
  /** 边框色 */
  border: string;
  /** 输入框色 */
  input: string;
  /** 圆环色 */
  ring: string;
  /** 危险色 */
  destructive: string;
}

/**
 * 预设主题
 */
export const presetThemes: Record<string, { name: string; colors: { light: ThemeColors; dark: ThemeColors } }> = {
  default: {
    name: '默认',
    colors: {
      light: {
        primary: 'oklch(0.205 0 0)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.97 0 0)',
        accentForeground: 'oklch(0.205 0 0)',
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
        ring: 'oklch(0.708 0 0)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.922 0 0)',
        primaryForeground: 'oklch(0.205 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.269 0 0)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.556 0 0)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  blue: {
    name: '蓝色',
    colors: {
      light: {
        primary: 'oklch(0.546 0.245 262.881)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.546 0.245 262.881)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.546 0.245 262.881)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.546 0.245 262.881)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.546 0.245 262.881)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.546 0.245 262.881)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  green: {
    name: '绿色',
    colors: {
      light: {
        primary: 'oklch(0.527 0.154 150.069)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.527 0.154 150.069)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.527 0.154 150.069)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.527 0.154 150.069)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.527 0.154 150.069)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.527 0.154 150.069)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  purple: {
    name: '紫色',
    colors: {
      light: {
        primary: 'oklch(0.558 0.288 302.321)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.558 0.288 302.321)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.558 0.288 302.321)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.558 0.288 302.321)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.558 0.288 302.321)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.558 0.288 302.321)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  orange: {
    name: '橙色',
    colors: {
      light: {
        primary: 'oklch(0.646 0.222 41.116)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.646 0.222 41.116)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.646 0.222 41.116)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.646 0.222 41.116)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.646 0.222 41.116)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.646 0.222 41.116)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  red: {
    name: '红色',
    colors: {
      light: {
        primary: 'oklch(0.577 0.245 27.325)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.577 0.245 27.325)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.577 0.245 27.325)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.577 0.245 27.325)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.577 0.245 27.325)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.577 0.245 27.325)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  pink: {
    name: '粉色',
    colors: {
      light: {
        primary: 'oklch(0.606 0.285 349.5)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.606 0.285 349.5)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.606 0.285 349.5)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.606 0.285 349.5)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.606 0.285 349.5)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.606 0.285 349.5)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  teal: {
    name: '青绿',
    colors: {
      light: {
        primary: 'oklch(0.6 0.118 184.704)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.6 0.118 184.704)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.6 0.118 184.704)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.6 0.118 184.704)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.6 0.118 184.704)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.6 0.118 184.704)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  indigo: {
    name: '靛蓝',
    colors: {
      light: {
        primary: 'oklch(0.511 0.262 276.5)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.511 0.262 276.5)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.511 0.262 276.5)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.511 0.262 276.5)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.511 0.262 276.5)',
        accentForeground: 'oklch(0.985 0 0)',
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
        ring: 'oklch(0.511 0.262 276.5)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  yellow: {
    name: '黄色',
    colors: {
      light: {
        primary: 'oklch(0.769 0.188 70.08)',
        primaryForeground: 'oklch(0.205 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.769 0.188 70.08)',
        accentForeground: 'oklch(0.205 0 0)',
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
        ring: 'oklch(0.769 0.188 70.08)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.769 0.188 70.08)',
        primaryForeground: 'oklch(0.205 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.769 0.188 70.08)',
        accentForeground: 'oklch(0.205 0 0)',
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
        ring: 'oklch(0.769 0.188 70.08)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  cyan: {
    name: '青色',
    colors: {
      light: {
        primary: 'oklch(0.696 0.17 162.48)',
        primaryForeground: 'oklch(0.205 0 0)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.696 0.17 162.48)',
        accentForeground: 'oklch(0.205 0 0)',
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
        ring: 'oklch(0.696 0.17 162.48)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.696 0.17 162.48)',
        primaryForeground: 'oklch(0.205 0 0)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.696 0.17 162.48)',
        accentForeground: 'oklch(0.205 0 0)',
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
        ring: 'oklch(0.696 0.17 162.48)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
  amber: {
    name: '琥珀金',
    colors: {
      light: {
        primary: 'oklch(0.75 0.18 85)',
        primaryForeground: 'oklch(0.25 0.05 85)',
        secondary: 'oklch(0.97 0 0)',
        secondaryForeground: 'oklch(0.205 0 0)',
        accent: 'oklch(0.75 0.18 85)',
        accentForeground: 'oklch(0.25 0.05 85)',
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
        ring: 'oklch(0.75 0.18 85)',
        destructive: 'oklch(0.577 0.245 27.325)',
      },
      dark: {
        primary: 'oklch(0.75 0.18 85)',
        primaryForeground: 'oklch(0.25 0.05 85)',
        secondary: 'oklch(0.269 0 0)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.75 0.18 85)',
        accentForeground: 'oklch(0.25 0.05 85)',
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
        ring: 'oklch(0.75 0.18 85)',
        destructive: 'oklch(0.704 0.191 22.216)',
      },
    },
  },
};

/**
 * 布局配置
 */
export interface LayoutConfig {
  /** 侧边栏宽度 */
  sidebarWidth: number;
  /** 侧边栏折叠宽度 */
  sidebarCollapsedWidth: number;
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 头部高度 */
  headerHeight: number;
  /** 圆角大小 */
  radius: number;
  /** 字体大小 */
  fontSize: 'sm' | 'base' | 'lg';
  /** 动画开关 */
  animations: boolean;
  /** 是否显示标签栏 */
  showTabBar: boolean;
  /** 是否显示面包屑 */
  showBreadcrumb: boolean;
}

/**
 * 默认布局配置
 */
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

export const useThemeStore = defineStore(
  'theme',
  () => {
    /** 当前主题 */
    const currentTheme = ref<string>('default');
    /** 当前模式 */
    const currentMode = ref<'light' | 'dark'>('light');
    /** 布局配置 */
    const layoutConfig = ref<LayoutConfig>({ ...defaultLayoutConfig });

    /** 当前主题颜色 */
    const currentColors = computed(() => {
      const theme = presetThemes[currentTheme.value];
      return theme?.colors[currentMode.value] || presetThemes.default?.colors.light;
    });

    /** 所有可用主题 */
    const availableThemes = computed(() => {
      return Object.entries(presetThemes).map(([key, value]) => ({
        key,
        name: value.name,
      }));
    });

    /**
     * 应用主题颜色到 CSS 变量
     */
    const applyThemeColors = () => {
      const colors = currentColors.value;
      if (!colors) return;
      const root = document.documentElement;

      root.style.setProperty('--primary', colors.primary);
      root.style.setProperty('--primary-foreground', colors.primaryForeground);
      root.style.setProperty('--secondary', colors.secondary);
      root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
      root.style.setProperty('--accent', colors.accent);
      root.style.setProperty('--accent-foreground', colors.accentForeground);
      root.style.setProperty('--background', colors.background);
      root.style.setProperty('--foreground', colors.foreground);
      root.style.setProperty('--card', colors.card);
      root.style.setProperty('--card-foreground', colors.cardForeground);
      root.style.setProperty('--popover', colors.popover);
      root.style.setProperty('--popover-foreground', colors.popoverForeground);
      root.style.setProperty('--muted', colors.muted);
      root.style.setProperty('--muted-foreground', colors.mutedForeground);
      root.style.setProperty('--border', colors.border);
      root.style.setProperty('--input', colors.input);
      root.style.setProperty('--ring', colors.ring);
      root.style.setProperty('--destructive', colors.destructive);
    };

    /**
     * 应用布局配置
     */
    const applyLayoutConfig = () => {
      const config = layoutConfig.value;
      const root = document.documentElement;

      root.style.setProperty('--radius', `${config.radius}rem`);
      root.style.setProperty('--sidebar-width', `${config.sidebarWidth}px`);
      root.style.setProperty('--sidebar-collapsed-width', `${config.sidebarCollapsedWidth}px`);
      root.style.setProperty('--header-height', `${config.headerHeight}px`);

      // 应用字体大小
      const fontSizeMap = {
        sm: '14px',
        base: '16px',
        lg: '18px',
      };
      root.style.setProperty('--font-size-base', fontSizeMap[config.fontSize]);

      // 应用动画开关
      if (config.animations) {
        root.classList.remove('reduce-motion');
      } else {
        root.classList.add('reduce-motion');
      }
    };

    /**
     * 设置主题
     */
    const setTheme = (theme: string) => {
      if (presetThemes[theme]) {
        currentTheme.value = theme;
        applyThemeColors();
      }
    };

    /**
     * 设置模式
     */
    const setMode = (mode: 'light' | 'dark') => {
      currentMode.value = mode;
      document.documentElement.classList.toggle('dark', mode === 'dark');
      applyThemeColors();
    };

    /**
     * 切换模式（支持 view-transition）
     */
    const toggleMode = async () => {
      const newMode = currentMode.value === 'light' ? 'dark' : 'light';
      
      // 检查是否支持 view-transition API
      if ('startViewTransition' in document) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transition = (document as any).startViewTransition(() => {
          setMode(newMode);
        });
        
        await transition.ready;
        
        // 添加自定义动画效果
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
        // 降级处理：直接切换
        setMode(newMode);
      }
    };

    /**
     * 更新布局配置
     */
    const updateLayoutConfig = (config: Partial<LayoutConfig>) => {
      layoutConfig.value = { ...layoutConfig.value, ...config };
      applyLayoutConfig();
    };

    /**
     * 重置布局配置
     */
    const resetLayoutConfig = () => {
      layoutConfig.value = { ...defaultLayoutConfig };
      applyLayoutConfig();
    };

    // 初始化
    const init = () => {
      applyThemeColors();
      applyLayoutConfig();
    };

    // 监听主题变化
    watch([currentTheme, currentMode], () => {
      applyThemeColors();
    }, { immediate: true });

    // 监听布局配置变化
    watch(layoutConfig, () => {
      applyLayoutConfig();
    }, { deep: true, immediate: true });

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
      key: 'app-theme-config',
      paths: ['currentTheme', 'currentMode', 'layoutConfig'],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot));
}
