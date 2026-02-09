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
import { API_BASE_URL } from '@/constants/api';

/**
 * HTTP 方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * 创建 Alova 实例
 */
const httpClient = createAlova({
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),
  baseURL: USE_MOCK ? MOCK_BASE_URL : API_BASE_URL,
  beforeRequest: requestInterceptor,
  responded: {
    onSuccess: responseSuccessInterceptor,
    onError: responseErrorInterceptor,
  },
  cacheFor: null, // 禁用缓存，确保每次请求都发送到服务器
});

/**
 * 创建 Method 实例的辅助函数
 */
function createMethod<T>(
  type: HttpMethod,
  url: string,
  data?: unknown,
  config?: RequestConfig
): Method<ApiResponse<T>> {
  const methodMap: Record<HttpMethod, (url: string, data?: unknown, config?: RequestConfig) => Method<ApiResponse<T>>> = {
    GET: (u, _, c) => httpClient.Get<ApiResponse<T>>(u, c),
    POST: (u, d, c) => httpClient.Post<ApiResponse<T>>(u, d, c),
    PUT: (u, d, c) => httpClient.Put<ApiResponse<T>>(u, d, c),
    PATCH: (u, d, c) => httpClient.Patch<ApiResponse<T>>(u, d, c),
    DELETE: (u, _, c) => httpClient.Delete<ApiResponse<T>>(u, c),
    HEAD: (u, _, c) => httpClient.Head<ApiResponse<T>>(u, c),
    OPTIONS: (u, _, c) => httpClient.Options<ApiResponse<T>>(u, c),
  };

  return methodMap[type](url, data, config);
}

/**
 * 生成缓存 key
 */
function generateCacheKey(url: string, params?: unknown): string {
  return `GET:${url}:${JSON.stringify(params || {})}`;
}

/**
 * 统一 HTTP 请求对象
 * 提供语义化的 HTTP 方法，自动处理去重、重试和错误处理
 *
 * @example
 * ```ts
 * const users = await api.get<User[]>('/users', { params: { page: 1 } })
 * const newUser = await api.post<User>('/users', { name: '张三' })
 * const updatedUser = await api.put<User>('/users/1', { name: '李四' })
 * await api.delete<void>('/users/1')
 * ```
 */
export const api = {
  async request<T>(method: HttpMethod, url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const methodInstance = createMethod<T>(method, url, data, config);
    return requestManager.execute<T>(methodInstance);
  },

  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  },

  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', url, data, config);
  },

  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', url, data, config);
  },

  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', url, data, config);
  },

  delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  },

  head<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('HEAD', url, undefined, config);
  },

  options<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('OPTIONS', url, undefined, config);
  },

  /**
   * GET 请求（带缓存）
   * @param ttl - 缓存有效期（毫秒）
   */
  async getCached<T>(url: string, config?: RequestConfig, ttl = 60000): Promise<T> {
    const cacheKey = generateCacheKey(url, config?.params);

    const cached = requestCache.get<T>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const data = await this.get<T>(url, config);
    requestCache.set(cacheKey, data, ttl);

    return data;
  },

  clearCache(key?: string): void {
    requestCache.clear(key);
  },

  getPendingCount(): number {
    return requestManager.getPendingCount();
  },

  /**
   * 获取原始 Method 实例（用于 useQuery/useMutation）
   */
  getMethod<T>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('GET', url, undefined, config);
  },

  postMethod<T>(url: string, data?: unknown, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('POST', url, data, config);
  },

  putMethod<T>(url: string, data?: unknown, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('PUT', url, data, config);
  },

  patchMethod<T>(url: string, data?: unknown, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('PATCH', url, data, config);
  },

  deleteMethod<T>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('DELETE', url, undefined, config);
  },
};

export type { Method } from 'alova';
export { requestManager, requestCache, httpClient };

/**
 * 请求对象 - 返回原始 Method 实例供 useQuery/useMutation 使用
 */
export const request = {
  get: api.getMethod,
  post: api.postMethod,
  put: api.putMethod,
  patch: api.patchMethod,
  delete: api.deleteMethod,
  head: <T>(url: string, config?: RequestConfig) => createMethod<T>('HEAD', url, undefined, config),
  options: <T>(url: string, config?: RequestConfig) => createMethod<T>('OPTIONS', url, undefined, config),
};
