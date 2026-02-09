/**
 * 数据分析相关 API
 * @description 数据分析、统计报表等接口
 */
import { api } from '../client';

/**
 * 核心指标数据
 */
export interface CoreMetrics {
  totalVisits: number;
  visitsChange: number;
  newUsers: number;
  newUsersChange: number;
  conversionRate: number;
  conversionRateChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
}

/**
 * 热销商品
 */
export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  trend: number;
}

/**
 * 分类占比
 */
export interface CategoryShare {
  name: string;
  percentage: number;
  color: string;
  amount: number;
}

/**
 * 访问趋势数据
 */
export interface TrafficData {
  day: string;
  visits: number;
  orders: number;
}

/**
 * 用户行为数据
 */
export interface UserBehavior {
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
}

/**
 * 分析数据响应
 */
export interface AnalyticsData {
  coreMetrics: CoreMetrics;
  topProducts: TopProduct[];
  categoryShares: CategoryShare[];
  trafficData: TrafficData[];
  userBehavior: UserBehavior[];
}

/**
 * 数据分析 API
 */
export const analyticsApi = {
  /**
   * 获取核心指标
   * @param timeRange - 时间范围 (7d, 30d, 90d)
   * @returns 核心指标数据
   */
  getCoreMetrics: (timeRange: string = '7d') =>
    api.get<CoreMetrics>('/analytics/metrics', {
      params: { timeRange },
    }),

  /**
   * 获取热销商品
   * @param limit - 返回数量
   * @returns 热销商品列表
   */
  getTopProducts: (limit: number = 5) =>
    api.get<TopProduct[]>('/analytics/top-products', {
      params: { limit },
    }),

  /**
   * 获取分类占比
   * @returns 分类占比数据
   */
  getCategoryShares: () =>
    api.get<CategoryShare[]>('/analytics/category-shares'),

  /**
   * 获取访问趋势
   * @param timeRange - 时间范围
   * @returns 访问趋势数据
   */
  getTrafficData: (timeRange: string = '7d') =>
    api.get<TrafficData[]>('/analytics/traffic', {
      params: { timeRange },
    }),

  /**
   * 获取用户行为数据
   * @returns 用户行为数据
   */
  getUserBehavior: () =>
    api.get<UserBehavior[]>('/analytics/user-behavior'),

  /**
   * 获取所有分析数据
   * @param timeRange - 时间范围
   * @returns 完整的分析数据
   */
  getAnalyticsData: (timeRange: string = '7d') =>
    api.get<AnalyticsData>('/analytics/dashboard', {
      params: { timeRange },
    }),
};
