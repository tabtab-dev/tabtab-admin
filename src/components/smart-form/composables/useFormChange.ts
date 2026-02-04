import { ref, watch, type Ref, onUnmounted } from 'vue'
import type { GenericObject, FormContext } from 'vee-validate'

/**
 * 深度比较两个值是否相等
 * @param a - 第一个值
 * @param b - 第二个值
 * @returns 是否相等
 */
function deepEqual(a: unknown, b: unknown): boolean {
  // 处理基本类型和相同引用
  if (a === b) return true

  // 处理 null 和 undefined
  if (a == null || b == null) return a === b

  // 处理不同类型的值
  if (typeof a !== typeof b) return false

  // 处理 Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  // 处理 Array
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  // 处理普通对象
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object)
    const keysB = Object.keys(b as object)

    if (keysA.length !== keysB.length) return false

    return keysA.every(key =>
      keysB.includes(key) && deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    )
  }

  return false
}

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
    // 使用深度比较，避免重复触发
    const hasChanged = !deepEqual(values, lastEmittedValues.value)
    if (hasChanged) {
      // 使用深拷贝保存上次发出的值
      lastEmittedValues.value = JSON.parse(JSON.stringify(values))
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

  // 组件卸载时清理监听器
  onUnmounted(() => {
    stopWatch()
  })

  return {
    stopWatch,
    emitChange,
  }
}
