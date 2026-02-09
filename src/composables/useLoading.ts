/**
 * 全局 Loading 状态管理
 * @description 提供全局 loading 状态管理和自动请求追踪
 */
import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';

export type LoadingType = 'default' | 'fullscreen' | 'inline' | 'skeleton';

export interface LoadingOptions {
  type?: LoadingType;
  text?: string;
  minDuration?: number;
}

interface LoadingState {
  id: string;
  type: LoadingType;
  text: string;
  startTime: number;
  minDuration: number;
}

export interface LocalLoadingState {
  isLoading: ComputedRef<boolean>;
  text: ComputedRef<string>;
  start: (text?: string) => void;
  stop: () => void;
  wrap: <T extends (...args: any[]) => Promise<any>>(fn: T) => (...args: Parameters<T>) => Promise<ReturnType<T>>;
}

const loadingStates = ref<Map<string, LoadingState>>(new Map());

const isLoading = computed(() => loadingStates.value.size > 0);
const loadingText = computed(() => loadingStates.value.values().next().value?.text || '加载中...');
const loadingType = computed<LoadingType>(() => loadingStates.value.values().next().value?.type || 'default');

let idCounter = 0;

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `loading_${Date.now()}_${++idCounter}`;
}

/**
 * 创建异步函数包装器
 */
function createWrap<T extends (...args: any[]) => Promise<any>>(
  start: () => string,
  stop: (id: string) => void
): (fn: T) => (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (fn: T) => async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const id = start();
    try {
      return await fn(...args);
    } finally {
      stop(id);
    }
  };
}

/**
 * 开始 loading
 * @returns loading ID，用于停止 loading
 */
export function startLoading(options: LoadingOptions = {}): string {
  const id = generateId();
  loadingStates.value.set(id, {
    id,
    type: options.type || 'default',
    text: options.text || '加载中...',
    startTime: Date.now(),
    minDuration: options.minDuration || 0,
  });
  return id;
}

/**
 * 停止指定 loading
 */
export function stopLoading(id: string): void {
  const state = loadingStates.value.get(id);
  if (!state) return;

  const elapsed = Date.now() - state.startTime;
  const remaining = state.minDuration - elapsed;

  if (remaining > 0) {
    setTimeout(() => loadingStates.value.delete(id), remaining);
  } else {
    loadingStates.value.delete(id);
  }
}

/**
 * 停止所有 loading
 */
export function stopAllLoading(): void {
  loadingStates.value.clear();
}

/**
 * 包装异步函数，自动管理 loading 状态
 */
export function withLoading<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: LoadingOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return createWrap(
    () => startLoading(options),
    stopLoading
  )(fn);
}

/**
 * 本地 loading 状态管理（组件级别）
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

  return {
    isLoading: computed(() => localLoading.value),
    text: computed(() => localLoadingText.value),
    start,
    stop,
    wrap: createWrap(
      () => { start(); return 'local'; },
      () => stop()
    ),
  };
}

/**
 * 全局 loading 状态管理
 */
export function useLoading() {
  return {
    isLoading,
    loadingText,
    loadingType,
    loadingCount: computed(() => loadingStates.value.size),
    start: startLoading,
    stop: stopLoading,
    stopAll: stopAllLoading,
    wrap: withLoading,
  };
}
