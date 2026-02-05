/**
 * 通用类型定义
 * @description 统一导出所有通用类型
 */

/** 通知类型 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/** 通知配置 */
export interface Notification {
  /** 唯一标识 */
  id: string;
  /** 消息内容 */
  message: string;
  /** 通知类型 */
  type: NotificationType;
  /** 是否可关闭 */
  dismissible?: boolean;
  /** 自动关闭时间（毫秒），0 表示不自动关闭 */
  duration?: number;
}

/** 主题模式 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/** 布局配置 */
export interface LayoutConfig {
  /** 侧边栏是否折叠 */
  sidebarCollapsed?: boolean;
  /** 是否显示标签栏 */
  showTabBar?: boolean;
}

/** 语言配置 */
export type Locale = 'zh-CN' | 'en-US';
