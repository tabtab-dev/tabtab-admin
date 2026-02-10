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
export interface TStatusBadgeProps {
  /** 状态值 */
  status: string | number | boolean
  /** 自定义状态映射 */
  statusMap?: StatusMap
  /** 尺寸 */
  size?: BadgeSize
  /** 变体 */
  variant?: BadgeVariant
  /** 是否显示圆点 */
  showDot?: boolean
  /** 自定义类名 */
  className?: string
  /** 是否可点击 */
  clickable?: boolean
  /** 自定义文本（优先级高于 statusMap） */
  text?: string
  /** 自定义颜色（优先级高于 statusMap） */
  color?: StatusType
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
