/**
 * Mock 环境通用 HTTP 请求方法封装
 * @description 基于 Mock Alova 实例，提供语义化的 HTTP 请求方法
 */
import { alovaMockInstance } from './alova.mock';

/**
 * 请求配置类型
 */
export interface RequestConfig {
  /** 请求参数 */
  params?: Record<string, any>;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 超时时间 */
  timeout?: number;
}

/**
 * Mock 环境通用 HTTP 请求对象
 * @description 提供语义化的 HTTP 方法，用于调用 Mock 接口
 *
 * @example
 * ```ts
 * // GET 请求
 * requestMock.get<User[]>('/users', { params: { page: 1 } })
 *
 * // POST 请求
 * requestMock.post<User>('/users', { name: '张三', email: 'zhangsan@example.com' })
 *
 * // PUT 请求
 * requestMock.put<User>('/users/1', { name: '李四' })
 *
 * // DELETE 请求
 * requestMock.delete<void>('/users/1')
 * ```
 */
export const requestMock = {
  /**
   * GET 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  get<T = any>(url: string, config?: RequestConfig) {
    return alovaMockInstance.Get<T>(url, config);
  },

  /**
   * POST 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Method 实例
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig) {
    return alovaMockInstance.Post<T>(url, data, config);
  },

  /**
   * PUT 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Method 实例
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig) {
    return alovaMockInstance.Put<T>(url, data, config);
  },

  /**
   * PATCH 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Method 实例
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig) {
    return alovaMockInstance.Patch<T>(url, data, config);
  },

  /**
   * DELETE 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  delete<T = any>(url: string, config?: RequestConfig) {
    return alovaMockInstance.Delete<T>(url, config);
  },

  /**
   * HEAD 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  head<T = any>(url: string, config?: RequestConfig) {
    return alovaMockInstance.Head<T>(url, config);
  },

  /**
   * OPTIONS 请求
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Method 实例
   */
  options<T = any>(url: string, config?: RequestConfig) {
    return alovaMockInstance.Options<T>(url, config);
  },
};

/**
 * 导出 Mock Alova 实例供高级使用
 */
export { alovaMockInstance };
