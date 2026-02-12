/**
 * 共享主题配置工具
 *
 * @description 统一 antdv-next 组件的主题配置，确保与 shadcn-vue 风格一致
 * 包括：边框、阴影、圆角、颜色等视觉元素
 */
import { useThemeStore } from '@/stores/global/theme'
import { theme as antdTheme } from 'antdv-next'
import type { ThemeConfig } from 'antdv-next'

/**
 * 颜色转换映射表
 * @description 将 oklch 颜色值映射到 hex 格式（antdv-next 需要）
 * 注意：此映射表仅用于特殊情况，常规颜色会通过 oklchToHex 动态转换
 */
export const colorMap: Record<string, string> = {
  // 带透明度的白色变体
  'oklch(1 0 0 / 10%)': 'rgba(255, 255, 255, 0.1)',
  'oklch(1 0 0 / 15%)': 'rgba(255, 255, 255, 0.15)',
}

/**
 * 将 OKLCH 颜色空间转换为 sRGB
 * @param L - 亮度 (0-1)
 * @param C - 色度 (0-0.4 左右)
 * @param H - 色相 (0-360)
 * @returns [r, g, b] 每个值范围 0-1
 */
function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  const H_rad = (H * Math.PI) / 180

  const a = C * Math.cos(H_rad)
  const b = C * Math.sin(H_rad)

  const L_ = L + 0.3963377774 * a + 0.2158037573 * b
  const M_ = L - 0.1055613458 * a - 0.0638541728 * b
  const S_ = L - 0.0894841775 * a - 1.291485548 * b

  const L__ = L_ ** 3
  const M__ = M_ ** 3
  const S__ = S_ ** 3

  const X = 1.2269304363 * L__ - 0.55781499655 * M__ + 0.281391050177 * S__
  const Y = -0.040575762624 * L__ + 1.11228682939 * M__ - 0.071711066661 * S__
  const Z = -0.076372949746 * L__ - 0.42149332396 * M__ + 1.58692402442 * S__

  const R_lin = 3.240969941904521 * X - 1.537383177570093 * Y - 0.498610760293 * Z
  const G_lin = -0.96924363628087 * X + 1.8759675015077202 * Y + 0.041555057407175 * Z
  const B_lin = 0.055630079696993 * X - 0.20397695888897 * Y + 1.0569715142428786 * Z

  const toSrgb = (v: number) => (v > 0.0031308 ? 1.055 * v ** (1 / 2.4) - 0.055 : 12.92 * v)

  return [toSrgb(R_lin), toSrgb(G_lin), toSrgb(B_lin)]
}

/**
 * 将 RGB 值转换为 Hex 字符串
 * @param r - 红色 (0-1)
 * @param g - 绿色 (0-1)
 * @param b - 蓝色 (0-1)
 * @returns Hex 颜色字符串
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    return Math.round(clamped * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * 解析 OKLCH 颜色字符串
 * @param oklchColor - oklch 格式的颜色值
 * @returns { L, C, H, alpha } 或 null
 */
function parseOklch(oklchColor: string): { L: number; C: number; H: number; alpha: number } | null {
  const match = oklchColor.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/)
  if (!match) return null

  return {
    L: parseFloat(match[1]),
    C: parseFloat(match[2]),
    H: parseFloat(match[3]),
    alpha: match[4] ? (match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4])) : 1,
  }
}

/**
 * 将 oklch 颜色转换为 hex
 * @param oklchColor - oklch 格式的颜色值
 * @returns hex 格式的颜色值
 */
export function oklchToHex(oklchColor: string): string {
  if (colorMap[oklchColor]) {
    return colorMap[oklchColor]
  }

  const parsed = parseOklch(oklchColor)
  if (!parsed) {
    return oklchColor
  }

  const { L, C, H, alpha } = parsed

  if (alpha < 1) {
    const [r, g, b] = oklchToRgb(L, C, H)
    const rInt = Math.round(Math.max(0, Math.min(1, r)) * 255)
    const gInt = Math.round(Math.max(0, Math.min(1, g)) * 255)
    const bInt = Math.round(Math.max(0, Math.min(1, b)) * 255)
    return `rgba(${rInt}, ${gInt}, ${bInt}, ${alpha})`
  }

  const [r, g, b] = oklchToRgb(L, C, H)
  return rgbToHex(r, g, b)
}

/**
 * 获取统一的阴影配置
 * @description 与 shadcn-vue 的 shadow-sm 保持一致
 */
export function getShadowConfig(isDark: boolean): {
  boxShadow: string
  boxShadowSecondary: string
  boxShadowTertiary: string
} {
  return {
    // 主阴影 - 轻微阴影，与 shadcn-vue Card 一致
    boxShadow: isDark
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    // 二级阴影 - 悬停状态
    boxShadowSecondary: isDark
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    // 三级阴影 - 弹窗/抽屉
    boxShadowTertiary: isDark
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  }
}

/**
 * 获取统一的边框配置
 * @description 与 shadcn-vue 的 border 风格一致
 */
