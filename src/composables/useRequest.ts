/**
 * API 请求封装
 * @description 封装 Alova 的请求方法，提供统一的请求状态管理和错误处理
 */
import { useRequest as useAlovaRequest, useFetcher } from 'alova/client';
import type { Method } from 'alova';
import type { Ref } from 'vue';
import { toast } from 'vue-sonner';
import { api } from '@/api';
import { normalizeError, type AppError } from '@/utils/errorHandler';

export interface UseQueryOptions<T = any> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

export interface UseQueryReturn<T> {
  readonly data: Ref<T | undefined>;
  readonly loading: Ref<boolean>;
  readonly error: Ref<AppError | null>;
  send: (...args: any[]) => Promise<T | null>;
  abort: () => void;
  update: (updater: (data: T) => T) => void;
}

export interface UseMutationOptions<TVariables = any, TData = any> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: AppError, variables: TVariables) => void;
  onComplete?: () => void;
  successMessage?: string | false;
}

export interface UseMutationReturn<TVariables, TData> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  readonly loading: Ref<boolean>;
  abort: () => void;
}

/**
 * 处理请求结果
 */
function handleRequestResult<T>(
  result: T | null,
  error: unknown,
  onSuccess?: (data: T) => void,
  onError?: (error: AppError) => void
): T | null {
  if (result === null) {
    const appError = normalizeError(error || new Error('请求失败'));
    onError?.(appError);
    return null;
  }
  onSuccess?.(result);
  return result;
}

/**
 * 查询操作 Hook
 */
export function useQuery<T = any>(
  methodHandler: Method | (() => Method),
  options: UseQueryOptions<T> = {}
): UseQueryReturn<T> {
  const { immediate = true, initialData, onSuccess, onError } = options;

  const { data, loading, error, send, abort, update } = useAlovaRequest(methodHandler, {
    immediate,
    initialData,
  });

  const fetchData = async (...args: any[]): Promise<T | null> => {
    try {
      const result = await send(...args);
      return handleRequestResult(result, error.value, onSuccess, onError);
    } catch (err) {
      const appError = normalizeError(err);
      onError?.(appError);
      return null;
    }
  };

  return {
    data: data as Ref<T | undefined>,
    loading: loading as Ref<boolean>,
    error: error as Ref<AppError | null>,
    send: fetchData,
    abort,
    update,
  };
}

/**
 * 变更操作 Hook
 */
export function useMutation<TVariables = any, TData = any>(
  options: UseMutationOptions<TVariables, TData>
): UseMutationReturn<TVariables, TData> {
  const { mutationFn, onSuccess, onError, onComplete, successMessage = '操作成功' } = options;

  const { loading, send, abort } = useFetcher();

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    try {
      const result = await send(mutationFn(variables));
      if (result === null) {
        const error = normalizeError(new Error('操作失败'));
        onError?.(error, variables);
        return null;
      }
      if (successMessage !== false) {
        toast.success(successMessage);
      }
      onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = normalizeError(err);
      onError?.(error, variables);
      return null;
    } finally {
      onComplete?.();
    }
  };

  return {
    mutate,
    loading: loading as Ref<boolean>,
    abort,
  };
}

export { api };
