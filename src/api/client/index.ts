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
import { requestManager, requestCache } from './requestManager';
import type { ApiResponse, RequestConfig } from '../types';
import { API_BASE_URL, CACHE_TIME } from '@/constants/api';

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
    baseURL: USE_MOCK ? MOCK_BASE_URL : API_BASE_URL,

    // 请求拦截器
    beforeRequest: requestInterceptor,

    // 响应拦截器
    responded: {
      onSuccess: responseSuccessInterceptor,
      onError: responseErrorInterceptor,
    },

    // 缓存配置
    cacheFor: {
      // GET 请求缓存 1 分钟
      GET: CACHE_TIME.SHORT,
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

/**
 * 增强版请求对象（带去重、重试、缓存功能）
 *
 * @example
 * ```ts
 * // 发送请求（自动去重和重试）
 * const data = await enhancedRequest.get<User[]>('/users')
 *
 * // 使用缓存
 * const data = await enhancedRequest.getWithCache<User[]>('/users', {}, 300000)
 * ```
 */
export const enhancedRequest = {
  /**
   * GET 请求（带去重和重试）
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = request.get<T>(url, config);
    return requestManager.execute<T>(method);
  },

  /**
   * POST 请求（带去重和重试）
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = request.post<T>(url, data, config);
    return requestManager.execute<T>(method);
  },

  /**
   * PUT 请求（带去重和重试）
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = request.put<T>(url, data, config);
    return requestManager.execute<T>(method);
  },

  /**
   * PATCH 请求（带去重和重试）
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = request.patch<T>(url, data, config);
    return requestManager.execute<T>(method);
  },

  /**
   * DELETE 请求（带去重和重试）
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = request.delete<T>(url, config);
    return requestManager.execute<T>(method);
  },

  /**
   * GET 请求（带缓存）
   * @param ttl - 缓存有效期（毫秒）
   */
  async getWithCache<T = any>(
    url: string,
    config?: RequestConfig,
    ttl: number = 60000
  ): Promise<T> {
    const cacheKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;
    
    // 检查缓存
    const cached = requestCache.get<T>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    // 发起请求
    const data = await this.get<T>(url, config);
    
    // 缓存结果
    requestCache.set(cacheKey, data, ttl);
    
    return data;
  },

  /**
   * 清除请求缓存
   */
  clearCache(key?: string): void {
    requestCache.clear(key);
  },

  /**
   * 获取 pending 请求数量
   */
  getPendingCount(): number {
    return requestManager.getPendingCount();
  },
};

// 导出请求管理器和缓存
export { requestManager, requestCache };
