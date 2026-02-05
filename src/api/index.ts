/**
 * API 入口文件
 * @description 统一导出所有 API 模块和类型
 */

// 导出请求客户端
export { request, httpClient } from './client';
export type { Method } from './client';

// 导出 API 通用类型
export type {
  ApiResponse,
  PaginationParams,
  PaginationData,
  RequestConfig,
} from './types';

// 导出认证 API
export {
  authApi,
  type LoginParams,
  type LoginResponse,
  type ChangePasswordParams,
} from './modules/auth';

// 导出用户 API
export {
  usersApi,
  type CreateUserParams,
  type UpdateUserParams,
  type GetUsersParams,
} from './modules/users';

// 导出菜单 API
export { menuApi } from './modules/menu';

// 导出产品 API
export {
  productsApi,
  type CreateProductParams,
  type UpdateProductParams,
  type GetProductsParams,
} from './modules/products';

// 导出订单 API
export {
  ordersApi,
  type CreateOrderParams,
  type UpdateOrderParams,
  type GetOrdersParams,
} from './modules/orders';

// 导出分类和标签 API
export {
  categoriesApi,
  type CreateCategoryParams,
  type UpdateCategoryParams,
  type GetCategoriesParams,
  type CreateTagParams,
  type UpdateTagParams,
} from './modules/categories';

// 导出库存管理 API
export {
  inventoryApi,
  type CreateWarehouseParams,
  type UpdateWarehouseParams,
  type GetWarehousesParams,
  type GetStockParams,
} from './modules/inventory';
