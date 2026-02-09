/**
 * 权限常量定义
 * @description 定义系统所有权限码常量，与后端约定保持一致
 */

/** 用户管理权限 */
export const USER_PERMISSIONS = {
  /** 创建用户 */
  CREATE: 'user:create',
  /** 查看用户 */
  READ: 'user:read',
  /** 更新用户 */
  UPDATE: 'user:update',
  /** 删除用户 */
  DELETE: 'user:delete',
  /** 导出用户 */
  EXPORT: 'user:export',
  /** 重置密码 */
  RESET_PASSWORD: 'user:reset_password',
} as const;

/** 产品管理权限 */
export const PRODUCT_PERMISSIONS = {
  /** 创建产品 */
  CREATE: 'product:create',
  /** 查看产品 */
  READ: 'product:read',
  /** 更新产品 */
  UPDATE: 'product:update',
  /** 删除产品 */
  DELETE: 'product:delete',
  /** 导出产品 */
  EXPORT: 'product:export',
} as const;

/** 订单管理权限 */
export const ORDER_PERMISSIONS = {
  /** 创建订单 */
  CREATE: 'order:create',
  /** 查看订单 */
  READ: 'order:read',
  /** 更新订单 */
  UPDATE: 'order:update',
  /** 删除订单 */
  DELETE: 'order:delete',
  /** 导出订单 */
  EXPORT: 'order:export',
  /** 审核订单 */
  AUDIT: 'order:audit',
} as const;

/** 分类管理权限 */
export const CATEGORY_PERMISSIONS = {
  /** 创建分类 */
  CREATE: 'category:create',
  /** 查看分类 */
  READ: 'category:read',
  /** 更新分类 */
  UPDATE: 'category:update',
  /** 删除分类 */
  DELETE: 'category:delete',
} as const;

/** 库存管理权限 */
export const INVENTORY_PERMISSIONS = {
  /** 查看库存 */
  READ: 'inventory:read',
  /** 更新库存 */
  UPDATE: 'inventory:update',
  /** 盘点库存 */
  CHECK: 'inventory:check',
  /** 调整库存 */
  ADJUST: 'inventory:adjust',
} as const;

/** 仓库管理权限 */
export const WAREHOUSE_PERMISSIONS = {
  /** 创建仓库 */
  CREATE: 'warehouse:create',
  /** 查看仓库 */
  READ: 'warehouse:read',
  /** 更新仓库 */
  UPDATE: 'warehouse:update',
  /** 删除仓库 */
  DELETE: 'warehouse:delete',
} as const;

/** 系统管理权限 */
export const SYSTEM_PERMISSIONS = {
  /** 查看系统设置 */
  SETTINGS_READ: 'system:settings:read',
  /** 修改系统设置 */
  SETTINGS_UPDATE: 'system:settings:update',
  /** 查看日志 */
  LOG_READ: 'system:log:read',
  /** 角色管理 */
  ROLE_MANAGE: 'system:role:manage',
  /** 权限管理 */
  PERMISSION_MANAGE: 'system:permission:manage',
} as const;

/** 数据分析权限 */
export const ANALYTICS_PERMISSIONS = {
  /** 查看流量分析 */
  TRAFFIC_READ: 'analytics:traffic:read',
  /** 查看销售分析 */
  SALES_READ: 'analytics:sales:read',
  /** 查看用户分析 */
  USERS_READ: 'analytics:users:read',
} as const;

/** 所有权限汇总 */
export const PERMISSIONS = {
  USER: USER_PERMISSIONS,
  PRODUCT: PRODUCT_PERMISSIONS,
  ORDER: ORDER_PERMISSIONS,
  CATEGORY: CATEGORY_PERMISSIONS,
  INVENTORY: INVENTORY_PERMISSIONS,
  WAREHOUSE: WAREHOUSE_PERMISSIONS,
  SYSTEM: SYSTEM_PERMISSIONS,
  ANALYTICS: ANALYTICS_PERMISSIONS,
} as const;

/** 权限码类型 */
export type PermissionCode =
  | typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS]
  | typeof PRODUCT_PERMISSIONS[keyof typeof PRODUCT_PERMISSIONS]
  | typeof ORDER_PERMISSIONS[keyof typeof ORDER_PERMISSIONS]
  | typeof CATEGORY_PERMISSIONS[keyof typeof CATEGORY_PERMISSIONS]
  | typeof INVENTORY_PERMISSIONS[keyof typeof INVENTORY_PERMISSIONS]
  | typeof WAREHOUSE_PERMISSIONS[keyof typeof WAREHOUSE_PERMISSIONS]
  | typeof SYSTEM_PERMISSIONS[keyof typeof SYSTEM_PERMISSIONS]
  | typeof ANALYTICS_PERMISSIONS[keyof typeof ANALYTICS_PERMISSIONS];
