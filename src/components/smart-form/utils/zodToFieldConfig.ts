import type { ZodTypeAny, ZodObject } from 'zod'
import type { FormFieldConfig, FieldType } from '../types'
import type { GenericObject } from 'vee-validate'

/**
 * 从 Zod schema 推断字段类型
 */
function inferFieldType(schema: ZodTypeAny): FieldType {
  // 解包可选类型和默认值类型
  let unwrapped = schema
  while (unwrapped._def.typeName === 'ZodOptional' || unwrapped._def.typeName === 'ZodDefault') {
    unwrapped = unwrapped._def.innerType || unwrapped._def.schema
  }

  const typeName = unwrapped._def.typeName

  switch (typeName) {
    case 'ZodString': {
      const checks = (unwrapped as any)._def.checks || []

      // 检查是否是邮箱
      if (checks.some((check: any) => check.kind === 'email')) {
        return 'email'
      }

      // 检查是否是 URL
      if (checks.some((check: any) => check.kind === 'url')) {
        return 'text'
      }

      // 检查是否是 UUID
      if (checks.some((check: any) => check.kind === 'uuid')) {
        return 'text'
      }

      // 检查长度判断是否是长文本
      const maxCheck = checks.find((check: any) => check.kind === 'max')
      if (maxCheck && (maxCheck as any).value > 100) {
        return 'textarea'
      }

      return 'text'
    }

    case 'ZodNumber':
    case 'ZodBigInt':
      return 'number'

    case 'ZodBoolean':
      return 'switch'

    case 'ZodDate':
      return 'date'

    case 'ZodArray':
      return 'tags'

    case 'ZodEnum':
    case 'ZodNativeEnum':
      return 'select'

    case 'ZodObject':
      // 检查是否是日期范围
      const shape = (unwrapped as ZodObject<any>).shape
      if (shape && 'from' in shape && 'to' in shape) {
        return 'date-range'
      }
      return 'custom'

    case 'ZodLiteral':
      return 'text'

    case 'ZodUnion':
      // 对于联合类型，尝试推断第一个选项的类型
      const options = unwrapped._def.options
      if (options && options.length > 0) {
        return inferFieldType(options[0])
      }
      return 'text'

    case 'ZodIntersection':
      return inferFieldType(unwrapped._def.left)

    case 'ZodRecord':
    case 'ZodMap':
      return 'custom'

    case 'ZodTuple':
      return 'custom'

    case 'ZodNullable':
    case 'ZodNull':
      return inferFieldType(unwrapped._def.innerType || unwrapped)

    case 'ZodEffects':
      // 对于转换效果，尝试推断源类型
      return inferFieldType(unwrapped._def.schema)

    case 'ZodPipeline':
      return inferFieldType(unwrapped._def.in)

    default:
      return 'text'
  }
}

/**
 * 从 Zod schema 提取验证规则
 */
function extractValidation(schema: ZodTypeAny): { min?: number; max?: number; pattern?: RegExp } {
  const result: { min?: number; max?: number; pattern?: RegExp } = {}

  // 解包可选类型和默认值类型
  let unwrapped = schema
  while (unwrapped._def.typeName === 'ZodOptional' || unwrapped._def.typeName === 'ZodDefault') {
    unwrapped = unwrapped._def.innerType || unwrapped._def.schema
  }

  if (unwrapped._def.typeName === 'ZodString') {
    const checks = unwrapped._def.checks || []
    checks.forEach((check: any) => {
      if (check.kind === 'min') result.min = check.value
      if (check.kind === 'max') result.max = check.value
      if (check.kind === 'regex') result.pattern = check.regex
    })
  } else if (unwrapped._def.typeName === 'ZodNumber') {
    const checks = unwrapped._def.checks || []
    checks.forEach((check: any) => {
      if (check.kind === 'min') result.min = check.value
      if (check.kind === 'max') result.max = check.value
    })
  } else if (unwrapped._def.typeName === 'ZodArray') {
    const checks = unwrapped._def.checks || []
    checks.forEach((check: any) => {
      if (check.kind === 'min') result.min = check.value
      if (check.kind === 'max') result.max = check.value
    })
  }

  return result
}

/**
 * 从 Zod schema 提取默认值
 */
function extractDefaultValue(schema: ZodTypeAny): unknown {
  if (schema._def.typeName === 'ZodDefault') {
    return schema._def.defaultValue()
  }
  return undefined
}

/**
 * 检查字段是否必填
 */
