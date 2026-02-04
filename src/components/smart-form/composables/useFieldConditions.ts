import { ref, watch, type Ref } from 'vue'
import type { GenericObject, Path, PathValue, FormContext } from 'vee-validate'
import type { FieldCondition, FormFieldConfig } from '../types'

/**
 * 条件操作符类型
 */
export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in'

/**
 * 增强的字段条件
 */
export interface EnhancedFieldCondition<T extends GenericObject = GenericObject> {
  /** 依赖的字段名 */
  field: Path<T>
  /** 条件操作符 */
  operator?: ConditionOperator
  /** 条件值 */
  value?: PathValue<T, Path<T>> | PathValue<T, Path<T>>[]
  /** 条件函数（优先级高于 operator） */
  validator?: (value: PathValue<T, Path<T>>, formValues: T) => boolean
  /** 满足条件时的操作 */
  action: 'show' | 'hide' | 'enable' | 'disable' | 'setValue'
  /** action 为 setValue 时的目标值 */
  targetValue?: PathValue<T, Path<T>>
}

/**
 * 条件组（支持 AND/OR 组合）
 */
export interface ConditionGroup<T extends GenericObject = GenericObject> {
  /** 逻辑操作符 */
  logic: 'AND' | 'OR'
  /** 条件列表 */
  conditions: (EnhancedFieldCondition<T> | ConditionGroup<T>)[]
  /** 满足条件时的操作 */
  action: 'show' | 'hide' | 'enable' | 'disable' | 'setValue'
  /** action 为 setValue 时的目标值 */
  targetValue?: PathValue<T, Path<T>>
}

/**
 * 字段状态
 */
export interface FieldState {
  visible: boolean
  disabled: boolean
}

/**
 * 使用字段条件联动
 * @param form - VeeValidate 表单上下文
 * @param fields - 字段配置数组
 * @returns 字段状态映射
 */
export function useFieldConditions<T extends GenericObject>(
  form: FormContext<T>,
  fields: Ref<FormFieldConfig<T>[]>
) {
  const fieldStates = ref<Record<string, FieldState>>({})

  /**
   * 初始化字段状态
   */
  const initFieldStates = () => {
    fields.value.forEach((field) => {
      const fieldName = String(field.name)
      fieldStates.value[fieldName] = {
        visible: !field.hidden,
        disabled: field.disabled ?? false,
      }
    })
  }

  /**
   * 评估单个条件
   */
  const evaluateCondition = (
    condition: EnhancedFieldCondition<T>,
    formValues: T
  ): boolean => {
    const fieldValue = formValues[condition.field]

    // 如果有自定义验证函数，优先使用
    if (condition.validator) {
      return condition.validator(fieldValue, formValues)
    }

    const { operator = 'eq', value } = condition

    switch (operator) {
      case 'eq':
        return fieldValue === value
      case 'neq':
        return fieldValue !== value
      case 'gt':
        return fieldValue > (value as number)
      case 'gte':
        return fieldValue >= (value as number)
      case 'lt':
        return fieldValue < (value as number)
      case 'lte':
        return fieldValue <= (value as number)
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(value)
        }
        return String(fieldValue).includes(String(value))
      case 'startsWith':
        return String(fieldValue).startsWith(String(value))
      case 'endsWith':
        return String(fieldValue).endsWith(String(value))
      case 'in':
        if (Array.isArray(value)) {
          return value.includes(fieldValue as PathValue<T, Path<T>>)
        }
        return false
      default:
        return fieldValue === value
    }
  }

  /**
   * 递归评估条件组
   */
  const evaluateConditionGroup = (
    group: ConditionGroup<T>,
    formValues: T
  ): boolean => {
    const results = group.conditions.map((condition) => {
      if ('logic' in condition) {
        return evaluateConditionGroup(condition as ConditionGroup<T>, formValues)
      }
      return evaluateCondition(condition as EnhancedFieldCondition<T>, formValues)
    })

    return group.logic === 'AND'
      ? results.every(Boolean)
      : results.some(Boolean)
  }

  /**
   * 确保字段状态存在
   */
  const ensureFieldState = (fieldName: string, field: FormFieldConfig<T>) => {
    if (!fieldStates.value[fieldName]) {
      fieldStates.value[fieldName] = {
        visible: !field.hidden,
        disabled: field.disabled ?? false,
      }
    }
  }

  /**
   * 处理字段条件
   */
  const processConditions = () => {
    const formValues = form.values

    fields.value.forEach((field) => {
      const fieldName = String(field.name)
      const conditions = field.conditions

      // 确保字段状态存在
      ensureFieldState(fieldName, field)

      if (!conditions || conditions.length === 0) return

      // 兼容旧版条件格式
      const isLegacyCondition = (c: unknown): c is FieldCondition<T> =>
        typeof c === 'object' && c !== null && 'action' in c && !('logic' in c) && !('operator' in c)

      conditions.forEach((condition) => {
        let isMet: boolean

        if (isLegacyCondition(condition)) {
          // 旧版条件处理
          const fieldValue = formValues[condition.field]
          if (typeof condition.value === 'function') {
            isMet = condition.value(fieldValue)
          } else {
            isMet = fieldValue === condition.value
          }
        } else if ('logic' in condition) {
          // 新版条件组
          isMet = evaluateConditionGroup(condition as ConditionGroup<T>, formValues)
        } else {
          // 新版单个条件
          isMet = evaluateCondition(condition as EnhancedFieldCondition<T>, formValues)
        }

        const action = isLegacyCondition(condition) ? condition.action : (condition as EnhancedFieldCondition<T> | ConditionGroup<T>).action

        switch (action) {
          case 'show':
            fieldStates.value[fieldName].visible = isMet
            break
          case 'hide':
            fieldStates.value[fieldName].visible = !isMet
            break
          case 'enable':
            fieldStates.value[fieldName].disabled = !isMet
            break
          case 'disable':
            fieldStates.value[fieldName].disabled = isMet
            break
          case 'setValue':
            if (isMet) {
              const targetValue = isLegacyCondition(condition)
                ? condition.targetValue
                : (condition as EnhancedFieldCondition<T> | ConditionGroup<T>).targetValue
              if (targetValue !== undefined) {
                form.setFieldValue(field.name, targetValue as T[typeof field.name])
              }
            }
            break
        }
      })
    })
  }

  /**
   * 获取需要监听的字段名列表
   */
  const getWatchedFields = (): string[] => {
    const watched = new Set<string>()
    fields.value.forEach((field) => {
      field.conditions?.forEach((condition) => {
        if ('field' in condition) {
          watched.add(String(condition.field))
        }
      })
    })
    return Array.from(watched)
  }

  // 只监听有关联条件的字段
  const watchedFields = getWatchedFields()
  if (watchedFields.length > 0) {
    watch(
      () => watchedFields.map((f) => form.values[f as Path<T>]),
      () => processConditions(),
      { immediate: true }
    )
  }

  // 初始化
  initFieldStates()

  return {
    fieldStates,
    processConditions,
  }
}
