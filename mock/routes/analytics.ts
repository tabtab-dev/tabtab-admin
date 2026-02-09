/**
 * Analytics Mock 路由
 * @description 数据分析相关的 Mock API 路由
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { successResponse } from '../utils/response';
import {
  coreMetricsData,
  topProductsData,
  categorySharesData,
  trafficDataData,
  userBehaviorData,
} from '../data/analytics';

/**
 * 数据分析路由
 */
export const analyticsRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  /**
   * 获取核心指标
   */
  'GET /mock-api/analytics/metrics': (_req, res) => {
    res.end(JSON.stringify(successResponse(coreMetricsData)));
  },

  /**
   * 获取热销商品
   */
  'GET /mock-api/analytics/top-products': (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const limit = Number(url.searchParams.get('limit') || '5');
    res.end(JSON.stringify(successResponse(topProductsData.slice(0, limit))));
  },

  /**
   * 获取分类占比
   */
  'GET /mock-api/analytics/category-shares': (_req, res) => {
    res.end(JSON.stringify(successResponse(categorySharesData)));
  },

  /**
   * 获取访问趋势
   */
  'GET /mock-api/analytics/traffic': (_req, res) => {
    res.end(JSON.stringify(successResponse(trafficDataData)));
  },

  /**
   * 获取用户行为数据
   */
  'GET /mock-api/analytics/user-behavior': (_req, res) => {
    res.end(JSON.stringify(successResponse(userBehaviorData)));
  },

  /**
   * 获取所有分析数据（仪表盘）
   */
  'GET /mock-api/analytics/dashboard': (_req, res) => {
    res.end(JSON.stringify(successResponse({
      coreMetrics: coreMetricsData,
      topProducts: topProductsData,
      categoryShares: categorySharesData,
      trafficData: trafficDataData,
      userBehavior: userBehaviorData,
    })));
  },
};
