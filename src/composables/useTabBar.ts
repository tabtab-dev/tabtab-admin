/**
 * TabBar Composable
 * @description 专业的标签栏逻辑管理
 */
import { ref, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useScroll, useResizeObserver } from '@vueuse/core';
import { useTabBarStore } from '@/stores/global/tabbar';
import { useMenuStore } from '@/stores/global/menu';

export interface UseTabBarOptions {
  /** 滚动容器 ref */
  scrollContainerRef: ReturnType<typeof ref<HTMLElement | null>>;
  /** 标签列表容器 ref */
  tabsContainerRef: ReturnType<typeof ref<HTMLElement | null>>;
}

export interface UseTabBarReturn {
  // State
  isOverflowing: ReturnType<typeof ref<boolean>>;
  canScrollLeft: ReturnType<typeof computed<boolean>>;
  canScrollRight: ReturnType<typeof computed<boolean>>;
  scrollProgress: ReturnType<typeof computed<number>>;

  // Actions
  scrollToTab: (path: string) => void;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollToStart: () => void;
  scrollToEnd: () => void;

  // Tab operations
  handleTabClick: (path: string) => void;
  handleCloseTab: (path: string) => void;
  handleRefreshTab: (path: string) => void;
  handleCloseOthers: (path: string) => void;
  handleCloseLeft: (path: string) => void;
  handleCloseRight: (path: string) => void;
  handleCloseAll: () => void;

  // Drag operations
  handleDragStart: (event: DragEvent, path: string) => void;
  handleDragOver: (event: DragEvent, path: string) => void;
  handleDragEnd: () => void;
}

