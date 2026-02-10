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
export interface TDataCardProps {
  /** 卡片标题 */
  title: string
  /** 数值 */
  value: number | string
  /** 图标组件 */
  icon?: Component
  /** 图标名称（使用 lucide 图标） */
  iconName?: string
  /** 主题色 */
  color?: CardColor
  /** 尺寸 */
  size?: CardSize
  /** 趋势配置 */
  trend?: TrendConfig
  /** 加载状态 */
  loading?: boolean
  /** 自定义类名 */
  className?: string
  /** 前缀（如 ¥、$） */
  prefix?: string
  /** 后缀（如 %、个） */
  suffix?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 描述文本 */
  description?: string
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
