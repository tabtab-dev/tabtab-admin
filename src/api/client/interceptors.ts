/**
 * HTTP 请求拦截器配置
 */

import type { Method } from 'alova';
import type { AxiosResponse, AxiosError } from 'axios';

/**
 * 请求拦截器
 * 在请求发送前执行，用于添加认证信息、设置默认头等
 */
export const requestInterceptor = (method: Method) => {
  // 添加认证 Token
  const token = localStorage.getItem('token');
  if (token) {
    method.config.headers.Authorization = `Bearer ${token}`;
  }

  // 设置默认 Content-Type
  if (!method.config.headers['Content-Type']) {
    method.config.headers['Content-Type'] = 'application/json';
  }
};

/**
 * 响应成功拦截器
 * 处理成功响应，根据业务状态码判断
 */
export const responseSuccessInterceptor = (response: AxiosResponse) => {
  const { data } = response;

  // 根据业务状态码判断
  if (data.code !== 200) {
    // 处理业务错误
    if (data.code === 401) {
      // Token 过期，清除登录信息并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || '请求失败');
  }

  // 返回业务数据
  return data.data;
};

/**
 * 响应错误拦截器
 * 处理网络错误和服务器错误
 */
export const responseErrorInterceptor = (error: AxiosError): never => {
  if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status;
    const errorMessage = getErrorMessage(status);
    console.error(errorMessage);
    throw new Error(errorMessage);
  } else if (error.request) {
    // 请求发出但没有收到响应
    console.error('网络错误，请检查网络连接');
    throw new Error('网络错误，请检查网络连接');
  } else {
    // 请求配置出错
    console.error('请求配置错误:', error.message);
    throw new Error(error.message);
  }
};

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
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
  };

  return errorMessages[status] || `请求失败: ${status}`;
}
