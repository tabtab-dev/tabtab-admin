/**
 * 库存相关类型定义
 */

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  phone: string;
  status: 'active' | 'inactive';
  productCount: number;
  capacity: number;
  usedCapacity: number;
}

export interface StockItem {
  id: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number;
  available: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
}
