/**
 * 表单字段类型
 * @description 支持的表单控件类型
 */
export type FormFieldType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'radio-button'
  | 'checkbox'
  | 'checkbox-single'
  | 'switch'
  | 'slider'
  | 'rate'
  | 'date-picker'
  | 'month-picker'
  | 'quarter-picker'
  | 'year-picker'
  | 'week-picker'
  | 'range-picker'
  | 'time-picker'
  | 'time-range-picker'
  | 'cascader'
  | 'tree-select'
  | 'auto-complete'
  | 'mention'
  | 'upload'
  | 'transfer'
  | 'color-picker'
  | 'segmented'
  | 'group'
  | 'list'
  | 'custom'

/**
 * 选项类型
 * @description 用于 select、radio、checkbox 等选项类组件
 */
export interface FormOption {
  /** 选项标签 */
  label: string
  /** 选项值 */
  value: string | number | boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 子选项（用于 cascader） */
  children?: FormOption[]
}

/**
 * 字段联动配置
 * @description 用于控制字段的显示/隐藏或联动逻辑
 * @template T - 表单数据类型
 */
export interface FieldDependency<T extends Record<string, any> = Record<string, any>> {
  /** 依赖的字段名 */
  field: keyof T | string
  /** 条件函数，返回 true 时显示该字段 */
  condition: (value: any, formData: T) => boolean
}

/**
 * 验证规则类型
 * @description 基于 antd Form Rule 的简化类型
 */
export interface FormRule {
  /** 是否必填 */
  required?: boolean
  /** 错误提示信息 */
  message?: string
  /** 字段类型（email, url, number 等） */
  type?: string
  /** 正则表达式验证 */
  pattern?: RegExp
  /** 自定义验证函数 */
  validator?: (rule: any, value: any) => Promise<void> | void
  /** 触发验证时机 */
  trigger?: string | string[]
  /** 最小长度/值 */
  min?: number
  /** 最大长度/值 */
  max?: number
  /** 长度限制 */
  len?: number
  /** 是否空白符 */
  whitespace?: boolean
  /** 自定义转换函数 */
  transform?: (value: any) => any
}

/**
 * 字段名路径类型
 * @description 支持字符串或字符串数组
 */
export type NamePath = string | number | (string | number)[]

/**
 * 异步选项加载函数类型
 * @template T - 表单数据类型
 */
export type AsyncOptionsLoader<T extends Record<string, any> = Record<string, any>> = (formData: T) => Promise<FormOption[]> | FormOption[]

/**
 * 字段监听配置
 * @template T - 表单数据类型
 */
export interface FieldWatch<T extends Record<string, any> = Record<string, any>> {
  /** 监听的字段名 */
  field: keyof T | string
  /** 回调函数 */
  handler: (value: any, formData: T, formMethods: FormMethods) => void
}

/**
 * 表单方法
 */
export interface FormMethods {
  /** 设置字段值 */
  setFieldValue: (name: NamePath, value: any) => void
  /** 获取字段值 */
  getFieldValue: (name: NamePath) => any
  /** 设置字段禁用状态 */
  setFieldDisabled: (name: NamePath, disabled: boolean) => void
  /** 设置字段隐藏状态 */
  setFieldHidden: (name: NamePath, hidden: boolean) => void
}

/**
 * 列表字段配置
 * @template T - 表单数据类型
 */
export interface ListFieldConfig<T extends Record<string, any> = Record<string, any>> {
  /** 列表项字段配置 */
  fields: FormField<T>[]
  /** 最小项数 */
  min?: number
  /** 最大项数 */
  max?: number
  /** 添加按钮文本 */
  addText?: string
  /** 删除按钮文本 */
  removeText?: string
  /** 是否显示添加按钮 */
  showAdd?: boolean
  /** 是否显示删除按钮 */
  showRemove?: boolean
}

/**
 * 分组字段配置
 * @template T - 表单数据类型
 */
export interface GroupFieldConfig<T extends Record<string, any> = Record<string, any>> {
  /** 分组标题 */
  title?: string
  /** 是否可折叠 */
  collapsible?: boolean
  /** 默认是否展开 */
  defaultExpanded?: boolean
  /** 子字段 */
  children: FormField<T>[]
}

/**
 * 表单字段配置
 * @description 单个表单字段的完整配置
 * @template T - 表单数据类型
 */