export function getBorderConfig(borderColor: string): {
  colorBorder: string
  colorBorderSecondary: string
  colorSplit: string
  lineWidth: number
  lineType: string
} {
  return {
    colorBorder: borderColor,
    colorBorderSecondary: borderColor,
    colorSplit: borderColor,
    lineWidth: 1,
    lineType: 'solid',
  }
}

/**
 * 获取统一的圆角配置
 * @description 与 shadcn-vue 的 rounded-xl (0.75rem = 12px) 保持一致
 */
export function getRadiusConfig(radius: number): {
  borderRadius: number
  borderRadiusSM: number
  borderRadiusLG: number
  borderRadiusXL: number
} {
  const baseRadius = radius * 16 // rem 转 px
  return {
    borderRadius: baseRadius,
    borderRadiusSM: Math.max(4, baseRadius * 0.75),
    borderRadiusLG: baseRadius * 1.25,
    borderRadiusXL: baseRadius * 1.5,
  }
}

/**
 * 获取基础主题 Token
 * @description 所有 antdv-next 组件共享的基础配置
 */
export function getBaseThemeTokens(): ThemeConfig['token'] {
  const themeStore = useThemeStore()
  const colors = themeStore.currentColors
  const radius = themeStore.layoutConfig.radius
  const isDark = themeStore.currentMode === 'dark'

  const shadowConfig = getShadowConfig(isDark)
  const borderConfig = getBorderConfig(oklchToHex(colors.border))
  const radiusConfig = getRadiusConfig(radius)

  return {
    // 核心颜色
    colorPrimary: oklchToHex(colors.primary),
    colorBgContainer: oklchToHex(colors.background),
    colorBgElevated: oklchToHex(colors.card),
    colorText: oklchToHex(colors.foreground),
    colorTextSecondary: oklchToHex(colors.mutedForeground),
    colorTextTertiary: oklchToHex(colors.mutedForeground),
    colorBorder: borderConfig.colorBorder,
    colorBorderSecondary: borderConfig.colorBorderSecondary,
    colorSplit: borderConfig.colorSplit,
    colorError: oklchToHex(colors.destructive),
    colorWarning: '#f59e0b',
    colorSuccess: '#10b981',
    colorInfo: oklchToHex(colors.primary),

    // 阴影
    boxShadow: shadowConfig.boxShadow,
    boxShadowSecondary: shadowConfig.boxShadowSecondary,
    boxShadowTertiary: shadowConfig.boxShadowTertiary,

    // 圆角
    borderRadius: radiusConfig.borderRadius,
    borderRadiusSM: radiusConfig.borderRadiusSM,
    borderRadiusLG: radiusConfig.borderRadiusLG,
    borderRadiusXL: radiusConfig.borderRadiusXL,

    // 边框
    lineWidth: borderConfig.lineWidth,
    lineType: borderConfig.lineType,

    // 间距 - 与 shadcn-vue 保持一致
    paddingSM: 8,
    padding: 12,
    paddingMD: 16,
    paddingLG: 20,
    paddingXL: 24,
    marginSM: 8,
    margin: 12,
    marginMD: 16,
    marginLG: 20,
    marginXL: 24,
    marginXXL: 32,

    // 字体大小
    fontSizeSM: 12,
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 18,

    // 行高
    lineHeight: 1.5,
    lineHeightSM: 1.25,
    lineHeightLG: 1.75,

    // 动画
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  }
}

/**
 * 获取共享的组件配置
 * @description 所有 antdv-next 组件共享的组件级配置
 */
