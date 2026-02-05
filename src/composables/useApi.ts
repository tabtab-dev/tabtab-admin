/**
 * API 请求封装
 * @description 封装 Alova 的请求方法，提供统一的请求状态管理和错误处理
 */
import { useRequest } from 'alova/client';
import type { Method } from 'alova';
import type { Ref } from 'vue';
import { httpClient } from '@/api';

/**
 * 通用请求配置选项
 */
export interface UseApiOptions {
  /** 是否立即发起请求 */
  immediate?: boolean;
  /** 初始数据 */
  initialData?: any;
  /** 请求成功回调 */
  onSuccess?: (data: any) => void;
  /** 请求失败回调 */
  onError?: (error: Error) => void;
  /** 请求完成回调（无论成功失败） */
  onComplete?: () => void;
}

/**
 * 通用 API 请求 Hook
 * @param methodHandler - 请求方法或获取方法的函数
 * @param options - 配置选项
 * @returns 请求状态和操作方法
 *
 * @example
 * ```ts
 * const { data, loading, error, send } = useApi(
 *   () => httpClient.Get('/users'),
 *   { immediate: true }
 * );
 * ```
 */
export function useApi<T = any>(
  methodHandler: Method | (() => Method),
  options: UseApiOptions = {}
) {
  const { immediate = true, initialData, onSuccess, onError, onComplete } = options;

  const { data, loading, error, send, abort, update } = useRequest(methodHandler, {
    immediate,
    initialData,
  });

  // 包装 send 方法，添加回调处理
  const sendWithCallbacks = async (...args: any[]): Promise<T> => {
    try {
      const result = await send(...args);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
      throw error;
    } finally {
      onComplete?.();
    }
  };

  return {
    /** 响应数据 */
    data: data as Ref<T>,
    /** 加载状态 */
    loading,
    /** 错误信息 */
    error,
    /** 发起请求 */
    send: sendWithCallbacks,
    /** 中断请求 */
    abort,
    /** 更新数据 */
    update,
  };
}

// 导出 HTTP 客户端供直接使用
export { httpClient };
