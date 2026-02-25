/**
 * API 入口文件
 * @description 统一导出所有 API 模块和类型
 */

export { api, httpClient, requestCache, requestManager } from './client'
export type { Method } from './client'
export { clearTokenCache } from './client/interceptors'

export type { RequestManagerOptions } from './client/requestManager'

export {
  analyticsApi,
  type AnalyticsData,
  type CategoryShare,
  type CoreMetrics,
  type TopProduct,
  type TrafficData,
  type UserBehavior,
} from './modules/analytics'

export {
  authApi,
  type ChangePasswordParams,
  type LoginParams,
  type LoginResponse,
} from './modules/auth'

export { categoriesApi } from './modules/categories'

export { inventoryApi } from './modules/inventory'
export {
  type CreateMenuParams,
  type GetMenusParams,
  type Menu,
  menuApi,
  type UpdateMenuParams,
} from './modules/menu'

export { ordersApi } from './modules/orders'

export {
  type CreateOrganizationParams,
  type GetOrganizationsParams,
  type Organization,
  organizationApi,
  type UpdateOrganizationParams,
} from './modules/organization'

export { productsApi } from './modules/products'

export {
  type CreateRoleParams,
  type GetRolesParams,
  type Role,
  roleApi,
  type UpdateRoleParams,
} from './modules/role'
export { usersApi } from './modules/users'

export type {
  ApiResponse,
  PaginationData,
  PaginationParams,
  RequestConfig,
} from './types'
export type { UpdateProfileParams } from '@/types'

export type { CreateUserParams, GetUsersParams, UpdateUserParams } from '@/types'
export type { CreateProductParams, GetProductsParams, UpdateProductParams } from '@/types'

export type { CreateOrderParams, GetOrdersParams, UpdateOrderParams } from '@/types'
export type { CreateCategoryParams, CreateTagParams, GetCategoriesParams, UpdateCategoryParams, UpdateTagParams } from '@/types'

export type { CreateWarehouseParams, GetStockParams, GetWarehousesParams, UpdateWarehouseParams } from '@/types'
