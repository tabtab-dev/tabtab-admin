import type { FormSchema } from '@/components/business/TForm'

/**
 * 通用表单配置
 */
export const commonFormConfig = {
  layout: 'horizontal' as const,
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  actions: {
    showSubmit: true,
    showReset: true,
    align: 'right' as const
  }
} as const

/**
 * 创建带通用配置的表单 Schema
 */
export function createFormSchema(config: Partial<FormSchema>): FormSchema {
  return {
    ...commonFormConfig,
    ...config,
    actions: {
      ...commonFormConfig.actions,
      ...config.actions
    }
  }
}

/**
 * 常用表单字段规则
 */
export const commonFormRules = {
  required: (message: string) => ({ required: true, message }),
  email: { type: 'email' as const, message: '邮箱格式不正确' },
  minLength: (min: number, message?: string) => ({ min, message: message || `至少${min}个字符` }),
  maxLength: (max: number, message?: string) => ({ max, message: message || `最多${max}个字符` }),
  minNumber: (min: number, message?: string) => ({ type: 'number' as const, min, message: message || `不能小于${min}` }),
  maxNumber: (max: number, message?: string) => ({ type: 'number' as const, max, message: message || `不能大于${max}` })
} as const