export interface FormField<T extends Record<string, any> = Record<string, any>> {
  /** 字段名（唯一标识） */
  name: keyof T | NamePath
  /** 字段类型 */
  type: FormFieldType
  /** 标签文本 */
  label?: string
  /** 占位提示 */
  placeholder?: string
  /** 验证规则 */
  rules?: FormRule[]
  /** 选项（用于 select/radio/checkbox/cascader/tree-select） */
  options?: FormOption[] | AsyncOptionsLoader<T>
  /** 透传给 antd 组件的属性 */
  props?: Record<string, any>
  /** 是否隐藏 */
  hidden?: boolean | ((formData: T) => boolean)
  /** 是否禁用（支持函数动态判断） */
  disabled?: boolean | ((formData: T) => boolean)
  /** 默认值 */
  defaultValue?: any
  /** 字段联动配置 */
  dependencies?: FieldDependency<T>
  /** 字段监听配置 */
  watch?: FieldWatch<T>[]
  /** 自定义插槽名（type='custom' 时使用） */
  slot?: string
  /** 标签布局 */
  labelCol?: { span?: number; offset?: number }
  /** 控件布局 */
  wrapperCol?: { span?: number; offset?: number }
  /** 列表配置（type='list' 时使用） */
  listConfig?: ListFieldConfig<T>
  /** 分组配置（type='group' 时使用） */
  groupConfig?: GroupFieldConfig<T>
}

/**
 * 表单操作按钮配置
 * @description 表单底部操作按钮的配置
 */
export interface FormActions {
  /** 提交按钮文本 */
  submitText?: string
  /** 重置按钮文本 */
  resetText?: string
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 是否显示提交按钮 */
  showSubmit?: boolean
  /** 按钮对齐方式 */
  align?: 'left' | 'center' | 'right'
}

/**
 * 搜索表单配置
 * @description 用于配合 TTable 的搜索表单配置
 * @template T - 表单数据类型
 */
export interface SearchConfig<T extends Record<string, any> = Record<string, any>> {
  /** 是否为搜索表单模式 */
  enabled?: boolean
  /** 是否默认折叠 */
  collapsed?: boolean
  /** 折叠阈值 - 超过此数量的字段将被折叠 */
  collapseThreshold?: number
  /** 是否显示折叠按钮 */
  showCollapseButton?: boolean
  /** 折叠按钮文本 */
  collapseButtonText?: string
  /** 展开按钮文本 */
  expandButtonText?: string
  /** 每行显示的字段数 */
  columns?: number
  /** 字段间距 */
  gutter?: number
  /** 搜索按钮文本 */
  searchText?: string
  /** 重置按钮文本 */
  resetText?: string
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 搜索回调 - 用于配合 TTable */
  onSearch?: (values: T) => void
  /** 重置回调 - 用于配合 TTable */
  onReset?: () => void
}

/**
 * 表单布局类型
 */
export type FormLayout = 'horizontal' | 'vertical' | 'inline'

/**
 * 标签对齐方式
 */
export type LabelAlign = 'left' | 'right'

/**
 * 表单尺寸
 */
export type FormSize = 'small' | 'middle' | 'large'

/**
 * 表单 Schema 配置
 * @description 表单的整体配置结构
 * @template T - 表单数据类型
 */
export interface FormSchema<T extends Record<string, any> = Record<string, any>> {
  /** 表单字段配置数组 */
  fields: FormField<T>[]
  /** 表单布局 */
  layout?: FormLayout
  /** 标签列布局 */
  labelCol?: { span?: number; offset?: number }
  /** 控件列布局 */
  wrapperCol?: { span?: number; offset?: number }
  /** 标签对齐方式 */
  labelAlign?: LabelAlign
  /** 表单尺寸 */
  size?: FormSize
  /** 是否禁用整个表单 */
  disabled?: boolean
  /** 是否显示冒号 */
  colon?: boolean
  /** 操作按钮配置 */
  actions?: FormActions
  /** 搜索表单配置 */
  searchConfig?: SearchConfig<T>
}

/**
 * TForm 组件 Props
 * @template T - 表单数据类型
 */
export interface TFormProps<T extends Record<string, any> = Record<string, any>> {
  /** 表单 Schema 配置 */
  schema: FormSchema<T>
  /** 表单数据（支持 v-model） */
  modelValue?: T
  /** 加载状态 */
  loading?: boolean
}

/**
 * 表单状态元数据
 */
export interface FormMeta {
  /** 是否修改过 */
  dirty: boolean
  /** 是否触碰过 */
  touched: boolean
  /** 是否验证通过 */
  valid: boolean
  /** 是否提交中 */
  submitting: boolean
  /** 是否验证中 */
  validating: boolean
}

/**
 * 表单实例类型（基于 antd Form 实例）
 */
