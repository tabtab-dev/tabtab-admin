/**
 * useFormMeta - 表单状态管理 Composable
 *
 * @description 管理表单的 dirty、touched、valid 等元数据状态
 * @example
 *   const { meta, updateMeta, markTouched, resetMeta } = useFormMeta()
 */
import { reactive, ref } from 'vue'
import type { FormMeta } from '../types'

/**
 * 深拷贝对象 - 使用 JSON 方法，处理函数和特殊对象
 * @param data - 需要拷贝的数据
 * @returns 深拷贝后的数据
 */
function deepClone<T>(data: T): T {
  try {
    // 尝试使用 JSON 方法进行深拷贝
    // 这样可以处理包含函数的情况（函数会被忽略）
    return JSON.parse(JSON.stringify(data))
  } catch (e) {
    // 如果失败（如循环引用），返回原数据的浅拷贝
    console.warn('[useFormMeta] 深拷贝失败，使用浅拷贝', e)
    return Array.isArray(data) ? [...data] as T : { ...data }
  }
}

/**
 * 快速比较两个对象是否相等 - 用于 dirty 状态检查
 * @param a - 对象A
 * @param b - 对象B
 * @returns 是否相等
 */
function isEqual(a: Record<string, any>, b: Record<string, any>): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    const valA = a[key]
    const valB = b[key]

    // 处理日期对象
    if (valA instanceof Date && valB instanceof Date) {
      if (valA.getTime() !== valB.getTime()) return false
      continue
    }

    // 处理基本类型和数组
    if (typeof valA !== typeof valB) return false

    if (typeof valA === 'object' && valA !== null && valB !== null) {
      if (Array.isArray(valA) && Array.isArray(valB)) {
        if (valA.length !== valB.length) return false
        for (let i = 0; i < valA.length; i++) {
          if (typeof valA[i] === 'object' && valA[i] !== null) {
            if (!isEqual(valA[i], valB[i])) return false
          } else if (valA[i] !== valB[i]) {
            return false
          }
        }
        continue
      }
      if (!isEqual(valA, valB)) return false
      continue
    }

    if (valA !== valB) return false
  }

  return true
}

/**
 * 表单状态管理
 * @returns 表单状态管理方法
 */
export function useFormMeta() {
  /**
   * 表单状态管理
   */
  const meta = reactive<FormMeta>({
    /** 是否修改过 */
    dirty: false,
    /** 是否触碰过 */
    touched: false,
    /** 是否验证通过 */
    valid: true,
    /** 是否提交中 */
    submitting: false,
    /** 是否验证中 */
    validating: false
  })

  /**
   * 原始表单数据（用于比较 dirty 状态）
   */
  const initialFormData = ref<Record<string, any>>({})

  /**
   * 保存初始表单数据
   * @param data - 表单数据
   */
  function setInitialData(data: Record<string, any>): void {
    initialFormData.value = deepClone(data)
  }

  /**
   * 更新表单状态
   * @param formData - 当前表单数据
   */
  function updateMeta(formData: Record<string, any>): void {
    // 使用快速比较算法检查 dirty 状态，避免 JSON.stringify 的性能开销
    meta.dirty = !isEqual(formData, initialFormData.value)
  }

  /**
   * 标记表单为已触碰
   */
  function markTouched(): void {
    meta.touched = true
  }

  /**
   * 设置验证状态
   * @param valid - 是否有效
   */
  function setValid(valid: boolean): void {
    meta.valid = valid
  }

  /**
   * 设置提交状态
   * @param submitting - 是否提交中
   */
  function setSubmitting(submitting: boolean): void {
    meta.submitting = submitting
  }

  /**
   * 设置验证中状态
   * @param validating - 是否验证中
   */
  function setValidating(validating: boolean): void {
    meta.validating = validating
  }

  /**
   * 重置表单状态
   */
  function resetMeta(): void {
    meta.dirty = false
    meta.touched = false
    meta.valid = true
    meta.submitting = false
    meta.validating = false
    initialFormData.value = {}
  }

  /**
   * 获取表单状态快照
   * @returns 表单状态
   */
  function getMetaSnapshot(): FormMeta {
    return { ...meta }
  }

  return {
    meta,
    initialFormData,
    setInitialData,
    updateMeta,
    markTouched,
    setValid,
    setSubmitting,
    setValidating,
    resetMeta,
    getMetaSnapshot
  }
}