function isRequired(schema: ZodTypeAny): boolean {
  // 如果不是可选类型，则是必填的
  return schema._def.typeName !== 'ZodOptional' && schema._def.typeName !== 'ZodDefault'
}

/**
 * 从 Zod enum 提取选项
 */
function extractEnumOptions(schema: ZodTypeAny): Array<{ label: string; value: string }> | undefined {
  let unwrapped = schema
  while (unwrapped._def.typeName === 'ZodOptional' || unwrapped._def.typeName === 'ZodDefault') {
    unwrapped = unwrapped._def.innerType || unwrapped._def.schema
  }

  if (unwrapped._def.typeName === 'ZodEnum') {
    const values = unwrapped._def.values || []
    return values.map((value: string) => ({
      label: value.charAt(0).toUpperCase() + value.slice(1),
      value,
    }))
  }

  if (unwrapped._def.typeName === 'ZodNativeEnum') {
    const enumObj = unwrapped._def.values
    return Object.entries(enumObj)
      .filter(([key]) => isNaN(Number(key))) // 过滤掉反向映射
      .map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: value as string,
      }))
  }

  return undefined
}

/**
 * 将 Zod schema 转换为表单字段配置
 * @param schema - Zod schema
 * @param options - 转换选项
 * @returns 表单字段配置数组
 */
export function zodToFieldConfig<T extends GenericObject>(
  schema: ZodObject<any>,
  options: {
    /** 字段标签映射 */
    labels?: Record<string, string>
    /** 字段占位符映射 */
    placeholders?: Record<string, string>
    /** 字段描述映射 */
    descriptions?: Record<string, string>
    /** 自定义字段类型映射 */
    fieldTypes?: Record<string, FieldType>
    /** 字段顺序 */
    order?: string[]
    /** 排除的字段 */
    exclude?: string[]
  } = {}
): FormFieldConfig<T>[] {
  const shape = schema.shape
  const fields: FormFieldConfig<T>[] = []

  const fieldNames = Object.keys(shape)

  // 根据 order 排序字段
  const sortedFieldNames = options.order
    ? [...options.order, ...fieldNames.filter(name => !options.order!.includes(name))]
    : fieldNames

  sortedFieldNames.forEach(name => {
    // 跳过排除的字段
    if (options.exclude?.includes(name)) return

    const fieldSchema = shape[name]
    const fieldType = options.fieldTypes?.[name] || inferFieldType(fieldSchema)
    const validation = extractValidation(fieldSchema)
    const defaultValue = extractDefaultValue(fieldSchema)
    const required = isRequired(fieldSchema)
    const options_list = extractEnumOptions(fieldSchema)

    const field: FormFieldConfig<T> = {
      name: name as any,
      type: fieldType,
      label: options.labels?.[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
      placeholder: options.placeholders?.[name],
      description: options.descriptions?.[name],
      required,
      defaultValue: defaultValue as any,
    }

    // 添加选项（如果是选择类型）
    if (options_list && (fieldType === 'select' || fieldType === 'radio' || fieldType === 'combobox')) {
      field.options = options_list
    }

    // 添加滑块配置（如果是滑块类型）
    if (fieldType === 'slider' && (validation.min !== undefined || validation.max !== undefined)) {
      field.sliderConfig = {
        min: validation.min ?? 0,
        max: validation.max ?? 100,
        step: 1,
      }
    }

    fields.push(field)
  })

  return fields
}

/**
 * 创建自动表单配置
 * @param schema - Zod schema
 * @param options - 配置选项
 * @returns 完整的表单配置
 */
export function createAutoFormConfig<T extends GenericObject>(
  schema: ZodObject<any>,
  options: {
    /** 表单标题 */
    title?: string
    /** 表单描述 */
    description?: string
    /** 字段配置 */
    fields?: Partial<Record<string, Partial<FormFieldConfig<T>>>>
    /** 提交按钮文本 */
    submitText?: string
    /** 验证时机 */
    validateOnBlur?: boolean
    validateOnChange?: boolean
  } = {}
) {
  const baseFields = zodToFieldConfig<T>(schema)

  // 合并自定义字段配置
  const mergedFields = baseFields.map(field => ({
    ...field,
    ...options.fields?.[field.name as string],
  }))

  return {
    title: options.title,
    description: options.description,
    fields: mergedFields,
    submitText: options.submitText || '提交',
    validateOnBlur: options.validateOnBlur ?? true,
    validateOnChange: options.validateOnChange ?? false,
  }
}
