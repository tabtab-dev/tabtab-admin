/**
 * Alova 请求实例配置
 * @description 创建并配置 Alova 实例，包含拦截器、缓存策略等
 */
import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import type { AxiosResponse, AxiosError } from 'axios';

/**
 * API 响应数据结构
 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/**
 * 创建 Alova 实例
 */
export const alovaInstance = createAlova({
  // 使用 Vue 的响应式 Hook
  statesHook: VueHook,
  // 使用 axios 作为请求适配器（需要调用函数创建适配器）
  requestAdapter: axiosRequestAdapter(),
  // 基础配置
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  // 请求拦截器
  beforeRequest(method) {
    // 添加认证 Token
    const token = localStorage.getItem('token');
    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`;
    }

    // 默认 Content-Type
    if (!method.config.headers['Content-Type']) {
      method.config.headers['Content-Type'] = 'application/json';
    }
  },

  // 响应拦截器
  responded: {
    /**
     * 请求成功时的处理
     */
    onSuccess(response: AxiosResponse<ApiResponse>): any {
      const { data } = response;

      // 根据业务状态码判断
      if (data.code !== 200) {
        // 可以在这里统一处理错误，比如 token 过期
        if (data.code === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error(data.message || '请求失败');
      }

      return data.data;
    },

    /**
     * 请求失败时的处理
     */
    onError(error: AxiosError): void {
      // 网络错误或服务器错误
      if (error.response) {
        // 服务器返回了错误状态码
        const status = error.response.status;
        switch (status) {
          case 401:
            console.error('未授权，请重新登录');
            break;
          case 403:
            console.error('拒绝访问');
            break;
          case 404:
            console.error('请求的资源不存在');
            break;
          case 500:
            console.error('服务器内部错误');
            break;
          default:
            console.error(`请求失败: ${status}`);
        }
      } else if (error.request) {
        // 请求发出但没有收到响应
        console.error('网络错误，请检查网络连接');
      } else {
        // 请求配置出错
        console.error('请求配置错误:', error.message);
      }

      throw error;
    },
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

/**
 * 导出常用的请求方法类型
 */
export type AlovaInstance = typeof alovaInstance;
