/**
 * TPageHeader 组件类型定义
 * @description 页面头部组件的类型定义
 */

import type { Component } from 'vue'

/**
 * 页面操作按钮
 */
export interface PageAction {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger' | 'ghost' | 'link'
  /** 图标组件 */
  icon?: Component
  /** 图标名称（lucide 图标） */
  iconName?: string
  /** 点击回调 */
  onClick?: () => void
  /** 是否显示 */
  show?: boolean | (() => boolean)
  /** 是否禁用 */
  disabled?: boolean | (() => boolean)
  /** 自定义类名 */
  className?: string
  /** 权限标识 */
  permission?: string
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  /** 显示文本 */
  title: string
  /** 链接路径 */
  path?: string
  /** 是否可点击 */
  clickable?: boolean
}

/**
 * TPageHeader Props
 */
export interface PageHeaderResponsiveConfig {
  enabled?: boolean
  mobileBreakpoint?: 'xs' | 'sm' | 'md'
  hideSubtitleOnMobile?: boolean
  hideBreadcrumbsOnMobile?: boolean
  collapseActionsOnMobile?: boolean
  mobileTitleSize?: 'sm' | 'default' | 'lg'
}

export interface TPageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: PageAction[]
  showBack?: boolean
  onBack?: () => void
  className?: string
  showExtra?: boolean
  sticky?: boolean
  stickyOffset?: number
  responsive?: PageHeaderResponsiveConfig
}

/**
 * TPageHeader Emits
 */
export type TPageHeaderEmits = {
  /** 返回按钮点击 */
  back: []
  /** 面包屑点击 */
  breadcrumbClick: [item: BreadcrumbItem, index: number]
}

/**
 * TPageHeader Expose
 */
export interface TPageHeaderExpose {
  /** 获取标题 */
  getTitle: () => string
  /** 触发返回 */
  goBack: () => void
}
