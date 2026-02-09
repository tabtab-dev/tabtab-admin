/**
 * Analytics Mock 数据
 * @description 数据分析的模拟数据
 */

/**
 * 核心指标数据
 */
export const coreMetricsData = {
  totalVisits: 45231,
  visitsChange: 12.5,
  newUsers: 2847,
  newUsersChange: 8.2,
  conversionRate: 3.28,
  conversionRateChange: -1.2,
  avgOrderValue: 127.50,
  avgOrderValueChange: 5.8,
};

/**
 * 热销商品数据
 */
export const topProductsData = [
  { id: 'p-001', name: '高级无线耳机', sales: 342, revenue: 102258, trend: 15 },
  { id: 'p-002', name: '智能手表 Pro', sales: 187, revenue: 112013, trend: 8 },
  { id: 'p-003', name: '便携式充电宝', sales: 156, revenue: 7644, trend: -5 },
  { id: 'p-004', name: '蓝牙音箱', sales: 89, revenue: 11481, trend: 12 },
  { id: 'p-005', name: 'USB-C 数据线', sales: 67, revenue: 1273, trend: 3 },
];

/**
 * 分类占比数据
 */
export const categorySharesData = [
  { name: '电子产品', percentage: 45, color: 'bg-blue-500', amount: 224500 },
  { name: '配件', percentage: 28, color: 'bg-green-500', amount: 139600 },
  { name: '音频设备', percentage: 18, color: 'bg-purple-500', amount: 89800 },
  { name: '其他', percentage: 9, color: 'bg-orange-500', amount: 44900 },
];

/**
 * 访问趋势数据
 */
export const trafficDataData = [
  { day: '周一', visits: 5200, orders: 120 },
  { day: '周二', visits: 6100, orders: 145 },
  { day: '周三', visits: 5800, orders: 132 },
  { day: '周四', visits: 7200, orders: 168 },
  { day: '周五', visits: 8100, orders: 195 },
  { day: '周六', visits: 9500, orders: 230 },
  { day: '周日', visits: 8800, orders: 210 },
];

/**
 * 用户行为数据
 */
export const userBehaviorData = [
  { label: '平均会话时长', value: '4m 32s', change: 12, isPositive: true },
  { label: '跳出率', value: '32.5%', change: 3.2, isPositive: false },
  { label: '页面浏览量', value: '128,456', change: 8.5, isPositive: true },
  { label: '回访率', value: '45.8%', change: 2.1, isPositive: true },
];