export function getSharedComponentConfig(colors: ReturnType<typeof useThemeStore>['currentColors']): ThemeConfig['components'] {
  const isDark = useThemeStore().currentMode === 'dark'
  const shadowConfig = getShadowConfig(isDark)

  return {
    // 按钮 - 统一边框和阴影
    Button: {
      colorPrimary: oklchToHex(colors.primary),
      colorPrimaryHover: oklchToHex(colors.primary),
      colorPrimaryActive: oklchToHex(colors.primary),
      colorText: oklchToHex(colors.foreground),
      colorBgContainer: oklchToHex(colors.background),
      colorBorder: oklchToHex(colors.border),
      boxShadow: 'none',
      boxShadowSecondary: shadowConfig.boxShadow,
    },
    // 输入框 - 统一边框
    Input: {
      colorBorder: oklchToHex(colors.input),
      colorBgContainer: oklchToHex(colors.background),
      colorText: oklchToHex(colors.foreground),
      colorTextPlaceholder: oklchToHex(colors.mutedForeground),
      activeShadow: 'none',
    },
    // 选择器
    Select: {
      colorBorder: oklchToHex(colors.border),
      colorBgContainer: oklchToHex(colors.background),
      colorText: oklchToHex(colors.foreground),
      colorTextPlaceholder: oklchToHex(colors.mutedForeground),
      colorBgElevated: oklchToHex(colors.popover),
      boxShadow: shadowConfig.boxShadow,
    },
    // 卡片 - 统一阴影
    Card: {
      colorBgContainer: oklchToHex(colors.card),
      colorText: oklchToHex(colors.foreground),
      colorBorder: oklchToHex(colors.border),
      boxShadow: shadowConfig.boxShadow,
      boxShadowSecondary: shadowConfig.boxShadowSecondary,
    },
    // 弹窗
    Modal: {
      colorBgElevated: oklchToHex(colors.card),
      colorText: oklchToHex(colors.foreground),
      colorTextHeading: oklchToHex(colors.foreground),
      colorBorder: oklchToHex(colors.border),
      boxShadow: shadowConfig.boxShadowTertiary,
    },
    // 抽屉
    Drawer: {
      colorBgContainer: oklchToHex(colors.background),
      colorText: oklchToHex(colors.foreground),
      colorBgElevated: oklchToHex(colors.card),
      colorTextHeading: oklchToHex(colors.foreground),
      colorIcon: oklchToHex(colors.mutedForeground),
      colorIconHover: oklchToHex(colors.foreground),
      colorBorder: oklchToHex(colors.border),
      boxShadow: shadowConfig.boxShadowTertiary,
    },
    // 表格
    Table: {
      colorBgContainer: oklchToHex(colors.background),
      colorText: oklchToHex(colors.foreground),
      colorTextHeading: oklchToHex(colors.foreground),
      colorBorder: oklchToHex(colors.border),
      colorSplit: oklchToHex(colors.border),
      colorBgTextHover: oklchToHex(colors.muted),
      colorFillAlter: oklchToHex(colors.muted),
      colorFillContent: oklchToHex(colors.card),
    },
    // 分页
    Pagination: {
      colorBgContainer: oklchToHex(colors.background),
      colorBgTextHover: oklchToHex(colors.muted),
      colorText: oklchToHex(colors.foreground),
      colorTextDisabled: oklchToHex(colors.mutedForeground),
      colorBorder: oklchToHex(colors.border),
      colorPrimary: oklchToHex(colors.primary),
    },
    // 下拉菜单
    Dropdown: {
      colorBgElevated: oklchToHex(colors.popover),
      colorText: oklchToHex(colors.foreground),
      boxShadow: shadowConfig.boxShadowSecondary,
    },
    // 菜单
    Menu: {
      colorBgContainer: oklchToHex(colors.background),
      colorText: oklchToHex(colors.foreground),
      colorItemBgHover: oklchToHex(colors.muted),
      colorItemBgSelected: oklchToHex(colors.muted),
    },
    // 标签
    Tag: {
      colorText: oklchToHex(colors.foreground),
      colorBorder: oklchToHex(colors.border),
      colorBgContainer: oklchToHex(colors.muted),
    },
    // 工具提示
    Tooltip: {
      colorBgSpotlight: oklchToHex(colors.popover),
      colorTextLightSolid: oklchToHex(colors.foreground),
    },
    // 气泡确认框
    Popconfirm: {
      colorBgElevated: oklchToHex(colors.popover),
      colorText: oklchToHex(colors.foreground),
      colorTextHeading: oklchToHex(colors.foreground),
    },
    // 复选框
    Checkbox: {
      colorPrimary: oklchToHex(colors.primary),
      colorText: oklchToHex(colors.foreground),
      colorBgContainer: oklchToHex(colors.background),
      colorBorder: oklchToHex(colors.border),
    },
    // 单选框
    Radio: {
      colorPrimary: oklchToHex(colors.primary),
      colorText: oklchToHex(colors.foreground),
    },
    // 开关
    Switch: {
      colorPrimary: oklchToHex(colors.primary),
    },
    // 日期选择器
    DatePicker: {
      colorBorder: oklchToHex(colors.border),
      colorBgContainer: oklchToHex(colors.background),
      colorText: oklchToHex(colors.foreground),
      colorBgElevated: oklchToHex(colors.popover),
      colorPrimary: oklchToHex(colors.primary),
      boxShadow: shadowConfig.boxShadowSecondary,
    },
    // 滑块
    Slider: {
      colorPrimary: oklchToHex(colors.primary),
      colorBgElevated: oklchToHex(colors.muted),
    },
    // 上传
    Upload: {
      colorText: oklchToHex(colors.foreground),
      colorTextDescription: oklchToHex(colors.mutedForeground),
    },
    // 加载中
    Spin: {
      colorPrimary: oklchToHex(colors.primary),
    },
    // 空状态
    Empty: {
      colorText: oklchToHex(colors.mutedForeground),
      colorTextDisabled: oklchToHex(colors.mutedForeground),
    },
  }
}

/**
 * 创建统一的主题配置
 * @description 所有业务组件应该使用此函数创建主题配置
 */
export function createUnifiedThemeConfig(
  componentSpecificConfig?: ThemeConfig['components']
): ThemeConfig {
  const themeStore = useThemeStore()
  const isDark = themeStore.currentMode === 'dark'
  const colors = themeStore.currentColors

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: getBaseThemeTokens(),
    components: {
      ...getSharedComponentConfig(colors),
      ...componentSpecificConfig,
    },
  }
}

export default {
  colorMap,
  oklchToHex,
  getShadowConfig,
  getBorderConfig,
  getRadiusConfig,
  getBaseThemeTokens,
  getSharedComponentConfig,
  createUnifiedThemeConfig,
}
