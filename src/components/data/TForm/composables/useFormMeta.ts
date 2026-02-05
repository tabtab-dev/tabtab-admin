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
    initialFormData.value = JSON.parse(JSON.stringify(data))
  }

  /**
   * 更新表单状态
   * @param formData - 当前表单数据
   */
  function updateMeta(formData: Record<string, any>): void {
    // 检查 dirty 状态
    meta.dirty = JSON.stringify(formData) !== JSON.stringify(initialFormData.value)
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