export interface FormInstance {
  /** 验证表单字段 */
  validateFields: (nameList?: NamePath[]) => Promise<Record<string, unknown>>
  /** 重置表单字段 */
  resetFields: (nameList?: NamePath[]) => void
  /** 清除验证状态 */
  clearValidate: (nameList?: NamePath[]) => void
  /** 获取单个字段值 */
  getFieldValue: (name: NamePath) => unknown
  /** 获取多个字段值 */
  getFieldsValue: (nameList?: NamePath[] | true) => Record<string, unknown>
  /** 设置单个字段值 */
  setFieldValue: (name: NamePath, value: unknown) => void
  /** 设置多个字段值 */
  setFieldsValue: (values: Record<string, unknown>) => void
  /** 滚动到指定字段 */
  scrollToField: (name: NamePath, options?: ScrollIntoViewOptions) => void
}

/**
 * 表单验证错误信息
 */
export interface FormValidateError {
  /** 错误字段名 */
  name: NamePath
  /** 错误信息数组 */
  errors: string[]
  /** 警告信息数组 */
  warnings?: string[]
}

/**
 * 表单验证错误结果
 */
export interface FormValidateErrorInfo {
  /** 错误信息数组 */
  errorFields: FormValidateError[]
  /** 是否超出字段 */
  outOfDate?: boolean
  /** 错误信息 */
  values?: Record<string, unknown>
}

/**
 * TForm 组件暴露的方法
 * @description 通过 ref 可以调用的方法
 */
export interface TFormExpose {
  /**
   * 验证表单
   * @param nameList - 指定验证的字段名列表，不传则验证所有字段
   */
  validate: (nameList?: NamePath[]) => Promise<Record<string, unknown>>
  /**
   * 验证所有字段
   * @param nameList - 指定验证的字段名列表，不传则验证所有字段
   */
  validateFields: (nameList?: NamePath[]) => Promise<Record<string, unknown>>
  /**
   * 重置表单
   * @param nameList - 指定重置的字段名列表，不传则重置所有字段
   */
  resetFields: (nameList?: NamePath[]) => void
  /**
   * 清除验证
   * @param nameList - 指定清除验证的字段名列表，不传则清除所有字段
   */
  clearValidate: (nameList?: NamePath[]) => void
  /**
   * 获取单个字段值
   * @param name - 字段名
   */
  getFieldValue: (name: NamePath) => unknown
  /**
   * 获取多个字段值
   * @param nameList - 字段名列表，传 true 则获取所有字段（包括被删除的）
   */
  getFieldsValue: (nameList?: NamePath[] | true) => Record<string, unknown>
  /**
   * 设置单个字段值
   * @param name - 字段名
   * @param value - 字段值
   */
  setFieldValue: (name: NamePath, value: unknown) => void
  /**
   * 设置多个字段值
   * @param values - 字段值对象
   */
  setFieldsValue: (values: Record<string, unknown>) => void
  /**
   * 设置字段禁用状态
   * @param name - 字段名
   * @param disabled - 是否禁用
   */
  setFieldDisabled: (name: NamePath, disabled: boolean) => void
  /**
   * 获取表单状态
   */
  getMeta: () => FormMeta
  /**
   * 检查表单是否修改过
   */
  isDirty: () => boolean
  /**
   * 检查表单是否触碰过
   */
  isTouched: () => boolean
  /**
   * 检查表单是否有效
   */
  isValid: () => boolean
  /**
   * 获取 antd Form 实例
   */
  getFormInstance: () => FormInstance | undefined
}

/**
 * 字段变化信息
 */
export interface FieldChangeInfo {
  /** 字段名 */
  name: NamePath
  /** 字段值 */
  value: unknown
  /** 是否触碰过 */
  touched: boolean
  /** 是否验证过 */
  validating: boolean
  /** 错误信息 */
  errors: string[]
  /** 警告信息 */
  warnings?: string[]
}

/**
 * TForm 组件事件
 * @template T - 表单数据类型
 */
export interface TFormEmits<T extends Record<string, unknown> = Record<string, unknown>> {
  /** 更新表单数据 */
  (e: 'update:modelValue', value: T): void
  /** 表单提交成功 */
  (e: 'submit', values: T): void
  /** 表单提交失败 */
  (e: 'finishFailed', errorInfo: FormValidateErrorInfo): void
  /** 表单重置 */
  (e: 'reset'): void
  /** 字段值变化 */
  (e: 'change', changedValues: Partial<T>, allValues: T): void
  /** 字段变化 */
  (e: 'fieldsChange', changedFields: FieldChangeInfo[], allFields: FieldChangeInfo[]): void
}
