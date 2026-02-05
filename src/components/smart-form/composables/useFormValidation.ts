import { computed, ref, type Ref } from 'vue'
import type { GenericObject, FormContext } from 'vee-validate'
import type { ZodType } from 'zod'

/**
 * 表单验证错误
 */
export interface FormValidationError {
  path: string
  message: string
  code: string
}

/**
 * 使用表单验证
 * @param form - vee-validate 表单上下文
 * @param validationSchema - Zod 验证 schema
 */
export function useFormValidation<T extends GenericObject>(
  form: FormContext<T>,
  validationSchema?: Ref<ZodType<T> | undefined>
) {
  // 实时验证模式
  const validateOnChange = ref(false)
  const validateOnBlur = ref(true)

  // 验证状态
  const isValidating = ref(false)
  const validationErrors = ref<FormValidationError[]>([])

  /**
   * 验证单个字段
   */
  const validateField = async (fieldName: string): Promise<boolean> => {
    if (!validationSchema?.value) return true

    try {
      const result = await form.validateField(fieldName as any)
      return result.valid
    } catch {
      return false
    }
  }

  /**
   * 验证整个表单
   */
  const validateForm = async (): Promise<boolean> => {
    isValidating.value = true
    validationErrors.value = []

    try {
      const result = await form.validate()

      if (!result.valid && validationSchema?.value) {
        // 解析验证错误
        const parseResult = validationSchema.value.safeParse(form.values)
        if (!parseResult.success) {
          validationErrors.value = parseResult.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code,
          }))
        }
      }

      return result.valid
    } finally {
      isValidating.value = false
    }
  }

  /**
   * 获取字段错误
   */
  const getFieldError = (fieldName: string): string | undefined => {
    const error = validationErrors.value.find(e => e.path === fieldName)
    return error?.message
  }

  /**
   * 清除验证错误
   */
  const clearValidationErrors = () => {
    validationErrors.value = []
    form.setErrors({})
  }

  /**
   * 设置验证模式
   */
  const setValidationMode = (options: {
    validateOnChange?: boolean
    validateOnBlur?: boolean
  }) => {
    if (options.validateOnChange !== undefined) {
      validateOnChange.value = options.validateOnChange
    }
    if (options.validateOnBlur !== undefined) {
      validateOnBlur.value = options.validateOnBlur
    }
  }

  /**
   * 错误汇总（用于显示所有错误）
   */
  const errorSummary = computed(() => {
    if (validationErrors.value.length === 0) return null
    
    return {
      count: validationErrors.value.length,
      errors: validationErrors.value,
    }
  })

  return {
    // 状态
    isValidating,
    validationErrors,
    validateOnChange,
    validateOnBlur,
    errorSummary,
    
    // 方法
    validateField,
    validateForm,
    getFieldError,
    clearValidationErrors,
    setValidationMode,
  }
}
