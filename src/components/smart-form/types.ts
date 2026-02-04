import type { Component, VNode } from 'vue'
import type { ZodType, ZodTypeDef } from 'zod'
import type { FormContext, GenericObject, Path, PathValue } from 'vee-validate'
import type { EnhancedFieldCondition, ConditionGroup } from './composables'

/**
 * 表单字段类型
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multi-select'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'date'
  | 'date-range'
  | 'datetime'
  | 'time'
  | 'file'
  | 'slider'
  | 'tags'
  | 'otp'
  | 'pin'
  | 'combobox'
  | 'toggle-group'
  | 'custom'

/**
 * 选择器选项
 */
export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

/**
 * 日期范围值类型
 * @注意 from 和 to 必须同时存在或同时不存在
 */
export type DateRangeValue =
  | { from: Date | string; to: Date | string }
  | { from?: undefined; to?: undefined }
  | undefined

/**
 * 字段联动条件（旧版，保持兼容）
 */
export interface FieldCondition<T extends GenericObject = GenericObject> {
  /** 依赖的字段名 */
  field: Path<T>
  /** 条件值或条件函数 */
  value: PathValue<T, Path<T>> | ((value: PathValue<T, Path<T>>) => boolean)
  /** 满足条件时的操作: show-显示, hide-隐藏, enable-启用, disable-禁用, setValue-设置值 */
  action: 'show' | 'hide' | 'enable' | 'disable' | 'setValue'
  /** action 为 setValue 时的目标值 */
  targetValue?: PathValue<T, Path<T>>
}

/**
 * 表单字段分组
 */
export interface FormFieldGroup<T extends GenericObject = GenericObject> {
  /** 分组标题 */
  title: string
  /** 分组描述 */
  description?: string
  /** 分组包含的字段名列表 */
  fields: Path<T>[]
  /** 是否可折叠 */
  collapsible?: boolean
  /** 默认是否展开 */
  defaultExpanded?: boolean
}

/**
 * 验证字段名是否合法
 * @param name - 字段名
 * @returns 是否合法
 */
export function isValidFieldName(name: string): boolean {
  // 字段名不能为空
  if (!name || typeof name !== 'string') return false
  // 字段名不能包含特殊字符
  if (/[.\[\]]/.test(name)) {
    console.warn(`[SmartForm] Field name "${name}" contains special characters which may cause issues`)
    return false
  }
  return true
}

/**
 * 表单字段配置
 */
export interface FormFieldConfig<T extends GenericObject = GenericObject> {
  /** 字段名称 */
  name: Path<T>
  /** 字段类型 */
  type: FieldType
  /** 字段标签 */
  label?: string
  /** 字段占位符 */
  placeholder?: string
  /** 字段描述 */
  description?: string
  /** 是否必填 */
  required?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 选择器选项（当 type 为 select/radio/combobox 时使用） */
  options?: SelectOption[]
  /** 自定义渲染组件（当 type 为 custom 时使用） */
  component?: Component
  /** 传递给自定义组件的额外属性 */
  componentProps?: Record<string, unknown>
  /** 字段验证规则（Zod schema 或函数） */
  validation?: ZodType<unknown, ZodTypeDef, unknown> | ((value: unknown) => string | true)
  /** 字段默认值 */
  defaultValue?: PathValue<T, Path<T>>
  /** 输入框前置图标 */
  prefixIcon?: Component
  /** 输入框后置图标 */
  suffixIcon?: Component
  /** 字段占用的列数（用于网格布局） */
  colSpan?: number
  /** 自定义渲染函数（优先级高于 component） */
  render?: (props: {
    field: {
      value: PathValue<T, Path<T>>
      onChange: (value: PathValue<T, Path<T>>) => void
      onBlur: () => void
    }
    form: FormContext<T>
  }) => VNode
  /** 字段联动条件（支持旧版和新版格式） */
  conditions?: (FieldCondition<T> | EnhancedFieldCondition<T> | ConditionGroup<T>)[]
  /** 标签宽度（仅在 labelPosition='left' 时有效） */
  labelWidth?: string
  /** 输入提示 */
  hint?: string
  /** 滑块配置（type='slider' 时使用） */
  sliderConfig?: {
    min?: number
    max?: number
    step?: number
  }
  /** OTP/PIN 配置（type='otp' | 'pin' 时使用） */
  otpConfig?: {
    length?: number
  }
  /** 多选配置（type='multi-select' 时使用） */
  multiSelectConfig?: {
    maxCount?: number
  }
}

/**
 * 表单配置
 */
export interface SmartFormConfig<T extends GenericObject = GenericObject> {
  /** 字段配置数组 */
  fields: FormFieldConfig<T>[]
  /** 字段分组配置 */
  groups?: FormFieldGroup<T>[]
  /** 表单验证模式（Zod schema） */
  validationSchema?: ZodType<T, ZodTypeDef, T>
  /** 表单默认值 */
  initialValues?: Partial<T>
  /** 是否在失去焦点时验证 */
  validateOnBlur?: boolean
  /** 是否在值改变时验证 */
  validateOnChange?: boolean
  /** 是否在挂载时验证 */
  validateOnMount?: boolean
  /** 是否显示标签 */
  showLabels?: boolean
  /** 是否显示描述 */
  showDescriptions?: boolean
  /** 标签位置 */
  labelPosition?: 'top' | 'left'
  /** 表单布局 */
  layout?: 'vertical' | 'horizontal' | 'grid'
  /** 网格列数 */
  gridCols?: number
  /** 提交按钮文本 */
  submitText?: string
  /** 重置按钮文本 */
  resetText?: string
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 是否禁用提交按钮 */
  submitDisabled?: boolean
  /** 提交按钮加载状态 */
  submitLoading?: boolean
  /** 自定义按钮渲染 */
  renderActions?: (props: {
    form: FormContext<T>
    isSubmitting: boolean
    isValid: boolean
    handleSubmit: () => void
    handleReset: () => void
  }) => VNode
  /** 表单标题 */
  title?: string
  /** 表单描述 */
  description?: string
  /** 是否显示卡片容器 */
  card?: boolean
}

/**
 * 表单提交事件
 */
export interface FormSubmitEvent<T extends GenericObject = GenericObject> {
  values: T
  form: FormContext<T>
  resetForm: () => void
}

/**
 * 表单实例暴露的方法
 */
export interface SmartFormExpose<T extends GenericObject = GenericObject> {
  /** 表单上下文 */
  form: FormContext<T>
  /** 提交表单 */
  submit: () => void
  /** 重置表单 */
  reset: () => void
  /** 验证表单 */
  validate: () => Promise<boolean>
  /** 设置字段值 */
  setFieldValue: <K extends Path<T>>(field: K, value: PathValue<T, K>) => void
  /** 获取字段值 */
  getFieldValue: <K extends Path<T>>(field: K) => PathValue<T, K>
  /** 设置多个字段值 */
  setValues: (values: Partial<T>) => void
  /** 获取表单值 */
  getValues: () => T
  /** 清除验证错误 */
  clearErrors: () => void
}

// 重新导出条件类型
export type { EnhancedFieldCondition, ConditionGroup, ConditionOperator } from './composables'
