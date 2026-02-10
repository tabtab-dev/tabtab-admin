/**
 * TModal 组件类型定义
 *
 * @description 基于 antdv-next Modal 的类型定义
 */

import type { ButtonProps } from 'antdv-next'
import type { VNode, VNodeChild, CSSProperties } from 'vue'

/** VueNode 类型 - 与 antdv-next 兼容 */
type VueNode = ((...args: any[]) => VNodeChild) | string | number | null | undefined | VNode | boolean

/**
 * Modal 关闭按钮配置类型
 */
export interface ClosableType {
  /** 关闭后的回调 */
  afterClose?: () => void
  /** 自定义关闭图标 */
  closeIcon?: VueNode
  /** 是否禁用关闭图标 */
  disabled?: boolean
  /** 弹窗关闭即时调用 */
  onClose?: () => void
}

/**
 * Modal 遮罩配置
 */
export interface MaskConfig {
  enabled?: boolean
  blur?: boolean
}

/**
 * Modal 遮罩类型
 * @description 与 antdv-next 的 MaskType 兼容
 */
export type MaskType = MaskConfig | boolean | undefined

/**
 * 鼠标位置类型（用于动画起点）
 */
export interface MousePosition {
  x: number
  y: number
}

/**
 * 底部按钮渲染参数
 */
export interface FooterRenderParams {
  /** 原始节点 */
  originNode: VueNode
  /** 额外组件 */
  extra: {
    OkBtn: any
    CancelBtn: any
  }
}

/**
 * Modal Schema 配置
 * @description 用于 JSON 配置化弹窗
 */
export interface ModalSchema {
  /** 标题 */
  title?: string | VueNode
  /** 宽度 */
  width?: string | number
  /** 是否垂直居中 */
  centered?: boolean
  /** 是否显示遮罩 */
  mask?: MaskType
  /** 点击遮罩是否允许关闭 */
  maskClosable?: boolean
  /** 是否支持键盘 ESC 关闭 */
  keyboard?: boolean
  /** 关闭时销毁 Modal 里的子元素 */
  destroyOnHidden?: boolean
  /** 确认按钮文字 */
  okText?: string | VueNode
  /** 取消按钮文字 */
  cancelText?: string | VueNode
  /** 确认按钮类型 */
  okType?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  /** 确认按钮 props */
  okButtonProps?: ButtonProps
  /** 取消按钮 props */
  cancelButtonProps?: ButtonProps
  /** 是否显示右上角关闭按钮 */
  closable?: boolean | ClosableType
  /** 自定义关闭图标 */
  closeIcon?: VueNode
  /** 自定义类名 */
  class?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 对话框外层容器的类名 */
  wrapClassName?: string
  /** 层级 */
  zIndex?: number
  /** 自定义渲染对话框 */
  modalRender?: (node: VueNode) => VueNode
  /** 强制渲染 Modal */
  forceRender?: boolean
  /** 指定 Modal 挂载的节点 */
  getContainer?: string | HTMLElement | (() => HTMLElement) | false
  /** 对话框过渡动效名称 */
  transitionName?: string
  /** 遮罩过渡动效名称 */
  maskTransitionName?: string
  /** 获得焦点触发元素 */
  focusTriggerAfterClose?: boolean
  /** 显示骨架屏 */
  loading?: boolean
}

/**
 * TForm 实例引用类型（用于 TModal 与 TForm 集成）
 */
export interface TFormExpose {
  /** 验证表单 */
  validate: (nameList?: any[]) => Promise<Record<string, unknown>>
  /** 验证所有字段 */
  validateFields: (nameList?: any[]) => Promise<Record<string, unknown>>
  /** 重置表单 */
  resetFields: (nameList?: any[]) => void
  /** 清除验证 */
  clearValidate: (nameList?: any[]) => void
  /** 获取单个字段值 */
  getFieldValue: (name: any) => unknown
  /** 获取多个字段值 */
  getFieldsValue: (nameList?: any[] | true) => Record<string, unknown>
  /** 设置单个字段值 */
  setFieldValue: (name: any, value: unknown) => void
  /** 设置多个字段值 */
  setFieldsValue: (values: Record<string, unknown>) => void
}

/**
 * TModal 组件 Props
 */
