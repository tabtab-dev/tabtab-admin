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
    statesHook: VueHook,
    requestAdapter: axiosRequestAdapter(),
    baseURL: USE_MOCK ? MOCK_BASE_URL : API_BASE_URL,
    beforeRequest: requestInterceptor,
    responded: {
      onSuccess: responseSuccessInterceptor,
      onError: responseErrorInterceptor,
    },
    cacheFor: {
      GET: CACHE_TIME.SHORT,
      POST: 0,
      PUT: 0,
      DELETE: 0,
    },
  });
};

export const httpClient = createHttpClient();

/**
 * 创建 Method 实例的辅助函数
 */
function createMethod<T>(
  type: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS',
  url: string,
  data?: any,
  config?: RequestConfig
): Method<ApiResponse<T>> {
  switch (type) {
    case 'GET':
      return httpClient.Get<ApiResponse<T>>(url, config);
    case 'POST':
      return httpClient.Post<ApiResponse<T>>(url, data, config);
    case 'PUT':
      return httpClient.Put<ApiResponse<T>>(url, data, config);
    case 'PATCH':
      return httpClient.Patch<ApiResponse<T>>(url, data, config);
    case 'DELETE':
      return httpClient.Delete<ApiResponse<T>>(url, config);
    case 'HEAD':
      return httpClient.Head<ApiResponse<T>>(url, config);
    case 'OPTIONS':
      return httpClient.Options<ApiResponse<T>>(url, config);
    default:
      throw new Error(`Unsupported HTTP method: ${type}`);
  }
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
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('GET', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('POST', url, data, config);
    return requestManager.execute<T>(method);
  },

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('PUT', url, data, config);
    return requestManager.execute<T>(method);
  },

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('PATCH', url, data, config);
    return requestManager.execute<T>(method);
  },

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('DELETE', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  async head<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('HEAD', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  async options<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('OPTIONS', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  /**
   * GET 请求（带缓存）
   * @param ttl - 缓存有效期（毫秒）
   */
  async getCached<T = any>(
    url: string,
    config?: RequestConfig,
    ttl: number = 60000
  ): Promise<T> {
    const cacheKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;

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
  getMethod<T = any>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('GET', url, undefined, config);
  },

  postMethod<T = any>(url: string, data?: any, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('POST', url, data, config);
  },

  putMethod<T = any>(url: string, data?: any, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('PUT', url, data, config);
  },

  patchMethod<T = any>(url: string, data?: any, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('PATCH', url, data, config);
  },

  deleteMethod<T = any>(url: string, config?: RequestConfig): Method<ApiResponse<T>> {
    return createMethod<T>('DELETE', url, undefined, config);
  },
};

export type { Method } from 'alova';
export { requestManager, requestCache };

/**
 * 请求对象 - 返回原始 Method 实例供 useQuery/useMutation 使用
 */
export const request = {
  get: api.getMethod,
  post: api.postMethod,
  put: api.putMethod,
  patch: api.patchMethod,
  delete: api.deleteMethod,
  head: <T = any>(url: string, config?: RequestConfig) => createMethod<T>('HEAD', url, undefined, config),
  options: <T = any>(url: string, config?: RequestConfig) => createMethod<T>('OPTIONS', url, undefined, config),
};
