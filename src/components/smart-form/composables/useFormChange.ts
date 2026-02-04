import { ref, watch, type Ref } from 'vue'
import type { GenericObject, FormContext } from 'vee-validate'

/**
 * 防抖函数
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * 使用表单变更监听
 * @param form - VeeValidate 表单上下文
 * @param emit - 变更事件触发函数
 * @param options - 配置选项
 */
export function useFormChange<T extends GenericObject>(
  form: FormContext<T>,
  emit: (event: 'change', values: Partial<T>) => void,
  options: {
    /** 是否启用防抖 */
    debounce?: boolean
    /** 防抖延迟时间（毫秒） */
    debounceDelay?: number
    /** 是否立即触发 */
    immediate?: boolean
  } = {}
) {
  const { debounce: enableDebounce = false, debounceDelay = 300, immediate = false } = options

  const lastEmittedValues = ref<Partial<T>>({})

  const emitChange = (values: Partial<T>) => {
    // 简单比较，避免重复触发
    const hasChanged = JSON.stringify(values) !== JSON.stringify(lastEmittedValues.value)
    if (hasChanged) {
      lastEmittedValues.value = { ...values }
      emit('change', values)
    }
  }

  const debouncedEmit = enableDebounce
    ? debounce(emitChange, debounceDelay)
    : emitChange

  // 监听表单值变化
  const stopWatch = watch(
    () => form.values,
    (newValues) => {
      debouncedEmit(newValues)
    },
    { deep: true, immediate }
  )

  return {
    stopWatch,
    emitChange,
  }
}
