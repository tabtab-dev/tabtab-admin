/**
 * API 入口文件
 * @description 统一导出所有 API 模块和类型
 */

export { api, httpClient, requestManager, requestCache } from './client';
export type { Method } from './client';

export type { RequestManagerOptions } from './client/requestManager';

export type {
  ApiResponse,
  PaginationParams,
  PaginationData,
  RequestConfig,
} from './types';

export {
  authApi,
  type LoginParams,
  type LoginResponse,
  type ChangePasswordParams,
} from './modules/auth';

export {
  usersApi,
  type CreateUserParams,
  type UpdateUserParams,
  type GetUsersParams,
} from './modules/users';

export { menuApi } from './modules/menu';

export {
  productsApi,
  type CreateProductParams,
  type UpdateProductParams,
  type GetProductsParams,
} from './modules/products';

export {
  ordersApi,
  type CreateOrderParams,
  type UpdateOrderParams,
  type GetOrdersParams,
} from './modules/orders';

export {
  categoriesApi,
  type CreateCategoryParams,
  type UpdateCategoryParams,
  type GetCategoriesParams,
  type CreateTagParams,
  type UpdateTagParams,
} from './modules/categories';

export {
  inventoryApi,
  type CreateWarehouseParams,
  type UpdateWarehouseParams,
  type GetWarehousesParams,
  type GetStockParams,
} from './modules/inventory';
