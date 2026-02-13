/**
 * 统一错误处理
 * @description 提供应用级别的错误处理机制和错误类定义
 */
import { toast } from 'vue-sonner';

/**
 * 应用错误级别
 */
export type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal';

/**
 * 应用错误类
 * 用于区分业务错误和系统错误
 * 注意：项目使用 TypeScript target: ES2022+，不需要手动修复原型链
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public level: ErrorLevel,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    // TypeScript ES2022+ 自动处理原型链，无需 Object.setPrototypeOf
  }

  /**
   * 转换为普通对象
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      level: this.level,
      details: this.details,
      stack: this.stack,
    };
  }
}

/**
 * API 错误类
 * 用于处理后端返回的错误
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    code: string = 'API_ERROR',
    public statusCode?: number,
    public response?: any,
    level: ErrorLevel = 'error'
  ) {
    super(message, code, level, { statusCode, response });
    this.name = 'ApiError';
  }
}

/**
 * 验证错误类
 * 用于处理表单验证错误
 */
export class ValidationError extends AppError {
  constructor(
    message: string = '验证失败',
    public fields: Record<string, string[]> = {},
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, code, 'warning', { fields });
    this.name = 'ValidationError';
  }

  /**
   * 获取第一个错误信息
   */
  getFirstError(): string {
    const firstField = Object.keys(this.fields)[0];
    if (firstField && this.fields[firstField].length > 0) {
      return this.fields[firstField][0];
    }
    return this.message;
  }
}

/**
 * 网络错误类
 */
export class NetworkError extends AppError {
  constructor(
    message: string = '网络连接失败，请检查网络',
    code: string = 'NETWORK_ERROR'
  ) {
    super(message, code, 'error');
    this.name = 'NetworkError';
  }
}

/**
 * 认证错误类
 */
export class AuthError extends AppError {
  constructor(
    message: string = '认证失败，请重新登录',
    code: string = 'AUTH_ERROR'
  ) {
    super(message, code, 'warning');
    this.name = 'AuthError';
  }
}

/**
 * 错误处理器配置
 */
export interface ErrorHandlerOptions {
  /** 是否显示 toast 提示 */
  showToast?: boolean;
  /** 是否上报错误 */
  report?: boolean;
  /** 自定义处理函数 */
  handler?: (error: AppError) => void;
}

/**
 * 默认错误处理器配置
 */
const defaultOptions: ErrorHandlerOptions = {
  showToast: true,
  report: false,
};

/**
 * 处理错误
 * @param error - 错误对象
 * @param options - 处理选项
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): AppError {
  const mergedOptions = { ...defaultOptions, ...options };

  // 转换为 AppError
  const appError = normalizeError(error);

  // 显示 toast 提示
  if (mergedOptions.showToast) {
    showErrorToast(appError);
  }

  // 上报错误
  if (mergedOptions.report) {
    reportError(appError);
  }

  // 自定义处理
  if (mergedOptions.handler) {
    mergedOptions.handler(appError);
  }

  // 开发环境输出错误详情
  if (import.meta.env.DEV) {
    console.error('[ErrorHandler]', appError);
  }

  return appError;
}

/**
 * 表单验证错误信息接口
 */
interface FormValidateErrorInfo {
  errorFields?: Array<{
    name: string | string[];
    errors: string[];
    warnings?: string[];
  }>;
  outOfDate?: boolean;
  values?: Record<string, unknown>;
}

/**
 * antdv-next 验证错误元素
 */
