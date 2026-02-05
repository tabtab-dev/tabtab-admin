/**
 * 通用常量
 * @description 定义项目中的通用常量
 */

/** 本地存储键名 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LOCALE: 'locale',
  LAYOUT_CONFIG: 'layoutConfig',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const;

/** 主题模式 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

/** 语言选项 */
export const LOCALE_OPTIONS = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
] as const;

/** 用户角色 */
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

/** 用户状态 */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

/** 订单状态 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

/** 产品状态 */
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  LOW_STOCK: 'low-stock',
  OUT_OF_STOCK: 'out-of-stock',
} as const;

/** 仓库状态 */
export const WAREHOUSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
