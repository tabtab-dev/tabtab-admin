/**
 * 认证模块 Mock 路由
 * @description 登录、登出、用户信息等接口路由处理
 */

import type { IncomingMessage, ServerResponse } from 'http';
import {
  findUserByEmail,
  findUserById,
  generateToken,
  parseToken,
  updateUser,
} from '../data/auth';
import { createResponse, createErrorResponse } from '../utils/response';

/**
 * 从请求头获取当前用户 ID
 * @param req - 请求对象
 * @returns 用户 ID 或 null
 */
function getCurrentUserId(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  return parseToken(token);
}

/**
 * 认证模块路由映射
 */
export const authRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  /**
   * 用户登录
   * POST /mock-api/auth/login
   */
  'POST /mock-api/auth/login': (req, res) => {
    const { email } = req.body || {};

    // 查找用户（演示环境允许任意密码登录）
    const user = findUserByEmail(email);

    if (!user) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 400, '用户不存在')));
      return;
    }

    // 登录成功，返回 token 和用户信息
    const token = generateToken(user);
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse({
      token,
      user,
    })));
  },

  /**
   * 用户登出
   * POST /mock-api/auth/logout
   */
  'POST /mock-api/auth/logout': (req, res) => {
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(null)));
  },

  /**
   * 获取当前用户信息
   * GET /mock-api/auth/me
   */
  'GET /mock-api/auth/me': (req, res) => {
    const userId = getCurrentUserId(req);

    if (!userId) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '未授权')));
      return;
    }

    const user = findUserById(userId);

    if (!user) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '用户不存在')));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(user)));
  },

  /**
   * 更新当前用户个人资料
   * PUT /mock-api/auth/profile
   */
  'PUT /mock-api/auth/profile': (req, res) => {
    const userId = getCurrentUserId(req);

    if (!userId) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '未授权')));
      return;
    }

    const data = req.body || {};

    // 验证姓名
    if (data.name !== undefined && (!data.name || data.name.trim().length < 2)) {
      res.statusCode = 200;
      res.end(JSON.stringify(createErrorResponse('姓名长度至少为2个字符')));
      return;
    }

    // 验证手机号
    if (data.phone && !/^1[3-9]\d{9}$/.test(data.phone)) {
      res.statusCode = 200;
      res.end(JSON.stringify(createErrorResponse('请输入有效的手机号码')));
      return;
    }

    const updatedUser = updateUser(userId, data);

    if (!updatedUser) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 404, '用户不存在')));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(updatedUser)));
  },

  /**
   * 上传当前用户头像
   * POST /mock-api/auth/avatar
   */
  'POST /mock-api/auth/avatar': (req, res) => {
    const userId = getCurrentUserId(req);

    if (!userId) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '未授权')));
      return;
    }

    // Mock 头像上传，返回一个随机的头像 URL
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;

    // 更新用户头像
    updateUser(userId, { avatar: avatarUrl });

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse({ avatarUrl })));
  },

  /**
   * 刷新 Token
   * POST /mock-api/auth/refresh
   */
  'POST /mock-api/auth/refresh': (req, res) => {
    const userId = getCurrentUserId(req);

    if (!userId) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '未授权')));
      return;
    }

    const user = findUserById(userId);

    if (!user) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '用户不存在')));
      return;
    }

    const newToken = generateToken(user);
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse({ token: newToken })));
  },

  /**
   * 修改密码
   * POST /mock-api/auth/change-password
   */
  'POST /mock-api/auth/change-password': (req, res) => {
    const userId = getCurrentUserId(req);

    if (!userId) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '未授权')));
      return;
    }

    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
      res.statusCode = 200;
      res.end(JSON.stringify(createErrorResponse('请输入当前密码和新密码')));
      return;
    }

    if (newPassword.length < 6) {
      res.statusCode = 200;
      res.end(JSON.stringify(createErrorResponse('新密码长度至少为6位')));
      return;
    }

    // Mock 环境模拟密码修改成功
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(null)));
  },

  /**
   * 发送验证码
   * POST /mock-api/auth/send-code
   */
  'POST /mock-api/auth/send-code': (req, res) => {
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(null, 200, '验证码已发送')));
  },

  /**
   * 重置密码
   * POST /mock-api/auth/reset-password
   */
  'POST /mock-api/auth/reset-password': (req, res) => {
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(null)));
  },
};
