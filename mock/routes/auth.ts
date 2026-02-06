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
} from '../data/auth';
import { createResponse } from '../utils/response';

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
    // 从请求头获取 token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    const userId = parseToken(token);

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
   * 刷新 Token
   * POST /mock-api/auth/refresh
   */
  'POST /mock-api/auth/refresh': (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    const userId = parseToken(token);

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
