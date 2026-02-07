/**
 * API 请求封装
 * @description 封装 Alova 的请求方法，提供统一的请求状态管理和错误处理
 */
import { useRequest, useFetcher } from 'alova/client';
import type { Method } from 'alova';
import type { Ref } from 'vue';
import { toast } from 'vue-sonner';
import { httpClient } from '@/api';

/**
 * useQuery 配置选项
 */
export interface UseQueryOptions {
  /** 是否立即发起请求 */
  immediate?: boolean;
  /** 初始数据 */
  initialData?: any;
  /** 请求成功回调 */
  onSuccess?: (data: any) => void;
  /** 请求失败回调 */
  onError?: (error: Error | null) => void;
}

/**
 * useMutation 配置选项
 */
export interface UseMutationOptions<TVariables = any, TData = any> {
  /** 变更函数 */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** 成功回调 */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** 失败回调 */
  onError?: (error: Error | null, variables: TVariables) => void;
  /** 完成回调 */
  onComplete?: () => void;
  /** 成功提示消息，设为 false 则不显示 */
  successMessage?: string | false;
}

/**
 * 查询操作 Hook（使用 useRequest）
 * @param methodHandler - 请求方法
 * @param options - 配置选项
 * @returns 请求状态和操作方法
 *
 * @example
 * ```ts
 * const { data, loading, fetchData } = useQuery(
 *   () => usersApi.getUsers(),
 *   { immediate: true }
 * );
 * ```
 */
export function useQuery<T = any>(
  methodHandler: Method | (() => Method),
  options: UseQueryOptions = {}
) {
  const { immediate = true, initialData, onSuccess, onError } = options;

  const { data, loading, error, send, abort, update } = useRequest(methodHandler, {
    immediate,
    initialData,
  });

  const fetchData = async (...args: any[]): Promise<T | null> => {
    try {
      const result = await send(...args);
      if (result === null) {
        onError?.(error.value || new Error('请求失败'));
        return null;
      }
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
      return null;
    }
  };

  return {
    data: data as Ref<T>,
    loading,
    error,
    send: fetchData,
    abort,
    update,
    fetchData,
  };
}

/**
 * 变更操作 Hook（使用 useFetcher）
 * @param options - 配置选项
 * @returns 变更状态和操作方法
 *
 * @example
 * ```ts
 * const { mutate: createUser, loading } = useMutation({
 *   mutationFn: (values) => usersApi.createUser(values),
 *   onSuccess: () => {
 *     isAddDialogOpen.value = false
 *     fetchData()
 *   }
 * });
 * ```
 */
export function useMutation<TVariables = any, TData = any>(
  options: UseMutationOptions<TVariables, TData>
) {
  const { mutationFn, onSuccess, onError, onComplete, successMessage = '操作成功' } = options;

  const { loading, send, abort } = useFetcher();

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    try {
      const result = await send(mutationFn(variables));
      if (result === null) {
        const error = new Error('操作失败');
        onError?.(error, variables);
        return null;
      }
      // 显示成功提示
      if (successMessage !== false) {
        toast.success(successMessage);
      }
      onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error, variables);
      return null;
    } finally {
      onComplete?.();
    }
  };

  return {
    mutate,
    loading,
    abort,
  };
}

export { httpClient };
