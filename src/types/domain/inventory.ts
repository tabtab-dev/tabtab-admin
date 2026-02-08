/**
 * 库存领域类型定义
 */

/**
 * 仓库基础信息
 */
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 库存记录
 */
export interface Stock {
  id: string;
  productId: string;
  productName?: string;
  warehouseId: string;
  warehouseName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  updatedAt: string;
}

/**
 * 库存变动记录
 */
export interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  warehouseId: string;
  warehouseName?: string;
  type: 'in' | 'out' | 'adjust' | 'transfer';
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  referenceNo?: string;
  note?: string;
  createdBy?: string;
  createdAt: string;
}

/**
 * 仓库列表查询参数
 */
export interface GetWarehousesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  isActive?: boolean;
}

/**
 * 库存列表查询参数
 */
export interface GetStockParams {
  page?: number;
  pageSize?: number;
  productId?: string;
  warehouseId?: string;
  lowStock?: boolean;
}

/**
 * 创建仓库参数
 */
export interface CreateWarehouseParams {
  name: string;
  code: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
}

/**
 * 更新仓库参数
 */
export interface UpdateWarehouseParams {
  name?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  isActive?: boolean;
}
