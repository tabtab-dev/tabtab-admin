/**
 * HTTP 请求拦截器配置
 */

import type { Method } from 'alova';
import type { AxiosResponse, AxiosError } from 'axios';
import { toast } from 'vue-sonner';
import router from '@/router';
import { requestCache } from './requestManager';
import { STORAGE_KEYS } from '@/constants/common';

/**
 * 自定义错误类
 */
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 是否正在刷新 token
 */
let isRefreshing = false;

/**
 * 刷新 token 等待队列
 */
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * 订阅 token 刷新
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

/**
 * 通知所有订阅者新 token
 */
function onTokenRefreshed(newToken: string): void {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
}

/**
 * 从 localStorage 获取 token
 * 兼容旧的 'token' key 和新的 Pinia 持久化 'app-auth'
 */
function getTokenFromStorage(): string | null {
  // 首先尝试从 Pinia 持久化存储读取
  try {
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed?.token) {
        return parsed.token;
      }
    }
  } catch {
    // 忽略解析错误
  }

  // 降级：尝试旧的 key（兼容性）
  const oldToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (oldToken) {
    return oldToken;
  }

  return null;
}

/**
 * 请求拦截器
 * 在请求发送前执行，用于添加认证信息、设置默认头等
 */
export const requestInterceptor = (method: Method) => {
  // 添加认证 Token
  const token = getTokenFromStorage();
  if (token) {
    method.config.headers.Authorization = `Bearer ${token}`;
  }

  // 设置默认 Content-Type
  if (!method.config.headers['Content-Type']) {
    method.config.headers['Content-Type'] = 'application/json';
  }

  // 添加请求时间戳（用于调试）
  method.config.headers['X-Request-Time'] = Date.now().toString();
};

/**
 * 响应成功拦截器
 * 处理成功响应，根据业务状态码判断
 */
export const responseSuccessInterceptor = (response: AxiosResponse) => {
  const { data } = response;

  // 添加调试日志（仅在开发环境）
  if (import.meta.env.DEV) {
    console.log('[响应成功拦截器]', {
      url: response.config?.url,
      method: response.config?.method,
      status: response.status,
      duration: Date.now() - parseInt(response.config.headers['X-Request-Time'] || '0'),
      responseData: data
    });
  }

  // 根据业务状态码判断
  if (data.code !== 200) {
    // 处理业务错误
    if (data.code === 401) {
      // Token 过期，使用路由导航
      handleUnauthorized();
    } else {
      // 显示错误提示
      toast.error(data.message || '请求失败');
    }
    // 抛出错误，让调用方 catch
    throw new ApiError(data.code, data.message || '请求失败', data);
  }

  // 返回业务数据
  return data.data;
};

/**
 * 响应错误拦截器
 * 处理网络错误和服务器错误
 */
export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status;
    
    // 401 未授权处理
    if (status === 401) {
      handleUnauthorized();
      throw new ApiError(401, '未授权，请重新登录');
    }

    const errorMessage = getErrorMessage(status);
    
    // 记录详细的错误信息（仅在开发环境）
    if (import.meta.env.DEV) {
      console.error('[API 错误]', {
        status,
        message: errorMessage,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data
      });
    }
    
    toast.error(errorMessage);
    throw new ApiError(status, errorMessage, error.response.data);
  } else if (error.request) {
    // 请求发出但没有收到响应
    console.error('[网络错误] 请求发出但没有收到响应', {
      url: error.config?.url,
      method: error.config?.method
    });
    toast.error('网络错误，请检查网络连接');
    throw new ApiError(0, '网络错误，请检查网络连接');
  } else {
    // 请求配置出错
    console.error('[请求配置错误]', {
      message: error.message,
      config: error.config
    });
    toast.error(`请求配置错误: ${error.message}`);
    throw new ApiError(-1, `请求配置错误: ${error.message}`);
  }
};

/**
 * 处理未授权（401）
 * 使用 Vue Router 进行导航，而不是直接操作 window.location
 */
function handleUnauthorized(): void {
  // 清除登录状态（新旧 key 都清除）
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  
  // 清除请求缓存
  requestCache.clear();
  
  // 显示提示
  toast.error('登录已过期，请重新登录');
  
  // 使用路由导航到登录页
  const currentPath = router.currentRoute.value.fullPath;
  
  // 延迟导航，让用户看到提示
  setTimeout(() => {
    router.push({
      name: 'Login',
      query: currentPath !== '/' && currentPath !== '/login' ? { redirect: currentPath } : undefined
    });
  }, 1500);
}

/**
 * 根据状态码获取错误消息
 */
function getErrorMessage(status: number): string {
  const errorMessages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    409: '资源冲突',
    422: '请求数据验证失败',
    429: '请求过于频繁，请稍后再试',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
  };

  return errorMessages[status] || `请求失败: ${status}`;
}

/**
 * 导出刷新 token 相关函数（供外部使用）
 */
export const tokenRefresh = {
  isRefreshing: () => isRefreshing,
  setRefreshing: (value: boolean) => { isRefreshing = value; },
  subscribe: subscribeTokenRefresh,
  notify: onTokenRefreshed,
};
