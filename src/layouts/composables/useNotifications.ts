import type { ComputedRef } from 'vue';
import type { LucideIcon } from 'lucide-vue-next';

/**
 * 通知类型
 */
export type NotificationType = 'info' | 'warning' | 'success' | 'message';

/**
 * 通知项接口
 */
export interface NotificationItem {
  /** 唯一标识 */
  id: string;
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  content: string;
  /** 通知类型 */
  type: NotificationType;
  /** 创建时间 */
  createdAt: Date;
  /** 是否已读 */
  isRead: boolean;
}

/**
 * 通知类型配置
 */
export interface NotificationTypeConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

/**
 * 使用通知功能
 * @param initialNotifications - 初始通知列表
 * @param typeConfig - 通知类型配置
 */
export function useNotifications(
  initialNotifications: NotificationItem[] = [],
  typeConfig: Record<NotificationType, NotificationTypeConfig>
) {
  // ============ 状态 ============
  // 使用 shallowRef 优化性能，通知项内部不需要深度响应
  const notifications = shallowRef<NotificationItem[]>(initialNotifications);
  const isNotificationOpen = ref(false);

  // ============ 计算属性 ============

  /**
   * 未读通知数量
   */
  const unreadCount: ComputedRef<number> = computed(
    () => notifications.value.filter(n => n.isRead === false).length
  );

  /**
   * 是否有未读通知
   */
  const hasUnread: ComputedRef<boolean> = computed(() => unreadCount.value > 0);

  /**
   * 已排序的通知列表（未读在前）
   */
  const sortedNotifications: ComputedRef<NotificationItem[]> = computed(() => {
    return [...notifications.value].sort((a, b) => {
      // 未读优先
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      // 时间倒序
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  });

  // ============ 方法 ============

  /**
   * 格式化时间
   * @param date - 日期对象
   * @returns 格式化后的时间字符串
   */
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  /**
   * 标记通知为已读
   * @param id - 通知ID
   */
  const markAsRead = (id: string): void => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  };

  /**
   * 标记所有通知为已读
   */
  const markAllAsRead = (): void => {
    notifications.value.forEach(n => n.isRead = true);
  };

  /**
   * 删除通知
   * @param id - 通知ID
   */
  const deleteNotification = (id: string): void => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  /**
   * 清空所有通知
   */
  const clearAllNotifications = (): void => {
    notifications.value = [];
  };

  /**
   * 添加通知
   * @param notification - 通知项
   */
  const addNotification = (notification: NotificationItem): void => {
    notifications.value.unshift(notification);
  };

  /**
   * 打开通知面板
   */
  const openNotifications = (): void => {
    isNotificationOpen.value = true;
  };

  /**
   * 关闭通知面板
   */
  const closeNotifications = (): void => {
    isNotificationOpen.value = false;
  };

  /**
   * 切换通知面板
   */
  const toggleNotifications = (): void => {
    isNotificationOpen.value = !isNotificationOpen.value;
  };

  return {
    // 状态
    notifications,
    isNotificationOpen,

    // 计算属性
    unreadCount,
    hasUnread,
    sortedNotifications,

    // 方法
    formatTime,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    openNotifications,
    closeNotifications,
    toggleNotifications,

    // 配置
    typeConfig,
  };
}
