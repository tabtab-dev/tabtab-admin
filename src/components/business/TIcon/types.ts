/**
 * TIcon 组件类型定义
 * @description 图标选择器组件的类型定义
 */

import type { Component } from 'vue'

/**
 * 图标分类
 */
export interface IconCategory {
  /** 分类标识 */
  key: string
  /** 分类名称 */
  name: string
  /** 分类下的图标名称列表 */
  icons: string[]
}

/**
 * 图标项
 */
export interface IconItem {
  /** 图标名称 */
  name: string
  /** 图标组件 */
  component: Component
  /** 所属分类 */
  category: string
}

/**
 * TIcon 组件 Props
 */
export interface TIconProps {
  /** 选中的图标名称 */
  modelValue?: string
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 尺寸 */
  size?: 'sm' | 'default' | 'lg'
  /** 是否显示清空按钮 */
  showClear?: boolean
  /** 指定显示的分类 */
  categories?: string[]
  /** 排除的分类 */
  excludeCategories?: string[]
  /** 弹窗宽度 */
  popupWidth?: number | string
  /** 弹窗高度 */
  popupHeight?: number | string
  /** 每行显示的图标数量 */
  columns?: number
  /** 是否显示分类标签 */
  showCategoryTabs?: boolean
}

/**
 * TIcon 组件 Emits
 */
export interface TIconEmits {
  /** 更新选中值 */
  (e: 'update:modelValue', value: string): void
  /** 值变化事件 */
  (e: 'change', value: string): void
  /** 清空事件 */
  (e: 'clear'): void
}

/**
 * TIcon 组件暴露的方法
 */
export interface TIconExpose {
  /** 打开选择器 */
  open: () => void
  /** 关闭选择器 */
  close: () => void
  /** 清空选择 */
  clear: () => void
  /** 获取当前选中的图标名称 */
  getValue: () => string | undefined
}

/**
 * TIconPicker 组件 Props
 */
export interface TIconPickerProps {
  /** 是否可见 */
  visible: boolean
  /** 当前选中的图标名称 */
  selectedIcon?: string
  /** 指定显示的分类 */
  categories?: string[]
  /** 排除的分类 */
  excludeCategories?: string[]
  /** 弹窗宽度 */
  width?: number | string
  /** 弹窗高度 */
  height?: number | string
  /** 每行显示的图标数量 */
  columns?: number
  /** 是否显示分类标签 */
  showCategoryTabs?: boolean
}

/**
 * TIconPicker 组件 Emits
 */
export interface TIconPickerEmits {
  /** 更新可见状态 */
  (e: 'update:visible', visible: boolean): void
  /** 选择图标 */
  (e: 'select', iconName: string): void
  /** 取消选择 */
  (e: 'cancel'): void
}
