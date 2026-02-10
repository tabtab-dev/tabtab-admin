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
export interface TEmptyStateProps {
  /** 空状态类型 */
  type?: EmptyType
  /** 尺寸 */
  size?: EmptySize
  /** 标题 */
  title?: string
  /** 描述文本 */
  description?: string
  /** 自定义图标组件 */
  icon?: Component
  /** 图标名称（lucide 图标） */
  iconName?: string
  /** 操作按钮配置 */
  action?: EmptyAction
  /** 自定义类名 */
  className?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示背景 */
  showBackground?: boolean
  /** 自定义图片 URL */
  image?: string
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
