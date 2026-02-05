/**
 * API 通用类型定义
 */

/** API 响应数据结构 */
export interface ApiResponse<T = unknown> {
  /** 业务状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
}

/** 分页参数 */
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/** 分页响应数据 */
export interface PaginationData<T> {
  /** 数据列表 */
  list: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/** 请求配置选项 */
export interface RequestConfig {
  /** 请求参数 */
  params?: Record<string, any>;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 超时时间（毫秒） */
  timeout?: number;
}
