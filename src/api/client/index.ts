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
 * 创建 Method 实例的辅助函数
 * 内部使用，不直接导出
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
 * // GET 请求
 * const users = await api.get<User[]>('/users', { params: { page: 1 } })
 *
 * // POST 请求
 * const newUser = await api.post<User>('/users', { name: '张三', email: 'zhangsan@example.com' })
 *
 * // PUT 请求
 * const updatedUser = await api.put<User>('/users/1', { name: '李四' })
 *
 * // DELETE 请求
 * await api.delete<void>('/users/1')
 *
 * // 使用缓存
 * const cachedData = await api.getCached<User[]>('/users', {}, 300000)
 * ```
 */
export const api = {
  /**
   * GET 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns 响应数据
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('GET', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  /**
   * POST 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns 响应数据
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('POST', url, data, config);
    return requestManager.execute<T>(method);
  },

  /**
   * PUT 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns 响应数据
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('PUT', url, data, config);
    return requestManager.execute<T>(method);
  },

  /**
   * PATCH 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns 响应数据
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('PATCH', url, data, config);
    return requestManager.execute<T>(method);
  },

  /**
   * DELETE 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns 响应数据
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('DELETE', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  /**
   * HEAD 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns 响应数据
   */
  async head<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('HEAD', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  /**
   * OPTIONS 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns 响应数据
   */
  async options<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const method = createMethod<T>('OPTIONS', url, undefined, config);
    return requestManager.execute<T>(method);
  },

  /**
   * GET 请求（带缓存）
   * @param url - 请求地址
   * @param config - 请求配置
   * @param ttl - 缓存有效期（毫秒）
   * @returns 响应数据
   */
  async getCached<T = any>(
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
   * @param key - 缓存键，不传则清除所有缓存
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

  /**
   * 获取原始 Method 实例（用于 useQuery/useMutation）
   * @deprecated 推荐使用直接使用 api.get/api.post 等方法
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

// 导出类型
export type { Method } from 'alova';

// 导出请求管理器和缓存（供高级使用）
export { requestManager, requestCache };

// 为了保持向后兼容，保留旧的导出（标记为废弃）
/**
 * @deprecated 使用 api.get/api.post 等方法替代
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

/**
 * @deprecated 使用 api 对象的方法替代
 */
export const enhancedRequest = api;