export function useTabBar(options: UseTabBarOptions): UseTabBarReturn {
  const { scrollContainerRef, tabsContainerRef } = options;
  const route = useRoute();
  const router = useRouter();
  const tabBarStore = useTabBarStore();
  const menuStore = useMenuStore();

  // ============ Scroll State ============
  const isOverflowing = ref(false);
  const isAtStart = ref(true);
  const isAtEnd = ref(true);

  // Use VueUse useScroll for better scroll handling
  // 注意：监听的是 tabsContainerRef（真正滚动的容器），而不是 scrollContainerRef（外层 overflow-hidden 容器）
  const { x: scrollX } = useScroll(tabsContainerRef, {
    behavior: 'smooth',
  });

  // Check overflow and scroll position
  const checkOverflow = () => {
    nextTick(() => {
      const container = scrollContainerRef.value;
      const content = tabsContainerRef.value;
      if (!container || !content) {
        isOverflowing.value = false;
        isAtStart.value = true;
        isAtEnd.value = true;
        return;
      }
      isOverflowing.value = content.scrollWidth > container.clientWidth;
      
      // 手动计算滚动位置状态
      const maxScroll = content.scrollWidth - container.clientWidth;
      const currentScroll = content.scrollLeft;
      isAtStart.value = currentScroll <= 0;
      isAtEnd.value = currentScroll >= maxScroll - 1; // 1px 容差
    });
  };

  // Use resize observer for container changes
  useResizeObserver(scrollContainerRef, checkOverflow);
  // 同时监听内容容器的变化（标签增减时触发）
  useResizeObserver(tabsContainerRef, checkOverflow);

  // Watch tabs length changes
  watch(() => tabBarStore.tabs.length, checkOverflow, { immediate: true });

  // 监听滚动位置变化
  watch(scrollX, () => {
    checkOverflow();
  });

  const canScrollLeft = computed(() => isOverflowing.value && !isAtStart.value);
  const canScrollRight = computed(() => isOverflowing.value && !isAtEnd.value);

  const scrollProgress = computed(() => {
    if (!isOverflowing.value) return 0;
    const container = scrollContainerRef.value;
    const content = tabsContainerRef.value;
    if (!container || !content) return 0;
    const maxScroll = content.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return 0;
    return (scrollX.value / maxScroll) * 100;
  });

  // ============ Scroll Actions ============
  const scrollOffset = 200;

  const scrollToTab = (path: string) => {
    nextTick(() => {
      const tabElement = tabsContainerRef.value?.querySelector(`[data-tab-path="${path}"]`) as HTMLElement;
      // 使用 tabsContainerRef（真正滚动的容器）
      if (tabElement && tabsContainerRef.value && scrollContainerRef.value) {
        const containerRect = scrollContainerRef.value.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();
        const currentScroll = tabsContainerRef.value.scrollLeft;

        // Calculate center position
        const tabCenter = tabRect.left + tabRect.width / 2 - containerRect.left;
        const containerCenter = containerRect.width / 2;
        const newScroll = currentScroll + tabCenter - containerCenter;

        tabsContainerRef.value.scrollTo({
          left: newScroll,
          behavior: 'smooth',
        });
      }
    });
  };

  const scrollLeft = () => {
    tabsContainerRef.value?.scrollBy({
      left: -scrollOffset,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    tabsContainerRef.value?.scrollBy({
      left: scrollOffset,
      behavior: 'smooth',
    });
  };

  const scrollToStart = () => {
    tabsContainerRef.value?.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  };

  const scrollToEnd = () => {
    if (tabsContainerRef.value) {
      tabsContainerRef.value.scrollTo({
        left: tabsContainerRef.value.scrollWidth,
        behavior: 'smooth',
      });
    }
  };

  // ============ Tab Operations ============
  const handleTabClick = (path: string) => {
    tabBarStore.activateTab(path);
    router.push(path);
  };

  const handleCloseTab = (path: string) => {
    tabBarStore.removeTab(path);
  };

  const handleRefreshTab = (path: string) => {
    tabBarStore.refreshTab(path);
    // Dispatch custom event for page refresh
    window.dispatchEvent(new CustomEvent('tab-refresh', { detail: { path } }));
  };

  const handleCloseOthers = (path: string) => {
    tabBarStore.closeOtherTabs(path);
  };

  const handleCloseLeft = (path: string) => {
    tabBarStore.closeLeftTabs(path);
  };

  const handleCloseRight = (path: string) => {
    tabBarStore.closeRightTabs(path);
  };

  const handleCloseAll = () => {
    tabBarStore.closeAllTabs();
    // Navigate to first affix tab if exists
    const firstAffix = tabBarStore.tabs.find(t => t.affix);
    if (firstAffix) {
      router.push(firstAffix.path);
    }
  };

  // ============ Drag & Drop ============
  const draggedPath = ref<string | null>(null);

  const handleDragStart = (event: DragEvent, path: string) => {
    draggedPath.value = path;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', path);
    }
  };

  const handleDragOver = (event: DragEvent, targetPath: string) => {
    event.preventDefault();
    if (!draggedPath.value || draggedPath.value === targetPath) return;

    // Reorder tabs
    const fromIndex = tabBarStore.tabs.findIndex(t => t.path === draggedPath.value);
    const toIndex = tabBarStore.tabs.findIndex(t => t.path === targetPath);

    if (fromIndex !== -1 && toIndex !== -1) {
      const tabs = [...tabBarStore.tabs];
      const [movedTab] = tabs.splice(fromIndex, 1);
      tabs.splice(toIndex, 0, movedTab);
      tabBarStore.tabs = tabs;
    }
  };

  const handleDragEnd = () => {
    draggedPath.value = null;
  };

  // ============ Route Watch ============
  // 等待菜单加载完成后再创建标签，确保能获取正确的国际化 key 和图标
  watch(
    [() => route.path, () => menuStore.isLoaded],
    ([newPath, isLoaded]) => {
      if (!newPath || !isLoaded) return;

      // Check if tab already exists
      const existingTab = tabBarStore.tabs.find((t) => t.path === newPath);
      if (existingTab) {
        // 更新现有标签的标题和图标（以防之前加载不正确）
        const titleKey = menuStore.getRouteTitle(newPath);
        const menuItem = menuStore.flatMenus.find((m) => m.path === newPath);
        if (titleKey && titleKey !== existingTab.title) {
          existingTab.title = titleKey;
        }
        if (menuItem?.icon && !existingTab.icon) {
          existingTab.icon = menuItem.icon;
        }
        tabBarStore.activateTab(newPath);
        scrollToTab(newPath);
        return;
      }

      // Get title and icon from menu
      const titleKey = menuStore.getRouteTitle(newPath);
      const menuItem = menuStore.flatMenus.find((m) => m.path === newPath);

      tabBarStore.addTab({
        path: newPath,
        title: titleKey,
        icon: menuItem?.icon,
        affix: newPath === '/dashboard',
      });

      scrollToTab(newPath);
    },
    { immediate: true }
  );

  // ============ Locale Watch ============
  // 语言切换时，标题会自动通过 t() 函数重新翻译，无需手动更新
  // 保留此 watch 以备后续需要执行其他语言切换相关操作

  return {
    // State
    isOverflowing,
    canScrollLeft,
    canScrollRight,
    scrollProgress,

    // Scroll actions
    scrollToTab,
    scrollLeft,
    scrollRight,
    scrollToStart,
    scrollToEnd,

    // Tab operations
    handleTabClick,
    handleCloseTab,
    handleRefreshTab,
    handleCloseOthers,
    handleCloseLeft,
    handleCloseRight,
    handleCloseAll,

    // Drag operations
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
