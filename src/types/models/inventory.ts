/**
 * 库存相关类型定义
 */

import type { BaseModel } from './base';
import type { WAREHOUSE_STATUS } from '@/constants';

/** 仓库状态类型 */
export type WarehouseStatus = typeof WAREHOUSE_STATUS[keyof typeof WAREHOUSE_STATUS];

/** 仓库模型 */
export interface Warehouse extends BaseModel {
  /** 仓库名称 */
  name: string;
  /** 仓库编码 */
  code: string;
  /** 位置 */
  location: string;
  /** 负责人 */
  manager: string;
  /** 联系电话 */
  phone: string;
  /** 状态 */
  status: WarehouseStatus;
  /** 产品数量 */
  productCount: number;
  /** 容量 */
  capacity: number;
  /** 已使用容量 */
  usedCapacity: number;
}

/** 库存项模型 */
export interface StockItem {
  /** 唯一标识 */
  id: string;
  /** 产品名称 */
  productName: string;
  /** SKU */
  sku: string;
  /** 仓库ID */
  warehouseId: string;
  /** 仓库名称 */
  warehouseName: string;
  /** 数量 */
  quantity: number;
  /** 预留数量 */
  reserved: number;
  /** 可用数量 */
  available: number;
  /** 最小库存 */
  minStock: number;
  /** 最大库存 */
  maxStock: number;
  /** 最后更新时间 */
  lastUpdated: string;
}
