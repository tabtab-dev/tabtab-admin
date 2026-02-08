/**
 * 领域类型统一导出
 * @description 统一导出所有业务领域类型
 */

// 用户相关类型
export type {
  User,
  UserRole,
  UserStatus,
  GetUsersParams,
  CreateUserParams,
  UpdateUserParams,
  ChangePasswordParams,
} from './user';

// 产品相关类型
export type {
  Product,
  ProductStatus,
  GetProductsParams,
  CreateProductParams,
  UpdateProductParams,
} from './product';

// 订单相关类型
export type {
  Order,
  OrderItem,
  OrderStatus,
  ShippingAddress,
  GetOrdersParams,
  CreateOrderParams,
  UpdateOrderParams,
} from './order';

// 分类和标签相关类型
export type {
  Category,
  Tag,
  GetCategoriesParams,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateTagParams,
  UpdateTagParams,
} from './category';

// 库存相关类型
export type {
  Warehouse,
  Stock,
  StockMovement,
  GetWarehousesParams,
  GetStockParams,
  CreateWarehouseParams,
  UpdateWarehouseParams,
} from './inventory';
