/**
 * 业务模型类型定义
 * @description 统一导出所有业务模型类型
 */

// 用户相关
export type { User } from '@/stores/business/users';

// 产品相关
export type { Product } from '@/stores/business/products';

// 订单相关
export type { Order } from '@/stores/business/orders';

// 分类和标签相关
export type { Category, Tag } from '@/stores/business/categories';

// 库存相关
export type { Warehouse, StockItem } from '@/stores/business/inventory';
