/**
 * TModal 主题配置
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
export function useTModalTheme(): ComputedRef<ThemeConfig> {
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

        // 阴影 - 弹窗使用三级阴影
        boxShadow: shadowConfig.boxShadowTertiary,
        boxShadowSecondary: shadowConfig.boxShadowTertiary,

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
        // Modal 弹窗组件特定配置
        Modal: {
          colorBgElevated: oklchToHex(colors.card),
          colorText: oklchToHex(colors.foreground),
          colorTextHeading: oklchToHex(colors.foreground),
          colorBorder: oklchToHex(colors.border),
          colorPrimary: oklchToHex(colors.primary),
          // 统一阴影和圆角
          borderRadius: radiusConfig.borderRadiusLG,
          boxShadow: shadowConfig.boxShadowTertiary,
        },
        // 按钮
        Button: {
          colorPrimary: oklchToHex(colors.primary),
          colorPrimaryHover: oklchToHex(colors.primary),
          colorPrimaryActive: oklchToHex(colors.primary),
          colorText: oklchToHex(colors.foreground),
          colorBgContainer: oklchToHex(colors.background),
          colorBorder: oklchToHex(colors.border),
          boxShadow: 'none',
          borderRadius: radiusConfig.borderRadius,
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
      borderRadius: radiusConfig.borderRadiusLG,
      boxShadow: shadowConfig.boxShadowTertiary,
    },
    components: {
      Modal: {
        colorBgElevated: oklchToHex(colors.card),
        colorText: oklchToHex(colors.foreground),
        colorTextHeading: oklchToHex(colors.foreground),
        colorBorder: oklchToHex(colors.border),
        borderRadius: radiusConfig.borderRadiusLG,
        boxShadow: shadowConfig.boxShadowTertiary,
      },
    },
  }
}

export default useTModalTheme
