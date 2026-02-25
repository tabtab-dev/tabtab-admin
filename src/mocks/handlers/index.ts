import { analyticsHandlers } from './analytics'
/**
 * MSW Handlers 索引
 * @description 统一导出所有 handlers
 */
import { authHandlers } from './auth'
import { categoryHandlers } from './categories'
import { inventoryHandlers } from './inventory'
import { menuHandlers } from './menu'
import { orderHandlers } from './orders'
import { organizationHandlers } from './organization'
import { productHandlers } from './products'
import { roleHandlers } from './role'
import { systemMenuHandlers } from './system-menu'
import { usersHandlers } from './users'

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...menuHandlers,
  ...roleHandlers,
  ...productHandlers,
  ...orderHandlers,
  ...analyticsHandlers,
  ...categoryHandlers,
  ...inventoryHandlers,
  ...organizationHandlers,
  ...systemMenuHandlers,
]
