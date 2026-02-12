/**
 * API 入口文件
 * @description 统一导出所有 API 模块和类型
 */

export { api, httpClient, requestManager, requestCache } from './client';
export { clearTokenCache } from './client/interceptors';
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

export type { UpdateProfileParams } from '@/types';

export { usersApi } from './modules/users';
export type { CreateUserParams, UpdateUserParams, GetUsersParams } from '@/types';

export {
  menuApi,
  type Menu,
  type CreateMenuParams,
  type UpdateMenuParams,
  type GetMenusParams,
} from './modules/menu';

export {
  organizationApi,
  type Organization,
  type CreateOrganizationParams,
  type UpdateOrganizationParams,
  type GetOrganizationsParams,
} from './modules/organization';

export {
  roleApi,
  type Role,
  type CreateRoleParams,
  type UpdateRoleParams,
  type GetRolesParams,
} from './modules/role';

export { productsApi } from './modules/products';
export type { CreateProductParams, UpdateProductParams, GetProductsParams } from '@/types';

export { ordersApi } from './modules/orders';
export type { CreateOrderParams, UpdateOrderParams, GetOrdersParams } from '@/types';

export { categoriesApi } from './modules/categories';
export type { CreateCategoryParams, UpdateCategoryParams, GetCategoriesParams, CreateTagParams, UpdateTagParams } from '@/types';

export { inventoryApi } from './modules/inventory';
export type { CreateWarehouseParams, UpdateWarehouseParams, GetWarehousesParams, GetStockParams } from '@/types';

export {
  analyticsApi,
  type CoreMetrics,
  type TopProduct,
  type CategoryShare,
  type TrafficData,
  type UserBehavior,
  type AnalyticsData,
} from './modules/analytics';
