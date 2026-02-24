/**
 * MSW Handlers 索引
 * @description 统一导出所有 handlers
 */
import { authHandlers } from './auth';
import { usersHandlers } from './users';
import { menuHandlers } from './menu';
import { roleHandlers } from './role';
import { productHandlers } from './products';
import { orderHandlers } from './orders';
import { analyticsHandlers } from './analytics';
import { categoryHandlers } from './categories';
import { inventoryHandlers } from './inventory';
import { organizationHandlers } from './organization';
import { systemMenuHandlers } from './system-menu';

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
];
