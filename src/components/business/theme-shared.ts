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
 */
export const colorMap: Record<string, string> = {
  // 默认主题 - 浅色模式
  'oklch(0.205 0 0)': '#171717',
  'oklch(0.985 0 0)': '#fafafa',
  'oklch(0.97 0 0)': '#f5f5f5',
  'oklch(0.145 0 0)': '#262626',
  'oklch(1 0 0)': '#ffffff',
  'oklch(0.556 0 0)': '#737373',
  'oklch(0.922 0 0)': '#e5e5e5',
  'oklch(0.708 0 0)': '#a3a3a3',
  'oklch(0.577 0.245 27.325)': '#dc2626',
  'oklch(0.269 0 0)': '#404040',
  // 默认主题 - 暗黑模式专用
  'oklch(0.65 0 0)': '#a1a1a1',
  // 蓝色主题
  'oklch(0.546 0.245 262.881)': '#2563eb',
  // 绿色主题
  'oklch(0.527 0.154 150.069)': '#16a34a',
  // 紫色主题
  'oklch(0.558 0.288 302.321)': '#9333ea',
  // 橙色主题
  'oklch(0.646 0.222 41.116)': '#ea580c',
  // 粉色主题
  'oklch(0.606 0.285 349.5)': '#db2777',
  // 青绿主题
  'oklch(0.6 0.118 184.704)': '#0891b2',
  // 靛蓝主题
  'oklch(0.511 0.262 276.5)': '#4f46e5',
  // 黄色主题
  'oklch(0.769 0.188 70.08)': '#ca8a04',
  // 青色主题
  'oklch(0.696 0.17 162.48)': '#059669',
  // 琥珀金主题
  'oklch(0.75 0.18 85)': '#d97706',
  // 带透明度的白色变体
  'oklch(1 0 0 / 10%)': 'rgba(255, 255, 255, 0.1)',
  'oklch(1 0 0 / 15%)': 'rgba(255, 255, 255, 0.15)',
  // 红色变体（用于错误/危险状态）
  'oklch(0.704 0.191 22.216)': '#ef4444',
}

/**
 * 将 oklch 颜色转换为 hex
 * @param oklchColor - oklch 格式的颜色值
 * @returns hex 格式的颜色值
 */
export function oklchToHex(oklchColor: string): string {
  // 直接查找映射表
  if (colorMap[oklchColor]) {
    return colorMap[oklchColor]
  }

  // 处理带透明度的颜色
  if (oklchColor.includes('/')) {
    const baseColor = oklchColor.split(' /')[0].trim()
    if (colorMap[baseColor]) {
      return colorMap[baseColor]
    }
  }

  // 如果无法转换，返回原始值（antdv 可能无法识别，但不会报错）
  console.warn(`[Theme] 无法转换颜色: ${oklchColor}，请添加到 colorMap`)
  return oklchColor
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
