/**
 * 领域类型统一导出
 * @description 统一导出所有业务领域类型
 */

// 分类和标签相关类型
export type {
  Category,
  CategoryStatus,
  CreateCategoryParams,
  CreateTagParams,
  GetCategoriesParams,
  Tag,
  UpdateCategoryParams,
  UpdateTagParams,
} from './category'

// 库存相关类型
export type {
  CreateWarehouseParams,
  GetStockParams,
  GetWarehousesParams,
  Stock,
  StockItem,
  StockMovement,
  UpdateWarehouseParams,
  Warehouse,
  WarehouseStatus,
} from './inventory'

// 订单相关类型
export type {
  CreateOrderParams,
  GetOrdersParams,
  Order,
  OrderItem,
  OrderStatus,
  ShippingAddress,
  UpdateOrderParams,
} from './order'

// 产品相关类型
export type {
  CreateProductParams,
  GetProductsParams,
  Product,
  ProductStatus,
  UpdateProductParams,
} from './product'

// 用户相关类型
export type {
  ChangePasswordParams,
  CreateUserParams,
  GetUsersParams,
  UpdateProfileParams,
  UpdateUserParams,
  User,
  UserRole,
  UserStatus,
} from './user'
