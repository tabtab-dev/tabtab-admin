/**
 * 订单相关类型定义
 */

import type { BaseModel } from './base';
import type { ORDER_STATUS } from '@/constants';

/** 订单状态类型 */
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/** 订单模型 */
export interface Order extends BaseModel {
  /** 订单编号 */
  orderNo: string;
  /** 客户名称 */
  customer: string;
  /** 客户邮箱 */
  email: string;
  /** 客户电话 */
  phone: string;
  /** 订单总额 */
  total: number;
  /** 订单状态 */
  status: OrderStatus;
  /** 订单日期 */
  date: string;
  /** 商品数量 */
  items: number;
  /** 收货地址 */
  address: string;
  /** 备注 */
  note?: string;
}
