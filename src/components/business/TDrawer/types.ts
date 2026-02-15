/**
 * TDrawer 组件类型定义
 *
 * @description 基于 antdv-next Drawer 的类型定义
 */

import type { VNode, VNodeChild, CSSProperties } from 'vue'

/** VueNode 类型 - 与 antdv-next 兼容 */
type VueNode = ((...args: any[]) => VNodeChild) | string | number | null | undefined | VNode | boolean

/**
 * Drawer 关闭按钮配置类型
 */
export interface ClosableType {
  /** 自定义关闭图标 */
  closeIcon?: VueNode
  /** 是否禁用关闭按钮 */
  disabled?: boolean
  /** 关闭按钮位置 */
  placement?: 'start' | 'end'
}

/**
 * Drawer 遮罩配置
 */
export interface MaskConfig {
  enabled?: boolean
  blur?: boolean
}

/**
 * Drawer 遮罩类型
 * @description 与 antdv-next 的 MaskType 兼容
 */
export type MaskType = MaskConfig | boolean | undefined

/**
 * 抽屉方向
 */
export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'

/**
 * 抽屉预设尺寸
 */
export type DrawerSize = 'default' | 'large' | number

/**
 * 多层抽屉推开行为配置
 */
export interface PushConfig {
  /** 推开距离 */
  distance: string | number
}

/**
 * 可调整大小配置
 */
export interface ResizableConfig {
  /** 开始拖拽回调 */
  onResizeStart?: () => void
  /** 拖拽中回调 */
  onResize?: (size: number) => void
  /** 结束拖拽回调 */
  onResizeEnd?: () => void
}

/**
 * Drawer Schema 配置
 * @description 用于 JSON 配置化抽屉
 */
export interface DrawerSchema {
  /** 标题 */
  title?: string | VueNode
  /** 抽屉方向 */
  placement?: DrawerPlacement
  /** 预设尺寸 */
  size?: DrawerSize
  /** 是否显示遮罩 */
  mask?: MaskType
  /** 点击遮罩是否允许关闭 */
  maskClosable?: boolean
  /** 是否支持键盘 ESC 关闭 */
  keyboard?: boolean
  /** 关闭时销毁 Drawer 里的子元素 */
  destroyOnHidden?: boolean
  /** 是否展示关闭按钮 */
  closable?: boolean | ClosableType
  /** 自定义关闭图标 */
  closeIcon?: VueNode
  /** 右上角额外操作区域 */
  extra?: VueNode
  /** 抽屉底部 */
  footer?: VueNode
  /** 自定义类名 */
  class?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 根容器 class */
  rootClass?: string
  /** 根容器样式（包含遮罩） */
  rootStyle?: CSSProperties
  /** 层级 */
  zIndex?: number
  /** 强制预渲染 Drawer */
  forceRender?: boolean
  /** 指定 Drawer 挂载的节点 */
  getContainer?: string | HTMLElement | (() => HTMLElement) | false
  /** 显示 Skeleton */
  loading?: boolean
  /** 多层抽屉的推开行为 */
  push?: boolean | PushConfig
  /** 是否允许拖拽调整尺寸 */
  resizable?: boolean | ResizableConfig
}

/**
 * TDrawer 组件 Props
 */
export interface DrawerResponsiveConfig {
  enabled?: boolean
  fullWidthOnMobile?: boolean
  mobileBreakpoint?: 'xs' | 'sm' | 'md'
  mobileSize?: 'default' | 'large' | number
}

export interface TDrawerProps extends Omit<DrawerSchema, 'class'> {
  open?: boolean
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
  classes?: DrawerClassNamesType
  styles?: DrawerStylesType
  responsive?: DrawerResponsiveConfig
}

/**
 * Drawer 语义化结构类名类型
 */
export interface DrawerClassNamesType {
  root?: string
  mask?: string
  wrapper?: string
  section?: string
  header?: string
  title?: string
  extra?: string
  body?: string
  footer?: string
  dragger?: string
  close?: string
}

/**
 * Drawer 语义化结构样式类型
 */
export interface DrawerStylesType {
  root?: CSSProperties
  mask?: CSSProperties
  wrapper?: CSSProperties
  section?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  extra?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
  dragger?: CSSProperties
  close?: CSSProperties
}

/**
 * TDrawer 组件 Emits
 */
export interface TDrawerEmits {
  /** 抽屉显隐变化 */
  'update:open': [open: boolean]
  /** 切换抽屉时动画结束后的回调 */
  afterOpenChange: [open: boolean]
  /** 抽屉关闭回调 */
  close: [e: MouseEvent | KeyboardEvent]
  /** 键盘按下回调 */
  keydown: [e: KeyboardEvent]
  /** 键盘抬起回调 */
  keyup: [e: KeyboardEvent]
  /** 鼠标移入回调 */
  mouseenter: [e: MouseEvent]
  /** 鼠标移出回调 */
  mouseleave: [e: MouseEvent]
  /** 点击回调 */
  click: [e: MouseEvent]
}

/**
 * TDrawer 组件 Expose
 */
export interface TDrawerExpose {
  /** 打开抽屉 */
  open: () => void
  /** 关闭抽屉 */
  close: () => void
  /** 获取当前打开状态 */
  isOpen: () => boolean
}
