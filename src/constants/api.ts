/**
 * API 相关常量
 * @description 定义 API 相关的常量
 */

/** API 基础路径 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** Mock API 基础路径 */
export const MOCK_API_BASE_URL = '/mock-api';

/** 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT = 30000;

/** 分页默认配置 */
export const PAGINATION_DEFAULT = {
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

/** 缓存时间配置（毫秒） */
export const CACHE_TIME = {
  SHORT: 60000,        // 1 分钟
  MEDIUM: 300000,      // 5 分钟
  LONG: 600000,        // 10 分钟
  VERY_LONG: 3600000,   // 1 小时
} as const;
