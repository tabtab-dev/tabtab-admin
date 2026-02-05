/**
 * 统一的 HTTP 客户端
 * 整合 Alova 实例，提供语义化的 HTTP 请求方法
 */
import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import type { Method } from 'alova';
import { requestInterceptor, responseSuccessInterceptor, responseErrorInterceptor } from './interceptors';
import { USE_MOCK, MOCK_BASE_URL } from './mock';
import type { ApiResponse, RequestConfig } from '../types';

/**
 * 创建 Alova 实例
 */
const createHttpClient = () => {
  return createAlova({
    // 使用 Vue 的响应式 Hook
    statesHook: VueHook,
    // 使用 axios 作为请求适配器
    requestAdapter: axiosRequestAdapter(),
    // 基础配置
    baseURL: USE_MOCK ? MOCK_BASE_URL : (import.meta.env.VITE_API_BASE_URL || '/api'),

    // 请求拦截器
    beforeRequest: requestInterceptor,

    // 响应拦截器
    responded: {
      onSuccess: responseSuccessInterceptor,
      onError: responseErrorInterceptor,
    },

    // 缓存配置
    cacheFor: {
      // GET 请求缓存 1 分钟（60000ms）
      GET: 60000,
      // POST 请求不缓存
      POST: 0,
      // PUT 请求不缓存
      PUT: 0,
      // DELETE 请求不缓存
      DELETE: 0,
    },
  });
};

/**
 * Alova 实例
 */
export const httpClient = createHttpClient();

/**
 * 通用 HTTP 请求对象
 * 提供语义化的 HTTP 方法，类似于 axios 的调用方式
 *
 * @example
 * ```ts
 * // GET 请求
 * request.get<User[]>('/users', { params: { page: 1 } })
 *
 * // POST 请求
 * request.post<User>('/users', { name: '张三', email: 'zhangsan@example.com' })
 *
 * // PUT 请求
 * request.put<User>('/users/1', { name: '李四' })
 *
 * // DELETE 请求
 * request.delete<void>('/users/1')
 * ```
 */
export const request = {
  /**
   * GET 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  get<T = any>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return httpClient.Get<ApiResponse<T>>(url, config);
  },

  /**
   * POST 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Method 实例
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Method<ApiResponse<T>> {
    return httpClient.Post<ApiResponse<T>>(url, data, config);
  },

  /**
   * PUT 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Method 实例
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Method<ApiResponse<T>> {
    return httpClient.Put<ApiResponse<T>>(url, data, config);
  },

  /**
   * PATCH 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Method 实例
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Method<ApiResponse<T>> {
    return httpClient.Patch<ApiResponse<T>>(url, data, config);
  },

  /**
   * DELETE 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  delete<T = any>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return httpClient.Delete<ApiResponse<T>>(url, config);
  },

  /**
   * HEAD 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  head<T = any>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return httpClient.Head<ApiResponse<T>>(url, config);
  },

  /**
   * OPTIONS 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  options<T = any>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return httpClient.Options<ApiResponse<T>>(url, config);
  },
};
