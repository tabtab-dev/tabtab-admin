/**
 * 表单逻辑封装
 * @description 封装表单常用的逻辑，如验证、提交等
 */
import { ref, computed } from 'vue';

/**
 * 表单字段配置
 */
export interface FormFieldConfig {
  /** 字段名 */
  name: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio';
  /** 是否必填 */
  required?: boolean;
  /** 验证规则 */
  rules?: Array<(value: any) => string | boolean>;
  /** 选项（用于 select、radio 等） */
  options?: Array<{ label: string; value: any }>;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 表单配置选项
 */
export interface UseFormOptions {
  /** 表单字段配置 */
  fields: FormFieldConfig[];
  /** 提交函数 */
  onSubmit?: (values: Record<string, any>) => Promise<void>;
  /** 初始值 */
  initialValues?: Record<string, any>;
}

/**
 * 表单 Hook
 * @param options - 配置选项
 * @returns 表单状态和操作方法
 *
 * @example
 * ```ts
 * const { values, errors, loading, validate, submit, reset } = useForm({
 *   fields: [
 *     { name: 'name', label: '姓名', required: true },
 *     { name: 'email', label: '邮箱', type: 'email', required: true },
 *   ],
 *   onSubmit: async (values) => {
 *     await usersApi.createUser(values);
 *   }
 * });
 * ```
 */
export function useForm(options: UseFormOptions) {
  const { fields, onSubmit, initialValues = {} } = options;

  // 状态
  const values = ref<Record<string, any>>({ ...initialValues });
  const errors = ref<Record<string, string>>({});
  const loading = ref(false);
  const touched = ref<Record<string, boolean>>({});

  // 初始化字段值
  fields.forEach((field) => {
    if (values.value[field.name] === undefined && field.defaultValue !== undefined) {
      values.value[field.name] = field.defaultValue;
    }
  });

  // 是否有错误
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  // 验证单个字段
  const validateField = (fieldName: string): boolean => {
    const field = fields.find((f) => f.name === fieldName);
    if (!field) return true;

    const value = values.value[fieldName];
    touched.value[fieldName] = true;

    // 必填验证
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.value[fieldName] = `${field.label}不能为空`;
      return false;
    }

    // 自定义规则验证
    if (field.rules) {
      for (const rule of field.rules) {
        const result = rule(value);
        if (result !== true) {
          errors.value[fieldName] = typeof result === 'string' ? result : `${field.label}格式不正确`;
          return false;
        }
      }
    }

    // 清除错误
    delete errors.value[fieldName];
    return true;
  };

  // 验证所有字段
  const validate = (): boolean => {
    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field.name)) {
        isValid = false;
      }
    });
    return isValid;
  };

  // 提交表单
  const submit = async () => {
    if (!validate()) return;

    loading.value = true;
    try {
      await onSubmit?.(values.value);
    } catch (error) {
      console.error('提交失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 重置表单
  const reset = () => {
    values.value = { ...initialValues };
    errors.value = {};
    touched.value = {};
  };

  // 设置字段值
  const setFieldValue = (fieldName: string, value: any) => {
    values.value[fieldName] = value;
    // 如果字段已被触碰，重新验证
    if (touched.value[fieldName]) {
      validateField(fieldName);
    }
  };

  // 设置多个字段值
  const setFieldsValue = (newValues: Record<string, any>) => {
    Object.assign(values.value, newValues);
    // 重新验证已触碰的字段
    Object.keys(touched.value).forEach((fieldName) => {
      validateField(fieldName);
    });
  };

  return {
    // 状态
    values,
    errors,
    loading,
    touched,
    hasErrors,
    // 方法
    validate,
    validateField,
    submit,
    reset,
    setFieldValue,
    setFieldsValue,
  };
}
