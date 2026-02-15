/**
 * TEmptyState 组件类型定义
 * @description 空状态组件的类型定义
 */

import type { Component } from 'vue'

/**
 * 空状态尺寸
 */
export type EmptySize = 'sm' | 'default' | 'lg'

/**
 * 空状态类型
 */
export type EmptyType = 'default' | 'search' | 'data' | 'error' | 'network' | 'permission'

/**
 * 操作按钮配置
 */
export interface EmptyAction {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'ghost' | 'link'
  /** 图标组件 */
  icon?: Component
  /** 图标名称 */
  iconName?: string
  /** 点击回调 */
  onClick?: () => void
}

/**
 * TEmptyState Props
 */
export interface EmptyStateResponsiveConfig {
  enabled?: boolean
  mobileBreakpoint?: 'xs' | 'sm' | 'md'
  mobileSize?: EmptySize
  hideDescriptionOnMobile?: boolean
  compactOnMobile?: boolean
}

export interface TEmptyStateProps {
  type?: EmptyType
  size?: EmptySize
  title?: string
  description?: string
  icon?: Component
  iconName?: string
  action?: EmptyAction
  className?: string
  bordered?: boolean
  showBackground?: boolean
  image?: string
  responsive?: EmptyStateResponsiveConfig
}

/**
 * TEmptyState Emits
 */
export type TEmptyStateEmits = {
  /** 操作按钮点击 */
  actionClick: []
}

/**
 * TEmptyState Expose
 */
export interface TEmptyStateExpose {
  /** 触发操作 */
  triggerAction: () => void
}
