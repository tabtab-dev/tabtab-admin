/**
 * HTTP 请求拦截器配置
 */

import type { Method } from 'alova';
import type { AxiosResponse, AxiosError } from 'axios';
import router from '@/router';
import { requestCache } from './requestManager';
import { STORAGE_KEYS } from '@/constants/common';
import { ApiError, NetworkError, AuthError } from '@/utils/errorHandler';

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
 * Token 缓存
 * @description 缓存 token 避免每次请求都从 localStorage 读取
 */
let cachedToken: string | null = null;
let lastTokenCheck = 0;
const TOKEN_CACHE_TTL = 5000; // Token 缓存有效期 5 秒

/**
 * 从 localStorage 获取 token
 * 兼容旧的 'token' key 和新的 Pinia 持久化 'app-auth'
 */
function getTokenFromStorage(): string | null {
  const now = Date.now();

  // 如果缓存未过期，直接返回缓存的 token
  if (cachedToken && now - lastTokenCheck < TOKEN_CACHE_TTL) {
    return cachedToken;
  }

  // 首先尝试从 Pinia 持久化存储读取
  try {
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed?.token) {
        cachedToken = parsed.token;
        lastTokenCheck = now;
        return cachedToken;
      }
    }
  } catch {
    // 忽略解析错误
  }

  // 降级：尝试旧的 key（兼容性）
  const oldToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (oldToken) {
    cachedToken = oldToken;
    lastTokenCheck = now;
    return cachedToken;
  }

  // 没有找到 token，清除缓存
  cachedToken = null;
  lastTokenCheck = now;
  return null;
}

/**
 * 清除 Token 缓存
 * @description 在登录状态变化时调用
 */
export function clearTokenCache(): void {
  cachedToken = null;
  lastTokenCheck = 0;
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
 * @description 只抛出错误，不显示 toast，由调用方统一处理错误提示
 */
export const responseSuccessInterceptor = (response: AxiosResponse) => {
  const { data } = response;

  // 根据业务状态码判断
  if (data.code !== 200) {
    // 处理业务错误
    if (data.code === 401) {
      // Token 过期，使用路由导航
      handleUnauthorized();
      throw new AuthError(data.message || '登录已过期，请重新登录');
    }
    // 抛出错误，让调用方 catch 并处理错误提示
    throw new ApiError(data.message || '请求失败', `API_${data.code}`, data.code, data);
  }

  // 返回业务数据
  return data.data;
};

/**
 * 响应错误拦截器
 * 处理网络错误和服务器错误
 * @description 只抛出错误，不显示 toast，由调用方统一处理错误提示
 */
export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status;

    // 401 未授权处理
    if (status === 401) {
      handleUnauthorized();
      throw new AuthError('未授权，请重新登录');
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

    // 抛出错误，让调用方 catch 并处理错误提示
    throw new ApiError(errorMessage, `HTTP_${status}`, status, error.response.data);
  } else if (error.request) {
    // 请求发出但没有收到响应
    console.error('[网络错误] 请求发出但没有收到响应', {
      url: error.config?.url,
      method: error.config?.method
    });
    throw new NetworkError('网络错误，请检查网络连接');
  } else {
    // 请求配置出错
    console.error('[请求配置错误]', {
      message: error.message,
      config: error.config
    });
    throw new ApiError(`请求配置错误: ${error.message}`, 'CONFIG_ERROR');
  }
};

/**
 * 处理未授权（401）
 * 使用 Vue Router 进行导航，而不是直接操作 window.location
 */
function handleUnauthorized(): void {
  console.log('[Auth] Handling 401 unauthorized');

  // 清除请求缓存和 token 缓存
  requestCache.clear();
  clearTokenCache();

  // 延迟清除登录状态和导航，避免在初始化过程中清除状态
  setTimeout(() => {
    // 清除登录状态（新旧 key 都清除）
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    // 使用路由导航到登录页
    const currentPath = router.currentRoute.value.fullPath;

    // 如果当前不在登录页，才导航到登录页
    if (currentPath !== '/login') {
      router.push({
        name: 'Login',
        query: currentPath !== '/' && currentPath !== '/login' ? { redirect: currentPath } : undefined
      });
    }
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
