/**
 * useFormWatch - 表单字段监听 Composable
 *
 * @description 管理表单字段的 watch 监听逻辑
 * @example
 *   const { allWatches, executeWatches } = useFormWatch(fields, formData, formMethods)
 */
import { computed, nextTick } from 'vue'
import type { FormField, FieldWatch, FormMethods, NamePath } from '../types'
import { getFieldKey } from './useFieldState'

/**
 * 表单字段监听管理
 * @param fields - 表单字段配置
 * @param formData - 表单数据
 * @param formMethods - 表单方法
 * @returns 监听管理方法
 */
export function useFormWatch(
  fields: FormField[],
  formData: Record<string, any>,
  formMethods: FormMethods
) {
  /**
   * 收集所有字段的 watch 配置
   */
  const allWatches = computed(() => {
    const watches: Array<{ fieldKey: string; watch: FieldWatch }> = []
    fields.forEach((field) => {
      if (field.watch && field.watch.length > 0) {
        field.watch.forEach((w) => {
          watches.push({ fieldKey: getFieldKey(field.name), watch: w })
        })
      }
    })
    return watches
  })

  /**
   * 执行字段 watch 回调
   * @param changedValues - 变化的值
   */
  function executeWatches(changedValues: Record<string, any>): void {
    nextTick(() => {
      allWatches.value.forEach(({ watch }) => {
        const watchedField = watch.field
        if (watchedField in changedValues) {
          const value = formData[watchedField as string]
          watch.handler(value, { ...formData }, formMethods)
        }
      })
    })
  }

  /**
   * 获取指定字段的 watch 配置
   * @param fieldName - 字段名
   * @returns watch 配置数组
   */
  function getFieldWatches(fieldName: NamePath): FieldWatch[] {
    const key = getFieldKey(fieldName)
    const field = fields.find(f => getFieldKey(f.name) === key)
    return field?.watch || []
  }

  return {
    allWatches,
    executeWatches,
    getFieldWatches
  }
}
