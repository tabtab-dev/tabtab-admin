/**
 * TModal 主题配置
 *
 * @description 将 shadcn-vue 主题映射到 antdv-next 主题 Token
 * 仅在 TModal 组件内部生效，不污染全局主题
 */
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { theme as antdTheme } from 'antdv-next'
import type { ThemeConfig } from 'antdv-next'

/**
 * 颜色转换映射表
 * @description 将 oklch 颜色值映射到 hex 格式（antdv-next 需要）
 */
const colorMap: Record<string, string> = {
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
  // 蓝色主题
  'oklch(0.546 0.245 262.881)': '#2563eb',
  // 绿色主题
  'oklch(0.527 0.154 150.069)': '#16a34a',
  // 紫色主题
  'oklch(0.558 0.288 302.321)': '#9333ea',
  // 橙色主题
  'oklch(0.646 0.222 41.116)': '#ea580c',
  // 红色主题
  'oklch(0.577 0.245 27.325)': '#dc2626',
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
  // Dark 模式背景色
  'oklch(0.205 0 0)': '#262626',
  'oklch(0.145 0 0)': '#171717',
  // Dark 模式前景色
  'oklch(0.985 0 0)': '#fafafa',
  'oklch(0.922 0 0)': '#e5e5e5',
  // Dark 模式次级背景
  'oklch(0.269 0 0)': '#404040',
  // Dark 模式边框（带透明度）
  'oklch(1 0 0 / 10%)': 'rgba(255, 255, 255, 0.1)',
  'oklch(1 0 0 / 15%)': 'rgba(255, 255, 255, 0.15)',
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
  console.warn(`[TModal Theme] 无法转换颜色: ${oklchColor}，请添加到 colorMap`)
  return oklchColor
}

/**
 * 生成 antdv-next 主题配置
 * @returns ThemeConfig 对象
 */
export function useTModalTheme(): ThemeConfig {
  const themeStore = useThemeStore()

  return computed<ThemeConfig>(() => {
    const colors = themeStore.currentColors
    const radius = themeStore.layoutConfig.radius
    const isDark = themeStore.currentMode === 'dark'

    return {
      // 根据当前模式选择算法
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        // 核心颜色
        colorPrimary: oklchToHex(colors.primary),
        colorBgContainer: oklchToHex(colors.background),
        colorBgElevated: oklchToHex(colors.card),
        colorText: oklchToHex(colors.foreground),
        colorTextSecondary: oklchToHex(colors.mutedForeground),
        colorBorder: oklchToHex(colors.border),
        colorError: oklchToHex(colors.destructive),

        // 边框圆角
        borderRadius: radius * 16, // rem 转 px
        borderRadiusSM: radius * 12,
        borderRadiusLG: radius * 20,

        // 间距
        paddingSM: 8,
        padding: 12,
        paddingMD: 16,
        paddingLG: 20,
        paddingXL: 24,

        // 字体大小
        fontSizeSM: 12,
        fontSize: 14,
        fontSizeLG: 16,
        fontSizeXL: 18,
      },
      components: {
        // Modal 弹窗组件
        Modal: {
          colorBgElevated: oklchToHex(colors.card),
          colorText: oklchToHex(colors.foreground),
          colorTextHeading: oklchToHex(colors.foreground),
          colorBorder: oklchToHex(colors.border),
          colorPrimary: oklchToHex(colors.primary),
        },
        // 按钮
        Button: {
          colorPrimary: oklchToHex(colors.primary),
          colorPrimaryHover: oklchToHex(colors.primary),
          colorPrimaryActive: oklchToHex(colors.primary),
          colorText: oklchToHex(colors.foreground),
          colorBgContainer: oklchToHex(colors.background),
          colorBorder: oklchToHex(colors.border),
        },
      },
    }
  })
}

/**
 * 静态主题配置（用于不需要响应式的场景）
 */
export function getTModalThemeConfig(): ThemeConfig {
  const themeStore = useThemeStore()
  const colors = themeStore.currentColors
  const radius = themeStore.layoutConfig.radius

  return {
    token: {
      colorPrimary: oklchToHex(colors.primary),
      colorBgContainer: oklchToHex(colors.background),
      colorBgElevated: oklchToHex(colors.card),
      colorText: oklchToHex(colors.foreground),
      colorTextSecondary: oklchToHex(colors.mutedForeground),
      colorBorder: oklchToHex(colors.border),
      colorError: oklchToHex(colors.destructive),
      borderRadius: radius * 16,
    },
  }
}

export default useTModalTheme
