/**
 * TDataCard 组件类型定义
 * @description 统计卡片组件的类型定义
 */

import type { Component } from 'vue'

/**
 * 趋势方向
 */
export type TrendDirection = 'up' | 'down' | 'neutral'

/**
 * 卡片主题色
 */
export type CardColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'default'

/**
 * 卡片尺寸
 */
export type CardSize = 'sm' | 'default' | 'lg'

/**
 * 趋势配置
 */
export interface TrendConfig {
  /** 趋势值 */
  value: number | string
  /** 趋势方向 */
  direction?: TrendDirection
  /** 自定义文本 */
  text?: string
}

/**
 * TDataCard Props
 */
export interface DataCardResponsiveConfig {
  enabled?: boolean
  mobileBreakpoint?: 'xs' | 'sm' | 'md'
  mobileSize?: CardSize
  hideIconOnMobile?: boolean
  hideTrendOnMobile?: boolean
  compactOnMobile?: boolean
}

export interface TDataCardProps {
  title: string
  value: number | string
  icon?: Component
  iconName?: string
  color?: CardColor
  size?: CardSize
  trend?: TrendConfig
  loading?: boolean
  className?: string
  prefix?: string
  suffix?: string
  bordered?: boolean
  clickable?: boolean
  description?: string
  responsive?: DataCardResponsiveConfig
}

/**
 * TDataCard Emits
 */
export type TDataCardEmits = {
  /** 点击事件 */
  click: []
}

/**
 * TDataCard Expose
 */
export interface TDataCardExpose {
  /** 获取当前值 */
  getValue: () => number | string
}
