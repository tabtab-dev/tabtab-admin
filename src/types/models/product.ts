/**
 * 产品相关类型定义
 */

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'low-stock' | 'out-of-stock';
  sales: number;
  description?: string;
  createdAt: string;
}
