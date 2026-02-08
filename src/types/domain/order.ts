/**
 * 订单领域类型定义
 */

/**
 * 订单状态
 */
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

/**
 * 订单项
 */
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

/**
 * 收货地址
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
}

/**
 * 订单基础信息
 */
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  userName?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount?: number;
  shippingAmount?: number;
  finalAmount: number;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  note?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

/**
 * 订单列表查询参数
 */
export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: OrderStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 创建订单参数
 */
export interface CreateOrderParams {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  note?: string;
}

/**
 * 更新订单参数
 */
export interface UpdateOrderParams {
  status?: OrderStatus;
  shippingAddress?: ShippingAddress;
  note?: string;
}
