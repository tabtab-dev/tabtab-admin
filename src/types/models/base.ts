/**
 * 业务模型基础类型
 * @description 所有业务模型的基类类型定义
 */

import type { ID, Timestamp } from '../base';

/** 基础模型接口 */
export interface BaseModel {
  /** 唯一标识 */
  id: ID;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt?: Timestamp;
}