interface AntdvValidationErrorItem {
  errors: string[];
  rule?: {
    message?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * 检查是否为表单验证错误
 * @param error - 错误对象
 * @returns 是否为表单验证错误
 */
function isFormValidationError(error: unknown): error is FormValidateErrorInfo {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  if ('errorFields' in err) {
    const errorFields = err.errorFields;
    if (Array.isArray(errorFields)) {
      if (errorFields.length > 0) {
        const first = errorFields[0];
        if (typeof first === 'object' && first !== null && 'errors' in first) {
          return true;
        }
      }
      return true;
    }
  }

  if ('errors' in err && Array.isArray((err as any).errors)) {
    return true;
  }

  if (Array.isArray(err)) {
    const first = err[0];
    if (first && typeof first === 'object' && 'errors' in first && Array.isArray((first as any).errors)) {
      return true;
    }
  }

  return false;
}

/**
 * 提取表单验证错误信息
 * @param error - 错误对象
 * @returns 错误消息和字段错误映射
 */
function extractFormValidationError(error: unknown): { message: string; fields: Record<string, string[]> } {
  const err = error as Record<string, unknown>;

  if ('errorFields' in err && Array.isArray(err.errorFields)) {
    const firstError = (err.errorFields as Array<{ name?: string | string[]; errors?: string[] }>)?.[0];
    const errorMessage = firstError?.errors?.[0] || '表单验证失败';
    const fields: Record<string, string[]> = {};

    (err.errorFields as Array<{ name?: string | string[]; errors?: string[] }>)?.forEach((field) => {
      const fieldName = Array.isArray(field.name) ? field.name.join('.') : String(field.name || 'unknown');
      fields[fieldName] = field.errors || [];
    });

    return { message: errorMessage, fields };
  }

  if ('errors' in err && Array.isArray(err.errors)) {
    const errorMessage = (err.errors as string[])?.[0] || '表单验证失败';
    return {
      message: errorMessage,
      fields: { form: err.errors as string[] }
    };
  }

  if (Array.isArray(err)) {
    const errorItems = err as AntdvValidationErrorItem[];
    const fields: Record<string, string[]> = {};
    let message = '表单验证失败';

    // 先收集所有有 errors 的错误
    for (let index = 0; index < errorItems.length; index++) {
      const item = errorItems[index];
      const errorTexts = item.errors || [];
      
      if (errorTexts.length > 0) {
        fields[`field_${index}`] = errorTexts;
        if (!message || message === '表单验证失败') {
          message = errorTexts[0];
        }
      }
    }

    // 如果没有找到有 errors 的，使用 rule.message
    if (message === '表单验证失败') {
      for (let index = 0; index < errorItems.length; index++) {
        const item = errorItems[index];
        if (item.rule?.message) {
          fields[`field_${index}`] = [item.rule.message];
          message = item.rule.message;
          break;
        }
      }
    }

    return { message, fields };
  }

  return { message: '表单验证失败', fields: {} };
}

/**
 * 标准化错误
 * 将各种错误类型转换为 AppError
 */
export function normalizeError(error: unknown): AppError {
  // 已经是 AppError
  if (error instanceof AppError) {
    return error;
  }

  // 表单验证错误（需要在 Error 检查之前，因为验证错误可能是 Error 的子类）
  if (isFormValidationError(error)) {
    const { message, fields } = extractFormValidationError(error);
    return new ValidationError(message, fields, 'FORM_VALIDATION_ERROR');
  }

  // 标准 Error 对象
  if (error instanceof Error) {
    return new AppError(error.message, 'ERROR', 'error', { originalError: error });
  }

  // 字符串错误
  if (typeof error === 'string') {
    return new AppError(error, 'ERROR', 'error');
  }

  // 其他类型 - 尝试提取错误消息
  const errObj = error as Record<string, unknown>;
  const extractedMessage =
    errObj?.message ||
    errObj?.msg ||
    errObj?.error ||
    errObj?.errorMessage ||
    '发生未知错误';

  return new AppError(
    String(extractedMessage),
    'UNKNOWN_ERROR',
    'error',
    { originalError: error }
  );
}

/**
 * 显示错误提示
 */
function showErrorToast(error: AppError): void {
  if (error instanceof ValidationError) {
    return;
  }
  
  switch (error.level) {
    case 'info':
      toast.info(error.message);
      break;
    case 'warning':
      toast.warning(error.message);
      break;
    case 'error':
    case 'fatal':
      toast.error(error.message);
      break;
  }
}

/**
 * 上报错误
 * 可以接入错误监控服务（如 Sentry）
 */
function reportError(error: AppError): void {
  // TODO: 接入错误监控服务
  // 例如：Sentry.captureException(error);

  if (import.meta.env.DEV) {
    console.log('[Error Report]', error.toJSON());
  }
}

/**
 * 全局错误处理器
 * 用于 window.onerror 和 unhandledrejection
 */
export function setupGlobalErrorHandler(): void {
  // 处理同步错误
  window.onerror = (message, source, lineno, colno, error) => {
    handleError(error || new Error(String(message)), {
      showToast: false,
      report: true,
    });
    return true;
  };

  // 处理 Promise 未捕获的错误
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    
    // 如果是表单验证错误，设置级别为 warning，不显示 toast
    if (isFormValidationError(reason)) {
      const appError = normalizeError(reason);
      appError.level = 'warning';
      
      if (import.meta.env.DEV) {
        console.log('[ErrorHandler] Form validation error (suppressed toast):', appError);
      }
      reportError(appError);
      event.preventDefault();
      return;
    }
    
    handleError(reason, {
      showToast: true,
      report: true,
    });
    event.preventDefault();
  });
}

/**
 * 创建安全的异步函数包装器
 * 自动捕获和处理错误
 */
export function createSafeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: ErrorHandlerOptions
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      return null;
    }
  };
}

/**
 * 使用示例：
 *
 * // 1. 抛出特定错误
 * throw new ApiError('请求失败', 'API_500', 500);
 *
 * // 2. 处理错误
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   handleError(error, { showToast: true });
 * }
 *
 * // 3. 创建安全的异步函数
 * const safeFetch = createSafeAsync(fetchData, { showToast: true });
 * const result = await safeFetch(); // 错误会被自动处理，返回 null
 *
 * // 4. 全局错误处理
 * setupGlobalErrorHandler();
 */