export interface TModalProps extends Omit<ModalSchema, 'class'> {
  /** 对话框是否可见（v-model:open） */
  open?: boolean
  /** 确认按钮 loading */
  confirmLoading?: boolean
  /** 底部内容，设为 null 时不显示 */
  footer?: VueNode | ((params: FooterRenderParams) => VueNode) | null
  /** 自定义类名 */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
  /** 根容器 class */
  rootClass?: string
  /** 根容器样式 */
  rootStyle?: CSSProperties
  /** 用于自定义 Modal 组件内部各语义化结构的 class */
  classes?: ModalClassNamesType
  /** 用于自定义 Modal 组件内部各语义化结构的行内 style */
  styles?: ModalStylesType
  /**
   * 关联的 TForm 实例引用
   * @description 当提供 formRef 时，点击确定按钮会自动触发表单验证和提交
   * @example
   * const formRef = ref<TFormExpose>()
   * <TModal :form-ref="formRef" @submit="handleSubmit">
   *   <TForm ref="formRef" />
   * </TModal>
   */
  formRef?: { value?: TFormExpose | null | undefined }
  /**
   * 是否在表单验证通过后自动关闭弹窗
   * @default false
   */
  closeOnSubmitSuccess?: boolean
  /**
   * 是否显示底部按钮区域
   * @description 设置为 false 时隐藏底部按钮，优先级高于 footer 插槽
   * @default true
   */
  showFooter?: boolean
}

/**
 * Modal 语义化结构类名类型
 */
export interface ModalClassNamesType {
  root?: string
  mask?: string
  wrapper?: string
  container?: string
  header?: string
  title?: string
  body?: string
  footer?: string
}

/**
 * Modal 语义化结构样式类型
 */
export interface ModalStylesType {
  root?: CSSProperties
  mask?: CSSProperties
  wrapper?: CSSProperties
  container?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
}

/**
 * TModal 组件 Emits
 */
export interface TModalEmits {
  /** 对话框显隐变化 */
  'update:open': [open: boolean]
  /** 点击确定回调 */
  ok: [e: MouseEvent]
  /** 点击遮罩层或右上角叉或取消按钮的回调 */
  cancel: [e: MouseEvent]
  /** Modal 完全关闭后的回调 */
  afterClose: []
  /** 打开和关闭 Modal 时动画结束后的回调 */
  afterOpenChange: [open: boolean]
}

/**
 * TModal 组件 Expose
 */
export interface TModalExpose {
  /** 打开弹窗 */
  open: () => void
  /** 关闭弹窗 */
  close: () => void
  /** 设置确认按钮 loading 状态 */
  setConfirmLoading: (loading: boolean) => void
  /** 获取当前打开状态 */
  isOpen: () => boolean
}

/**
 * 静态方法配置（Modal.info/success/error/warning/confirm）
 */
export interface ModalStaticConfig {
  /** Modal 完全关闭后的回调 */
  afterClose?: () => void
  /** 指定自动获得焦点的按钮 */
  autoFocusButton?: null | 'ok' | 'cancel'
  /** cancel 按钮 props */
  cancelButtonProps?: ButtonProps
  /** 设置 Modal.confirm 取消按钮文字 */
  cancelText?: string
  /** 垂直居中展示 Modal */
  centered?: boolean
  /** 容器类名 */
  class?: string
  /** 根容器 class */
  rootClass?: string
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean | ClosableType
  /** 自定义关闭图标 */
  closeIcon?: VueNode
  /** 内容 */
  content?: VueNode
  /** 底部内容，设为 null 时不显示 */
  footer?: VueNode | ((params: FooterRenderParams) => VueNode) | null
  /** 指定 Modal 挂载的 HTML 节点 */
  getContainer?: string | HTMLElement | (() => HTMLElement) | false
  /** 自定义图标 */
  icon?: VueNode
  /** 是否支持键盘 ESC 关闭 */
  keyboard?: boolean
  /** 遮罩效果 */
  mask?: MaskType
  /** 点击蒙层是否允许关闭 */
  maskClosable?: boolean
  /** ok 按钮 props */
  okButtonProps?: ButtonProps
  /** 确认按钮文字 */
  okText?: string
  /** 确认按钮类型 */
  okType?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  /** 可用于设置浮层的样式 */
  style?: CSSProperties
  /** 标题 */
  title?: VueNode
  /** 对话框类型 */
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm'
  /** 宽度 */
  width?: string | number
  /** 对话框外层容器的类名 */
  wrapClassName?: string
  /** 设置 Modal 的 z-index */
  zIndex?: number
  /** 点击取消回调 */
  onCancel?: (close?: () => void) => void
  /** 点击确定回调 */
  onOk?: (close?: () => void) => void
}

/**
 * 静态方法返回的引用
 */
export interface ModalStaticRef {
  /** 销毁当前窗口 */
  destroy: () => void
  /** 更新当前窗口 */
  update: (config: ModalStaticConfig) => void
}

/**
 * useModal Hook 返回类型
 */
export interface UseModalReturn {
  /** modal 方法对象 */
  modal: {
    info: (config: ModalStaticConfig) => ModalStaticRef
    success: (config: ModalStaticConfig) => ModalStaticRef
    error: (config: ModalStaticConfig) => ModalStaticRef
    warning: (config: ModalStaticConfig) => ModalStaticRef
    confirm: (config: ModalStaticConfig) => ModalStaticRef & { then: (onConfirm: () => void) => Promise<void> }
  }
  /** ContextHolder 组件 */
  ContextHolder: any
}
