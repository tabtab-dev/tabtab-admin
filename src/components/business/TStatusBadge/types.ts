/**
 * TStatusBadge 组件类型定义
 * @description 状态徽章组件的类型定义
 */

/**
 * 徽章尺寸
 */
export type BadgeSize = 'sm' | 'default' | 'lg'

/**
 * 徽章变体
 */
export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'dot'

/**
 * 状态类型
 */
export type StatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'processing'
  | 'pending'
  | 'active'
  | 'inactive'
  | 'disabled'

/**
 * 状态配置
 */
export interface StatusConfig {
  /** 显示文本 */
  text: string
  /** 颜色类型 */
  color: StatusType
  /** 图标 */
  icon?: string
}

/**
 * 状态映射配置
 */
export type StatusMap = Record<string, StatusConfig>

/**
 * TStatusBadge Props
 */
export interface StatusBadgeResponsiveConfig {
  enabled?: boolean
  mobileBreakpoint?: 'xs' | 'sm' | 'md'
  mobileSize?: BadgeSize
  hideTextOnMobile?: boolean
}

export interface TStatusBadgeProps {
  status: string | number | boolean
  statusMap?: StatusMap
  size?: BadgeSize
  variant?: BadgeVariant
  showDot?: boolean
  className?: string
  clickable?: boolean
  text?: string
  color?: StatusType
  responsive?: StatusBadgeResponsiveConfig
}

/**
 * TStatusBadge Emits
 */
export type TStatusBadgeEmits = {
  /** 点击事件 */
  click: [status: string | number | boolean]
}

/**
 * TStatusBadge Expose
 */
export interface TStatusBadgeExpose {
  /** 获取当前状态 */
  getStatus: () => string | number | boolean
  /** 获取状态文本 */
  getText: () => string
}
