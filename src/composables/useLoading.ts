/**
 * 全局 Loading 状态管理
 * @description 提供全局 loading 状态管理和自动请求追踪
 */
import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';

/**
 * Loading 状态类型
 */
export type LoadingType = 'default' | 'fullscreen' | 'inline' | 'skeleton';

/**
 * Loading 配置选项
 */
export interface LoadingOptions {
  /** Loading 类型 */
  type?: LoadingType;
  /** 提示文本 */
  text?: string;
  /** 是否可取消 */
  cancelable?: boolean;
  /** 延迟显示时间（毫秒） */
  delay?: number;
  /** 最小显示时间（毫秒） */
  minDuration?: number;
}

/**
 * Loading 状态项
 */
interface LoadingState {
  id: string;
  type: LoadingType;
  text: string;
  startTime: number;
  minDuration: number;
}

/**
 * 局部 Loading 状态
 */
export interface LocalLoadingState {
  isLoading: ComputedRef<boolean>;
  text: ComputedRef<string>;
  start: (text?: string) => void;
  stop: () => void;
  wrap: <T extends (...args: any[]) => Promise<any>>(fn: T) => (...args: Parameters<T>) => Promise<ReturnType<T>>;
}

/**
 * 全局 loading 状态
 */
const loadingStates = ref<Map<string, LoadingState>>(new Map());

/**
 * 是否正在 loading
 */
const isLoading = computed(() => loadingStates.value.size > 0);

/**
 * 当前 loading 文本
 */
const loadingText = computed(() => {
  const first = loadingStates.value.values().next().value;
  return first?.text || '加载中...';
});

/**
 * 当前 loading 类型
 */
const loadingType = computed<LoadingType>(() => {
  const first = loadingStates.value.values().next().value;
  return first?.type || 'default';
});

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `loading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 开始 loading
 * @param options - Loading 配置
 * @returns loading ID，用于结束 loading
 */
export function startLoading(options: LoadingOptions = {}): string {
  const {
    type = 'default',
    text = '加载中...',
    minDuration = 0,
  } = options;

  const id = generateId();

  loadingStates.value.set(id, {
    id,
    type,
    text,
    startTime: Date.now(),
    minDuration,
  });

  return id;
}

/**
 * 结束 loading
 * @param id - Loading ID
 */
export function stopLoading(id: string): void {
  const state = loadingStates.value.get(id);
  if (!state) return;

  const elapsed = Date.now() - state.startTime;
  const remaining = state.minDuration - elapsed;

  if (remaining > 0) {
    // 如果未达到最小显示时间，延迟结束
    setTimeout(() => {
      loadingStates.value.delete(id);
    }, remaining);
  } else {
    loadingStates.value.delete(id);
  }
}

/**
 * 结束所有 loading
 */
export function stopAllLoading(): void {
  loadingStates.value.clear();
}

/**
 * 包装异步函数，自动管理 loading 状态
 * @param fn - 异步函数
 * @param options - Loading 配置
 * @returns 包装后的函数
 */
export function withLoading<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: LoadingOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const id = startLoading(options);
    try {
      return await fn(...args);
    } finally {
      stopLoading(id);
    }
  };
}

/**
 * 创建局部 loading 状态
 * @returns 局部 loading 状态和方法
 */
export function useLocalLoading(): LocalLoadingState {
  const localLoading = ref(false);
  const localLoadingText = ref('加载中...');

  const start = (text = '加载中...') => {
    localLoading.value = true;
    localLoadingText.value = text;
  };

  const stop = () => {
    localLoading.value = false;
  };

  const wrap = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      start();
      try {
        return await fn(...args);
      } finally {
        stop();
      }
    };
  };

  return {
    isLoading: computed(() => localLoading.value),
    text: computed(() => localLoadingText.value),
    start,
    stop,
    wrap,
  };
}

/**
 * 全局 Loading 状态组合式函数
 * @returns Loading 状态和方法
 */
export function useLoading() {
  return {
    // 状态
    isLoading,
    loadingText,
    loadingType,
    loadingCount: computed(() => loadingStates.value.size),

    // 方法
    start: startLoading,
    stop: stopLoading,
    stopAll: stopAllLoading,
    wrap: withLoading,
  };
}

/**
 * 使用示例：
 *
 * // 1. 全局 loading
 * const { isLoading, start, stop, wrap } = useLoading();
 *
 * // 手动控制
 * const id = startLoading({ text: '保存中...', type: 'fullscreen' });
 * await saveData();
 * stopLoading(id);
 *
 * // 自动包装
 * const saveWithLoading = wrap(saveData, { text: '保存中...' });
 * await saveWithLoading();
 *
 * // 2. 局部 loading
 * const { isLoading, start, stop, wrap } = useLocalLoading();
 *
 * // 在模板中使用
 * <Button :loading="isLoading">保存</Button>
 *
 * // 3. 在组件中使用
 * const submit = async () => {
 *   const id = startLoading({ text: '提交中...' });
 *   try {
 *     await submitForm();
 *   } finally {
 *     stopLoading(id);
 *   }
 * };
 */
