/**
 * TabBar 状态管理
 * @description 使用 Pinia 管理多标签页状态
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import { markRaw } from 'vue';
import type { Component } from 'vue';
import { useMenuStore } from './menu';
import { loadIcon, getCachedIcon } from '@/composables/useIcon';
import type { TabItem } from '@/types/tabbar';

export const useTabBarStore = defineStore(
  'tabbar',
  () => {
    // State
    const tabs = ref<TabItem[]>([]);
    const activeTab = ref<string>('');
    const isLoading = ref(false);

    // Getters
    /**
     * 获取所有标签页
     */
    const allTabs = computed(() => tabs.value);

    /**
     * 获取当前激活的标签页
     */
    const currentTab = computed(() => {
      return tabs.value.find((tab) => tab.path === activeTab.value);
    });

    /**
     * 获取可关闭的标签页（排除固定标签）
     */
    const closableTabs = computed(() => {
      return tabs.value.filter((tab) => !tab.affix);
    });

    // Actions
    /**
     * 从菜单数据中查找图标
     * @param path - 路由路径
     * @returns 图标组件或 undefined
     */
    const findIconFromMenu = async (path: string): Promise<Component | undefined> => {
      const menuStore = useMenuStore();

      // 先在扁平化菜单中查找
      const menuItem = menuStore.flatMenus.find((item) => item.path === path);
      if (menuItem?.icon) {
        // 尝试从缓存获取
        const cachedIcon = getCachedIcon(menuItem.icon);
        if (cachedIcon) {
          return markRaw(cachedIcon);
        }
        // 异步加载图标
        const icon = await loadIcon(menuItem.icon);
        return icon ? markRaw(icon) : undefined;
      }

      return undefined;
    };

    /**
     * 添加标签页
     * @param tab - 标签页数据
     */
    const addTab = async (tab: Omit<TabItem, 'icon'> & { icon?: Component | string }): Promise<void> => {
      // 检查是否已存在
      const existingTab = tabs.value.find((t) => t.path === tab.path);
      if (existingTab) {
        // 如果已存在，更新标题（可能语言切换了）
        existingTab.title = tab.title;
        activeTab.value = tab.path;
        return;
      }

      // 处理图标
      let iconComponent: Component | undefined;
      if (typeof tab.icon === 'string') {
        // 如果是字符串，从菜单查找或加载
        iconComponent = await findIconFromMenu(tab.path);
        if (!iconComponent && tab.icon) {
          const loaded = await loadIcon(tab.icon);
          if (loaded) {
            iconComponent = markRaw(loaded);
          }
        }
      } else if (tab.icon) {
        iconComponent = markRaw(tab.icon);
      }

      // 如果还是没有图标，尝试从菜单查找
      if (!iconComponent) {
        iconComponent = await findIconFromMenu(tab.path);
      }

      const newTab: TabItem = {
        ...tab,
        icon: iconComponent,
      };

      tabs.value.push(newTab);
      activeTab.value = tab.path;
    };

    /**
     * 移除标签页
     * @param path - 标签页路径
     */
    const removeTab = (path: string): void => {
      const index = tabs.value.findIndex((tab) => tab.path === path);
      if (index === -1) return;

      const tab = tabs.value[index];
      if (tab.affix) return; // 固定标签不能关闭

      tabs.value.splice(index, 1);

      // 如果关闭的是当前激活的标签，激活相邻标签
      if (activeTab.value === path) {
        const nextTab = tabs.value[index] || tabs.value[index - 1];
        if (nextTab) {
          activeTab.value = nextTab.path;
        }
      }
    };

    /**
     * 激活标签页
     * @param path - 标签页路径
     */
    const activateTab = (path: string): void => {
      const tab = tabs.value.find((t) => t.path === path);
      if (tab) {
        activeTab.value = path;
      }
    };

    /**
     * 关闭其他标签页
     * @param path - 保留的标签页路径
     */
    const closeOtherTabs = (path: string): void => {
      tabs.value = tabs.value.filter((tab) => tab.path === path || tab.affix);
    };

    /**
     * 关闭左侧标签页
     * @param path - 目标标签页路径
     */
    const closeLeftTabs = (path: string): void => {
      const index = tabs.value.findIndex((tab) => tab.path === path);
      if (index === -1) return;

      tabs.value = tabs.value.filter((tab, i) => i >= index || tab.affix);
    };

    /**
     * 关闭右侧标签页
     * @param path - 目标标签页路径
     */
    const closeRightTabs = (path: string): void => {
      const index = tabs.value.findIndex((tab) => tab.path === path);
      if (index === -1) return;

      tabs.value = tabs.value.filter((tab, i) => i <= index || tab.affix);
    };

    /**
     * 关闭所有标签页
     */
    const closeAllTabs = (): void => {
      tabs.value = tabs.value.filter((tab) => tab.affix);
      if (tabs.value.length > 0) {
        activeTab.value = tabs.value[0].path;
      }
    };

    /**
     * 刷新标签页
     * @param path - 标签页路径
     */
    const refreshTab = (path: string): void => {
      const tab = tabs.value.find((t) => t.path === path);
      if (tab) {
        tab.isRefreshing = true;
        setTimeout(() => {
          tab.isRefreshing = false;
        }, 500);
      }
    };

    /**
     * 设置标签页加载状态
     * @param path - 标签页路径
     * @param loading - 是否加载中
     */
    const setTabLoading = (path: string, loading: boolean): void => {
      const tab = tabs.value.find((t) => t.path === path);
      if (tab) {
        tab.isLoading = loading;
      }
    };

    /**
     * 更新标签页标题
     * @param path - 标签页路径
     * @param title - 新标题
     */
    const updateTabTitle = (path: string, title: string): void => {
      const tab = tabs.value.find((t) => t.path === path);
      if (tab) {
        tab.title = title;
      }
    };

    /**
     * 更新所有标签页标题
     * @param getTitle - 获取标题的函数，接收 path 返回翻译后的标题
     */
    const updateAllTabsTitle = (getTitle: (path: string) => string): void => {
      tabs.value.forEach((tab) => {
        tab.title = getTitle(tab.path);
      });
    };

    /**
     * 更新标签页图标
     * @param path - 标签页路径
     * @param icon - 新图标
     */
    const updateTabIcon = async (path: string, icon: string): Promise<void> => {
      const tab = tabs.value.find((t) => t.path === path);
      if (tab) {
        const loadedIcon = await loadIcon(icon);
        if (loadedIcon) {
          tab.icon = markRaw(loadedIcon);
        }
      }
    };

    /**
     * 从 localStorage 恢复标签页
     */
    const restoreTabs = async (): Promise<void> => {
      try {
        const saved = localStorage.getItem('tabbar-tabs');
        if (saved) {
          const savedTabs: Array<Omit<TabItem, 'icon'> & { icon?: string }> = JSON.parse(saved);

          // 恢复标签页，重新加载图标
          for (const savedTab of savedTabs) {
            const icon = await findIconFromMenu(savedTab.path);
            addTab({
              ...savedTab,
              icon,
              isLoading: false,
              isRefreshing: false,
            });
          }

          const savedActive = localStorage.getItem('tabbar-active');
          if (savedActive) {
            activeTab.value = savedActive;
          }
        }
      } catch (error) {
        console.error('Failed to restore tabs:', error);
      }
    };

    /**
     * 保存标签页到 localStorage
     */
    const saveTabs = (): void => {
      try {
        // 只保存必要的数据，不保存组件引用
        const tabsToSave = tabs.value.map((tab) => ({
          path: tab.path,
          title: tab.title,
          affix: tab.affix,
          icon: undefined, // 图标不保存，恢复时重新加载
        }));
        localStorage.setItem('tabbar-tabs', JSON.stringify(tabsToSave));
        localStorage.setItem('tabbar-active', activeTab.value);
      } catch (error) {
        console.error('Failed to save tabs:', error);
      }
    };

    return {
      // State
      tabs,
      activeTab,
      isLoading,
      // Getters
      allTabs,
      currentTab,
      closableTabs,
      // Actions
      addTab,
      removeTab,
      activateTab,
      closeOtherTabs,
      closeLeftTabs,
      closeRightTabs,
      closeAllTabs,
      refreshTab,
      setTabLoading,
      updateTabTitle,
      updateAllTabsTitle,
      updateTabIcon,
      restoreTabs,
      saveTabs,
    };
  },
  {
    persist: false, // 使用自定义的 localStorage 逻辑
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabBarStore, import.meta.hot));
}
