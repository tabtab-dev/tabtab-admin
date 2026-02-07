/**
 * useFieldState - 字段状态管理 Composable
 *
 * @description 管理字段的禁用、隐藏等动态状态
 * @example
 *   const { setFieldDisabled, setFieldHidden, getFieldDisabled, getFieldHidden } = useFieldState()
 */
import { reactive } from 'vue'
import type { FormField, NamePath } from '../types'

/**
 * 获取字段名的字符串表示
 * @param name - 字段名
 * @returns 字符串形式的字段名
 */
export function getFieldKey(name: NamePath): string {
  if (Array.isArray(name)) {
    return name.join('.')
  }
  return String(name)
}

/**
 * 字段状态管理
 * @returns 字段状态管理方法
 */
export function useFieldState() {
  /**
   * 字段禁用状态映射
   */
  const fieldDisabledMap = reactive<Map<string, boolean>>(new Map())

  /**
   * 字段隐藏状态映射
   */
  const fieldHiddenMap = reactive<Map<string, boolean>>(new Map())

  /**
   * 设置字段禁用状态
   * @param name - 字段名
   * @param disabled - 是否禁用
   */
  function setFieldDisabled(name: NamePath, disabled: boolean): void {
    const key = getFieldKey(name)
    fieldDisabledMap.set(key, disabled)
  }

  /**
   * 设置字段隐藏状态
   * @param name - 字段名
   * @param hidden - 是否隐藏
   */
  function setFieldHidden(name: NamePath, hidden: boolean): void {
    const key = getFieldKey(name)
    fieldHiddenMap.set(key, hidden)
  }

  /**
   * 获取字段禁用状态
   * @param field - 字段配置
   * @param formData - 表单数据
   * @returns 是否禁用
   */
  function getFieldDisabled(field: FormField, formData: Record<string, any>): boolean {
    const key = getFieldKey(field.name)
    if (fieldDisabledMap.has(key)) {
      return fieldDisabledMap.get(key)!
    }
    if (typeof field.disabled === 'function') {
      return field.disabled(formData)
    }
    return field.disabled ?? false
  }

  /**
   * 获取字段隐藏状态
   * @param field - 字段配置
   * @param formData - 表单数据
   * @returns 是否隐藏
   */
  function getFieldHidden(field: FormField, formData: Record<string, any>): boolean {
    const key = getFieldKey(field.name)
    if (fieldHiddenMap.has(key)) {
      return fieldHiddenMap.get(key)!
    }
    if (typeof field.hidden === 'function') {
      return field.hidden(formData)
    }
    return field.hidden ?? false
  }

  /**
   * 清除所有动态状态
   */
  function clearFieldStates(): void {
    fieldDisabledMap.clear()
    fieldHiddenMap.clear()
  }

  return {
    fieldDisabledMap,
    fieldHiddenMap,
    setFieldDisabled,
    setFieldHidden,
    getFieldDisabled,
    getFieldHidden,
    clearFieldStates
  }
}
