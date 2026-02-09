/**
 * 通用常量
 * @description 定义项目中的通用常量
 */

/** 本地存储键名 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  AUTH: 'app-auth',
  THEME: 'app-theme-config',
  LOCALE: 'app-locale',
  LAYOUT_CONFIG: 'layoutConfig',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  SIDEBAR_STATE: 'sidebar-state',
  TABBAR: 'tabbar-tabs',
  TABBAR_ACTIVE: 'tabbar-active',
} as const;

/** StorageKey 类型 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/** 主题模式 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;



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

/** 分类状态 */
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

/** 盘点状态 */
export const STOCK_CHECK_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ADJUSTED: 'adjusted',
} as const;

/** 活动类型 */
export const ACTIVITY_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

/** 按钮变体 */
export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  DEFAULT: 'default',
  DANGER: 'danger',
  LINK: 'link',
} as const;

/** 状态配置映射 */
export const STATUS_CONFIG = {
  /** 产品状态配置 */
  PRODUCT: {
    ACTIVE: { value: PRODUCT_STATUS.ACTIVE, text: '在售', color: 'success' },
    LOW_STOCK: { value: PRODUCT_STATUS.LOW_STOCK, text: '库存不足', color: 'warning' },
    OUT_OF_STOCK: { value: PRODUCT_STATUS.OUT_OF_STOCK, text: '缺货', color: 'error' },
  },
  /** 用户状态配置 */
  USER: {
    ACTIVE: { value: USER_STATUS.ACTIVE, text: '活跃', color: 'success' },
    INACTIVE: { value: USER_STATUS.INACTIVE, text: '非活跃', color: 'default' },
    SUSPENDED: { value: USER_STATUS.SUSPENDED, text: '已暂停', color: 'error' },
  },
  /** 订单状态配置 */
  ORDER: {
    PENDING: { value: ORDER_STATUS.PENDING, text: '待处理', color: 'warning' },
    PROCESSING: { value: ORDER_STATUS.PROCESSING, text: '处理中', color: 'info' },
    COMPLETED: { value: ORDER_STATUS.COMPLETED, text: '已完成', color: 'success' },
    CANCELLED: { value: ORDER_STATUS.CANCELLED, text: '已取消', color: 'error' },
  },
} as const;
