/**
 * 基础类型定义
 * @description 定义项目中的基础类型，为其他类型提供基础
 */

/** 唯一标识符类型 */
export type ID = string;

/** 时间戳类型 */
export type Timestamp = string;

/** 状态类型基础 */
export type Status = string;

/** 分页参数基础类型 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页数据基础类型 */
export interface PaginationData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 基础模型接口 */
export interface BaseModel {
  /** 唯一标识 */
  id: ID;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt?: Timestamp;
}
