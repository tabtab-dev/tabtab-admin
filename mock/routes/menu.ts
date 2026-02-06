/**
 * 菜单模块 Mock 路由
 * @description 菜单、路由配置等接口路由处理
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { menuData, routeData } from '../data/menu';
import { createResponse } from '../utils/response';

/**
 * 菜单模块路由映射
 */
export const menuRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  /**
   * 获取当前用户菜单和路由配置
   * GET /mock-api/menu/list
   */
  'GET /mock-api/menu/list': (req, res) => {
    // 从请求头获取 token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      res.statusCode = 200;
      res.end(JSON.stringify(createResponse(null, 401, '未授权')));
      return;
    }

    // 返回菜单和路由数据
    res.statusCode = 200;
    res.end(JSON.stringify(createResponse({
      menus: menuData,
      routes: routeData,
    })));
  },
};
