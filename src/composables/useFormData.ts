/**
 * 表单数据管理 Composable
 * @description 封装表单提交、验证等通用逻辑
 */
import { ref } from 'vue';
import { useApi } from './useApi';

/**
 * 表单数据配置选项
 */
export interface UseFormDataOptions<T> {
  /** API 提交函数 */
  apiCall: (data: T) => Promise<any>;
  /** 初始表单数据 */
  initialData?: T;
  /** 提交成功回调 */
  onSuccess?: (response: any) => void;
  /** 提交失败回调 */
  onError?: (error: Error) => void;
  /** 提交完成回调 */
  onComplete?: () => void;
  /** 是否重置表单（提交成功后） */
  resetOnSuccess?: boolean;
}

/**
 * 表单数据状态
 */
export interface FormDataState<T> {
  /** 表单数据 */
  formData: T;
  /** 提交状态 */
  submitting: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 是否已修改 */
  isDirty: boolean;
}

/**
 * 表单数据管理 Hook
 * @param options 配置选项
 * @returns 表单数据状态和操作方法
 *
 * @example
 * ```ts
 * const { formData, submitting, submit, reset } = useFormData({
 *   apiCall: (data) => usersApi.addUser(data),
 *   initialData: { name: '', email: '' },
 *   resetOnSuccess: true,
 * });
 * ```
 */
export function useFormData<T = Record<string, any>>(options: UseFormDataOptions<T>) {
  const {
    apiCall,
    initialData = {} as T,
    onSuccess,
    onError,
    onComplete,
    resetOnSuccess = true,
  } = options;

  const formData = ref<T>({ ...initialData });
  const isDirty = ref(false);

  const { send: submitApi, loading: submitting, error } = useApi(apiCall, {
    immediate: false,
    onSuccess: (response) => {
      if (resetOnSuccess) {
        reset();
      }
      onSuccess?.(response);
    },
    onError,
    onComplete,
  });

  /**
   * 提交表单
   */
  const submit = async () => {
    return submitApi(formData.value);
  };

  /**
   * 重置表单
   */
  const reset = () => {
    formData.value = { ...initialData };
    isDirty.value = false;
  };

  /**
   * 更新表单数据
   */
  const updateFormData = (updates: Partial<T>) => {
    formData.value = { ...formData.value, ...updates };
    isDirty.value = true;
  };

  /**
   * 设置表单字段值
   */
  const setFieldValue = <K extends keyof T>(key: K, value: T[K]) => {
    formData.value[key] = value;
    isDirty.value = true;
  };

  /**
   * 获取表单字段值
   */
  const getFieldValue = <K extends keyof T>(key: K): T[K] => {
    return formData.value[key];
  };

  return {
    formData,
    submitting,
    error,
    isDirty,
    submit,
    reset,
    updateFormData,
    setFieldValue,
    getFieldValue,
  };
}
