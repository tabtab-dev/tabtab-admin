/**
 * TTable 主题配置
 *
 * @description 将 shadcn-vue 主题映射到 antdv-next 主题 Token
 * 使用共享主题配置确保风格统一
 */
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useThemeStore } from '@/stores/global/theme'
import { theme as antdTheme } from 'antdv-next'
import type { ThemeConfig } from 'antdv-next'
import {
  oklchToHex,
  getShadowConfig,
  getRadiusConfig,
  getSharedComponentConfig,
} from '../theme-shared'

/**
 * 生成 antdv-next 主题配置
 * @returns ComputedRef<ThemeConfig> 主题配置
 */
export function useTTableTheme(): ComputedRef<ThemeConfig> {
  const themeStore = useThemeStore()

  return computed<ThemeConfig>(() => {
    const colors = themeStore.currentColors
    const radius = themeStore.layoutConfig.radius
    const isDark = themeStore.currentMode === 'dark'

    const shadowConfig = getShadowConfig(isDark)
    const radiusConfig = getRadiusConfig(radius)
    const sharedComponents = getSharedComponentConfig(colors)

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

        // 边框圆角 - 与 shadcn-vue 保持一致
        borderRadius: radiusConfig.borderRadius,
        borderRadiusSM: radiusConfig.borderRadiusSM,
        borderRadiusLG: radiusConfig.borderRadiusLG,

        // 阴影 - 统一阴影风格
        boxShadow: shadowConfig.boxShadow,
        boxShadowSecondary: shadowConfig.boxShadowSecondary,

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
        ...sharedComponents,
        // 表格组件特定配置
        Table: {
          colorBgContainer: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          colorTextHeading: oklchToHex(colors.foreground),
          colorBorder: oklchToHex(colors.border),
          colorSplit: oklchToHex(colors.border),
          colorBgTextHover: oklchToHex(colors.muted),
          colorFillAlter: oklchToHex(colors.muted),
          colorFillContent: oklchToHex(colors.card),
          // 统一边框和阴影
          boxShadow: shadowConfig.boxShadow,
          borderRadius: radiusConfig.borderRadius,
        },
        // 分页器
        Pagination: {
          colorBgContainer: oklchToHex(colors.background),
          colorBgTextHover: oklchToHex(colors.muted),
          colorText: oklchToHex(colors.foreground),
          colorTextDisabled: oklchToHex(colors.mutedForeground),
          colorBorder: oklchToHex(colors.border),
          colorPrimary: oklchToHex(colors.primary),
          borderRadius: radiusConfig.borderRadius,
        },
      },
    }
  })
}

/**
 * 静态主题配置（用于不需要响应式的场景）
 */
export function getTTableThemeConfig(): ThemeConfig {
  const themeStore = useThemeStore()
  const colors = themeStore.currentColors
  const radius = themeStore.layoutConfig.radius
  const isDark = themeStore.currentMode === 'dark'
  const shadowConfig = getShadowConfig(isDark)
  const radiusConfig = getRadiusConfig(radius)

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: oklchToHex(colors.primary),
      colorBgContainer: oklchToHex(colors.background),
      colorBgElevated: oklchToHex(colors.card),
      colorText: oklchToHex(colors.foreground),
      colorTextSecondary: oklchToHex(colors.mutedForeground),
      colorBorder: oklchToHex(colors.border),
      colorError: oklchToHex(colors.destructive),
      borderRadius: radiusConfig.borderRadius,
      boxShadow: shadowConfig.boxShadow,
    },
    components: {
      Table: {
        colorBgContainer: oklchToHex(colors.background),
        colorText: oklchToHex(colors.foreground),
        colorTextHeading: oklchToHex(colors.foreground),
        colorBorder: oklchToHex(colors.border),
        colorSplit: oklchToHex(colors.border),
        colorBgTextHover: oklchToHex(colors.muted),
        colorFillAlter: oklchToHex(colors.muted),
        colorFillContent: oklchToHex(colors.card),
        boxShadow: shadowConfig.boxShadow,
        borderRadius: radiusConfig.borderRadius,
      },
    },
  }
}

export default useTTableTheme
