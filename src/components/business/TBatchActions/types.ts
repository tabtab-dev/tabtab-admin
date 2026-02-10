/**
 * TBatchActions 组件类型定义
 * @description 批量操作栏组件的类型定义
 */

import type { Component } from 'vue'

/**
 * 批量操作按钮
 */
export interface BatchAction {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger' | 'ghost'
  /** 图标组件 */
  icon?: Component
  /** 图标名称（lucide 图标） */
  iconName?: string
  /** 点击回调 */
  onClick: () => void
  /** 是否显示 */
  show?: boolean | (() => boolean)
  /** 是否禁用 */
  disabled?: boolean | (() => boolean)
  /** 是否需要确认 */
  confirm?: boolean
  /** 确认文本 */
  confirmText?: string
  /** 确认标题 */
  confirmTitle?: string
  /** 自定义类名 */
  className?: string
  /** 权限标识 */
  permission?: string
}

/**
 * TBatchActions Props
 */
export interface TBatchActionsProps {
  /** 选中的数量 */
  count: number
  /** 操作按钮列表 */
  actions: BatchAction[]
  /** 总数（用于显示 已选 X / 共 Y 项） */
  total?: number
  /** 自定义类名 */
  className?: string
  /** 选中项名称（如"用户"、"订单"） */
  itemName?: string
  /** 是否显示清除按钮 */
  showClear?: boolean
  /** 清除按钮文本 */
  clearText?: string
  /** 是否粘性定位 */
  sticky?: boolean
  /** 粘性定位偏移量 */
  stickyOffset?: number
}

/**
 * TBatchActions Emits
 */
export type TBatchActionsEmits = {
  /** 清除选择 */
  clear: []
  /** 操作按钮点击 */
  actionClick: [action: BatchAction]
}

/**
 * TBatchActions Expose
 */
export interface TBatchActionsExpose {
  /** 获取选中数量 */
  getCount: () => number
  /** 触发清除 */
  clearSelection: () => void
}
