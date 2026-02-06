/**
 * 认证相关 API
 * @description 登录、登出、获取用户信息等接口
 */
import { request } from '../request';
import { requestMock } from '../request.mock';
import type { User } from '@/stores/auth';

/**
 * 登录请求参数
 */
export interface LoginParams {
  email: string;
  password: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

/**
 * 认证 API（正式接口）
 */
export const authApi = {
  /**
   * 用户登录
   * @param data - 登录参数
   * @returns 登录响应
   */
  login: (data: LoginParams) =>
    request.post<LoginResponse>('/auth/login', data),

  /**
   * 用户登出
   * @returns 登出结果
   */
  logout: () => request.post<void>('/auth/logout'),

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  getCurrentUser: () => request.get<User>('/auth/me'),

  /**
   * 刷新 Token
   * @returns 新的 Token
   */
  refreshToken: () =>
    request.post<{ token: string }>('/auth/refresh'),

  /**
   * 修改密码
   * @param data - 修改密码参数
   * @returns 修改结果
   */
  changePassword: (data: ChangePasswordParams) =>
    request.post<void>('/auth/change-password', data),

  /**
   * 发送验证码
   * @param email - 邮箱地址
   * @returns 发送结果
   */
  sendVerificationCode: (email: string) =>
    request.post<void>('/auth/send-code', { email }),

  /**
   * 重置密码
   * @param email - 邮箱地址
   * @param code - 验证码
   * @param newPassword - 新密码
   * @returns 重置结果
   */
  resetPassword: (email: string, code: string, newPassword: string) =>
    request.post<void>('/auth/reset-password', {
      email,
      code,
      newPassword,
    }),
};

/**
 * 认证 API（Mock 接口）
 */
export const authApiMock = {
  /**
   * 用户登录
   * @param data - 登录参数
   * @returns 登录响应
   */
  login: (data: LoginParams) =>
    requestMock.post<LoginResponse>('/auth/login', data),

  /**
   * 用户登出
   * @returns 登出结果
   */
  logout: () => requestMock.post<void>('/auth/logout'),

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  getCurrentUser: () => requestMock.get<User>('/auth/me'),

  /**
   * 刷新 Token
   * @returns 新的 Token
   */
  refreshToken: () =>
    requestMock.post<{ token: string }>('/auth/refresh'),

  /**
   * 修改密码
   * @param data - 修改密码参数
   * @returns 修改结果
   */
  changePassword: (data: ChangePasswordParams) =>
    requestMock.post<void>('/auth/change-password', data),

  /**
   * 发送验证码
   * @param email - 邮箱地址
   * @returns 发送结果
   */
  sendVerificationCode: (email: string) =>
    requestMock.post<void>('/auth/send-code', { email }),

  /**
   * 重置密码
   * @param email - 邮箱地址
   * @param code - 验证码
   * @param newPassword - 新密码
   * @returns 重置结果
   */
  resetPassword: (email: string, code: string, newPassword: string) =>
    requestMock.post<void>('/auth/reset-password', {
      email,
      code,
      newPassword,
    }),
};
