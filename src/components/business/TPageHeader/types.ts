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
export interface TPageHeaderProps {
  /** 页面标题 */
  title: string
  /** 副标题/描述 */
  subtitle?: string
  /** 面包屑配置 */
  breadcrumbs?: BreadcrumbItem[]
  /** 操作按钮列表 */
  actions?: PageAction[]
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 返回按钮回调（默认返回上一页） */
  onBack?: () => void
  /** 自定义类名 */
  className?: string
  /** 标题下方内容插槽 */
  showExtra?: boolean
  /** 是否粘性定位 */
  sticky?: boolean
  /** 粘性定位偏移量 */
  stickyOffset?: number
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
