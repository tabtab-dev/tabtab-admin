import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defaultSidebarConfig } from '@/layouts/components/sidebar/config';

/**
 * 标签项接口
 */
export interface TabItem {
  /** 唯一标识（路由路径） */
  path: string;
  /** 标题 */
  title: string;
  /** 标题国际化键名 */
  titleKey?: string;
  /** 图标组件 */
  icon?: Component;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否固定（首页等） */
  affix?: boolean;
}

/**
 * 本地存储键名
 */
const STORAGE_KEY = 'app-tabbar-config';

/**
 * 可序列化的标签项（不包含 icon 组件）
 */
interface SerializableTabItem {
  path: string;
  title: string;
  titleKey?: string;
  closable?: boolean;
  affix?: boolean;
}

/**
 * 从本地存储加载配置
 */
const loadFromStorage = (): { tabs: SerializableTabItem[]; activeTab: string } | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // 忽略解析错误
  }
  return null;
};

/**
 * 保存到本地存储（排除 icon 字段）
 */
const saveToStorage = (tabs: TabItem[], activeTab: string) => {
  try {
    // 排除 icon 字段，只保存可序列化的数据
    const serializableTabs: SerializableTabItem[] = tabs.map(({ icon, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tabs: serializableTabs, activeTab }));
  } catch {
    // 忽略存储错误
  }
};

/**
 * 为标签项恢复图标
 * @param tabs 标签列表
 * @returns 恢复图标后的标签列表
 */
const restoreIcons = (tabs: SerializableTabItem[]): TabItem[] => {
  return tabs.map(tab => ({
    ...tab,
    icon: findIconFromMenu(tab.path),
  }));
};

/**
 * 从菜单配置中查找图标
 * @param path 路由路径
 * @returns 图标组件
 */
const findIconFromMenu = (path: string): Component | undefined => {
  // 遍历所有菜单项查找匹配的图标
  const findInMenus = (menus: typeof defaultSidebarConfig.menus): Component | undefined => {
    for (const menu of menus) {
      if (menu.path === path) {
        return menu.icon;
      }
      if (menu.children) {
        const found = findInMenus(menu.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  return findInMenus(defaultSidebarConfig.menus);
};

/**
 * 默认固定标签（首页）
 */
const defaultFixedTabs: TabItem[] = [
  {
    path: '/',
    title: '首页',
    titleKey: 'menu.dashboard',
    icon: findIconFromMenu('/'),
    closable: false,
    affix: true,
  },
];

export const useTabBarStore = defineStore('tabbar', () => {
  // 加载存储的配置
  const storedConfig = loadFromStorage();

  /** 标签列表 - 加载后恢复图标 */
  const tabs = ref<TabItem[]>(
    storedConfig?.tabs ? restoreIcons(storedConfig.tabs) : [...defaultFixedTabs]
  );
  /** 当前激活的标签路径 */
  const activeTab = ref<string>(storedConfig?.activeTab || '/');

  /** 标签数量 */
  const tabCount = computed(() => tabs.value.length);
  /** 是否可以关闭其他标签 */
  const canCloseOthers = computed(() => tabs.value.filter(tab => !tab.affix).length > 0);
  /** 是否可以关闭全部 */
  const canCloseAll = computed(() => tabs.value.some(tab => !tab.affix && tab.closable !== false));

  /**
   * 添加标签
   * @param tab 标签项
   */
  const addTab = (tab: TabItem) => {
    // 检查是否已存在
    const existingTab = tabs.value.find(item => item.path === tab.path);
    if (!existingTab) {
      tabs.value.push({
        ...tab,
        closable: tab.closable !== false,
      });
      persistConfig();
    }
    // 激活该标签
    activeTab.value = tab.path;
    persistConfig();
  };

  /**
   * 关闭标签
   * @param path 标签路径
   * @param router 路由器实例（用于跳转）
   * @param currentPath 当前路径
   */
  const closeTab = (path: string, router?: ReturnType<typeof useRouter>, currentPath?: string) => {
    const tabIndex = tabs.value.findIndex(tab => tab.path === path);
    if (tabIndex === -1) return;

    const tab = tabs.value[tabIndex];
    // 固定标签不能关闭
    if (tab.affix) return;

    tabs.value.splice(tabIndex, 1);

    // 如果关闭的是当前激活的标签，需要激活其他标签
    if (activeTab.value === path && router) {
      // 优先激活左侧标签
      const newActiveTab = tabs.value[tabIndex - 1] || tabs.value[tabIndex];
      if (newActiveTab) {
        activeTab.value = newActiveTab.path;
        router.push(newActiveTab.path);
      }
    }

    persistConfig();
  };

  /**
   * 关闭其他标签
   * @param keepPath 保留的标签路径
   */
  const closeOthers = (keepPath: string) => {
    tabs.value = tabs.value.filter(tab => tab.affix || tab.path === keepPath);
    activeTab.value = keepPath;
    persistConfig();
  };

  /**
   * 关闭全部标签（保留固定标签）
   */
  const closeAll = (router?: ReturnType<typeof useRouter>) => {
    const fixedTabs = tabs.value.filter(tab => tab.affix);
    tabs.value = fixedTabs;
    
    // 激活第一个固定标签
    if (fixedTabs.length > 0) {
      activeTab.value = fixedTabs[0].path;
      if (router) {
        router.push(fixedTabs[0].path);
      }
    }
    
    persistConfig();
  };

  /**
   * 激活标签
   * @param path 标签路径
   */
  const activateTab = (path: string) => {
    if (tabs.value.some(tab => tab.path === path)) {
      activeTab.value = path;
      persistConfig();
    }
  };

  /**
   * 刷新标签
   * @param path 标签路径
   */
  const refreshTab = (path: string) => {
    // 触发页面刷新逻辑，可以通过事件或 provide/inject 实现
    window.dispatchEvent(new CustomEvent('tab-refresh', { detail: { path } }));
  };

  /**
   * 从路由添加标签
   * @param route 当前路由
   */
  const addTabFromRoute = (route: ReturnType<typeof useRoute>) => {
    // 只处理有 meta 信息的路由
    if (!route.meta?.title && !route.meta?.titleKey) return;

    // 跳过登录页等特殊页面
    if (route.path === '/login' || route.path === '/404') return;

    // 从菜单配置中查找图标
    const icon = findIconFromMenu(route.path);

    const tab: TabItem = {
      path: route.path,
      title: (route.meta.title as string) || route.name as string || '未命名',
      titleKey: route.meta.titleKey as string,
      icon: icon,
      closable: route.meta.affix !== true,
      affix: route.meta.affix === true,
    };

    addTab(tab);
  };

  /**
   * 保存当前配置
   */
  const persistConfig = () => {
    saveToStorage(tabs.value, activeTab.value);
  };

  /**
   * 重置为默认状态
   */
  const reset = () => {
    tabs.value = [...defaultFixedTabs];
    activeTab.value = '/';
    persistConfig();
  };

  return {
    // 状态
    tabs,
    activeTab,
    // 计算属性
    tabCount,
    canCloseOthers,
    canCloseAll,
    // 方法
    addTab,
    closeTab,
    closeOthers,
    closeAll,
    activateTab,
    refreshTab,
    addTabFromRoute,
    reset,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabBarStore, import.meta.hot));
}
