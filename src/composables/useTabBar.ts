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
  const { t, locale } = useI18n();
  const tabBarStore = useTabBarStore();
  const menuStore = useMenuStore();

  // ============ Scroll State ============
  const isOverflowing = ref(false);

  // Use VueUse useScroll for better scroll handling
  const { x: scrollX, arrivedState } = useScroll(scrollContainerRef, {
    behavior: 'smooth',
  });

  // Check overflow function
  const checkOverflow = () => {
    nextTick(() => {
      const container = scrollContainerRef.value;
      const content = tabsContainerRef.value;
      if (!container || !content) {
        isOverflowing.value = false;
        return;
      }
      isOverflowing.value = content.scrollWidth > container.clientWidth;
    });
  };

  // Use resize observer for container changes only
  useResizeObserver(scrollContainerRef, checkOverflow);

  // Watch tabs length changes
  watch(() => tabBarStore.tabs.length, checkOverflow, { immediate: true });

  const canScrollLeft = computed(() => isOverflowing.value && !arrivedState.left);
  const canScrollRight = computed(() => isOverflowing.value && !arrivedState.right);

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
      if (tabElement && scrollContainerRef.value) {
        const containerRect = scrollContainerRef.value.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();
        const currentScroll = scrollContainerRef.value.scrollLeft;

        // Calculate center position
        const tabCenter = tabRect.left + tabRect.width / 2 - containerRect.left;
        const containerCenter = containerRect.width / 2;
        const newScroll = currentScroll + tabCenter - containerCenter;

        scrollContainerRef.value.scrollTo({
          left: newScroll,
          behavior: 'smooth',
        });
      }
    });
  };

  const scrollLeft = () => {
    scrollContainerRef.value?.scrollBy({
      left: -scrollOffset,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollContainerRef.value?.scrollBy({
      left: scrollOffset,
      behavior: 'smooth',
    });
  };

  const scrollToStart = () => {
    scrollContainerRef.value?.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  };

  const scrollToEnd = () => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.scrollTo({
        left: scrollContainerRef.value.scrollWidth,
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
  watch(
    () => route.path,
    (newPath) => {
      if (!newPath) return;

      // Check if tab already exists
      const existingTab = tabBarStore.tabs.find((t) => t.path === newPath);
      if (existingTab) {
        tabBarStore.activateTab(newPath);
        scrollToTab(newPath);
        return;
      }

      // Get title and icon from menu
      const titleKey = menuStore.getRouteTitleKey(newPath);
      const menuItem = menuStore.flatMenus.find((m) => m.path === newPath);

      tabBarStore.addTab({
        path: newPath,
        title: t(titleKey),
        icon: menuItem?.icon,
        affix: newPath === '/dashboard',
      });

      scrollToTab(newPath);
    },
    { immediate: true }
  );

  // ============ Locale Watch ============
  watch(
    () => locale.value,
    () => {
      tabBarStore.updateAllTabsTitle((path: string) => {
        const titleKey = menuStore.getRouteTitleKey(path);
        return t(titleKey);
      });
    }
  );

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
