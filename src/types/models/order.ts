/**
 * 订单相关类型定义
 */

export interface Order {
  id: string;
  orderNo: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  items: number;
  address: string;
  note?: string;
}
