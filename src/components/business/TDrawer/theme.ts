/**
 * TDrawer 主题配置
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
export function useTDrawerTheme(): ComputedRef<ThemeConfig> {
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

        // 阴影 - 抽屉使用三级阴影
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
        // Drawer 抽屉组件特定配置
        Drawer: {
          colorBgContainer: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          colorBgElevated: oklchToHex(colors.card),
          colorTextHeading: oklchToHex(colors.foreground),
          colorIcon: oklchToHex(colors.mutedForeground),
          colorIconHover: oklchToHex(colors.foreground),
          colorBorder: oklchToHex(colors.border),
          // 统一阴影和圆角
          borderRadiusLG: radiusConfig.borderRadiusLG,
          boxShadow: shadowConfig.boxShadowTertiary,
          // 尺寸
          sizeLG: 378,
          sizeMD: 320,
          sizeSM: 256,
        },
      },
    }
  })
}

/**
 * 获取 TDrawer 主题配置（非响应式版本）
 * @returns ThemeConfig 对象
 */
export function getTDrawerThemeConfig(): ThemeConfig {
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
      colorText: oklchToHex(colors.foreground),
      colorBorder: oklchToHex(colors.border),
      colorSplit: oklchToHex(colors.border),
      colorBgElevated: oklchToHex(colors.card),
      colorBgMask: 'rgba(0, 0, 0, 0.5)',
      borderRadiusLG: radiusConfig.borderRadiusLG,
      borderRadius: radiusConfig.borderRadius,
      paddingLG: 24,
      paddingMD: 16,
      paddingSM: 12,
      paddingXS: 8,
      fontSize: 14,
      lineHeight: 1.5,
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
    },
    components: {
      Drawer: {
        colorBgContainer: oklchToHex(colors.background),
        colorText: oklchToHex(colors.foreground),
        colorBgElevated: oklchToHex(colors.card),
        colorTextHeading: oklchToHex(colors.foreground),
        colorIcon: oklchToHex(colors.mutedForeground),
        colorIconHover: oklchToHex(colors.foreground),
        colorBorder: oklchToHex(colors.border),
        borderRadiusLG: radiusConfig.borderRadiusLG,
        boxShadow: shadowConfig.boxShadowTertiary,
        sizeLG: 378,
        sizeMD: 320,
        sizeSM: 256,
      },
    },
  }
}

export default useTDrawerTheme
