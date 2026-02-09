/**
 * 菜单模块 Mock 路由
 * @description 菜单、路由配置等接口路由处理
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { routeData } from '../data/menu';
import { createResponse } from '../utils/response';

/**
 * 菜单模块路由映射
 */
export const menuRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  /**
   * 获取当前用户路由配置
   * GET /mock-api/menu/list
   * @description 只返回 routes，前端自行从 routes 提取菜单数据
   */
  'GET /mock-api/menu/list': (req, res) => {
    // 从请求头获取 token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    console.log('[Mock] /menu/list called, token:', token ? 'exists' : 'missing');
    console.log('[Mock] routeData length:', routeData?.length);

    if (!token) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '未授权')));
      return;
    }

    // 只返回路由数据，前端自行提取菜单
    console.log('[Mock] Response data:', JSON.stringify(routeData).substring(0, 200));

    res.statusCode = 200;
    res.end(JSON.stringify(createResponse(routeData)));
  },
};
