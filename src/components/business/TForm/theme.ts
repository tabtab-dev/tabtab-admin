/**
 * TForm 主题配置
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
export function useTFormTheme(): ComputedRef<ThemeConfig> {
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
        // 表单组件特定配置
        Form: {
          colorTextLabel: oklchToHex(colors.foreground),
          colorTextDescription: oklchToHex(colors.mutedForeground),
        },
        // 输入框
        Input: {
          colorBorder: oklchToHex(colors.input),
          colorBgContainer: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          colorTextPlaceholder: oklchToHex(colors.mutedForeground),
          activeShadow: 'none',
          borderRadius: radiusConfig.borderRadius,
        },
        // 选择器
        Select: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          colorTextPlaceholder: oklchToHex(colors.mutedForeground),
          colorBgElevated: oklchToHex(colors.popover),
          borderRadius: radiusConfig.borderRadius,
          boxShadow: shadowConfig.boxShadow,
        },
        // 日期选择器
        DatePicker: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          colorBgElevated: oklchToHex(colors.popover),
          colorPrimary: oklchToHex(colors.primary),
          borderRadius: radiusConfig.borderRadius,
          boxShadow: shadowConfig.boxShadowSecondary,
        },
        // 时间选择器
        TimePicker: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorBgElevated: oklchToHex(colors.popover),
          colorPrimary: oklchToHex(colors.primary),
          borderRadius: radiusConfig.borderRadius,
        },
        // 数字输入框
        InputNumber: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          borderRadius: radiusConfig.borderRadius,
        },
        // 级联选择
        Cascader: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorBgElevated: oklchToHex(colors.popover),
          colorText: oklchToHex(colors.foreground),
          borderRadius: radiusConfig.borderRadius,
        },
        // 树形选择
        TreeSelect: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorBgElevated: oklchToHex(colors.popover),
          colorText: oklchToHex(colors.foreground),
          borderRadius: radiusConfig.borderRadius,
        },
        // 提及
        Mentions: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          colorBgElevated: oklchToHex(colors.popover),
          borderRadius: radiusConfig.borderRadius,
        },
        // 自动完成
        AutoComplete: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorBgElevated: oklchToHex(colors.popover),
          colorText: oklchToHex(colors.foreground),
          borderRadius: radiusConfig.borderRadius,
        },
        // 滑块
        Slider: {
          colorPrimary: oklchToHex(colors.primary),
          colorBgElevated: oklchToHex(colors.muted),
        },
        // 评分
        Rate: {
          colorFillContent: oklchToHex(colors.muted),
        },
        // 单选框
        Radio: {
          colorPrimary: oklchToHex(colors.primary),
          colorText: oklchToHex(colors.foreground),
        },
        // 复选框
        Checkbox: {
          colorPrimary: oklchToHex(colors.primary),
          colorText: oklchToHex(colors.foreground),
          colorBgContainer: oklchToHex(colors.background),
          colorBorder: oklchToHex(colors.border),
        },
        // 开关
        Switch: {
          colorPrimary: oklchToHex(colors.primary),
        },
        // 上传
        Upload: {
          colorText: oklchToHex(colors.foreground),
          colorTextDescription: oklchToHex(colors.mutedForeground),
        },
        // 穿梭框
        Transfer: {
          colorBorder: oklchToHex(colors.border),
          colorBgContainer: oklchToHex(colors.background),
          colorBgElevated: oklchToHex(colors.card),
          colorText: oklchToHex(colors.foreground),
        },
        // 分段控制器
        Segmented: {
          colorBgElevated: oklchToHex(colors.background),
          colorText: oklchToHex(colors.foreground),
          colorTextLabel: oklchToHex(colors.foreground),
          borderRadius: radiusConfig.borderRadius,
        },
      },
    }
  })
}

/**
 * 静态主题配置（用于不需要响应式的场景）
 */
export function getTFormThemeConfig(): ThemeConfig {
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
      Form: {
        colorTextLabel: oklchToHex(colors.foreground),
        colorTextDescription: oklchToHex(colors.mutedForeground),
      },
      Input: {
        colorBorder: oklchToHex(colors.input),
        colorBgContainer: oklchToHex(colors.background),
        colorText: oklchToHex(colors.foreground),
        colorTextPlaceholder: oklchToHex(colors.mutedForeground),
        activeShadow: 'none',
        borderRadius: radiusConfig.borderRadius,
      },
    },
  }
}

export default useTFormTheme
