import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

export interface Notification {
  /** 唯一标识 */
  id: string;
  /** 消息内容 */
  message: string;
  /** 通知类型 */
  type: 'success' | 'error' | 'warning' | 'info';
  /** 是否可关闭 */
  dismissible?: boolean;
  /** 自动关闭时间（毫秒），0 表示不自动关闭 */
  duration?: number;
}

/**
 * 应用级状态管理
 * 注意：主题相关逻辑请使用 useThemeStore，侧边栏状态请使用 useSidebar
 */
export const useAppStore = defineStore('app', () => {
  /** 移动端侧边栏显示状态 */
  const mobileSidebarOpen = ref(false);
  
  /** 全局通知列表 */
  const notifications = ref<Notification[]>([]);
  
  /** 全局加载状态 */
  const isLoading = ref(false);

  /**
   * 切换移动端侧边栏
   */
  const toggleMobileSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value;
  };

  /**
   * 设置移动端侧边栏状态
   * @param open 是否打开
   */
  const setMobileSidebar = (open: boolean) => {
    mobileSidebarOpen.value = open;
  };

  /**
   * 添加通知
   * @param message 消息内容
   * @param type 通知类型
   * @param options 额外选项
   */
  const addNotification = (
    message: string, 
    type: Notification['type'] = 'info',
    options: { dismissible?: boolean; duration?: number } = {}
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { dismissible = true, duration = 3000 } = options;
    
    notifications.value.push({ 
      id, 
      message, 
      type, 
      dismissible,
      duration 
    });
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  /**
   * 移除通知
   * @param id 通知ID
   */
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  /**
   * 清空所有通知
   */
  const clearNotifications = () => {
    notifications.value = [];
  };

  /**
   * 设置全局加载状态
   * @param loading 是否加载中
   */
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  return {
    // 状态
    mobileSidebarOpen,
    notifications,
    isLoading,
    
    // 方法
    toggleMobileSidebar,
    setMobileSidebar,
    addNotification,
    removeNotification,
    clearNotifications,
    setLoading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
