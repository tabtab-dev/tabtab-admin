import { defaultSidebarConfig, type SidebarConfig } from '@/components/layout/sidebar/config';
import { useMenuUtils } from './useMenuUtils';

const STORAGE_KEY = 'sidebar-state';

interface SidebarState {
  collapsed: boolean;
  size: number;
  expandedKeys: string[];
}

export function useSidebar(config: SidebarConfig = defaultSidebarConfig) {
  const route = useRoute();
  const { width: windowWidth } = useWindowSize();

  const pxToPercent = (px: number): number => (px / windowWidth.value) * 100;
  const percentToPx = (percent: number): number => (percent / 100) * windowWidth.value;

  // 状态
  const collapsed = ref(false);
  const size = ref(pxToPercent(config.defaultWidth));
  const expandedKeys = ref<Set<string>>(new Set());
  const isDragging = ref(false);

  const menuUtils = useMenuUtils({ expandedKeys });

  // 计算属性
  const currentWidth = computed(() =>
    collapsed.value ? config.collapsedWidth : percentToPx(size.value)
  );

  const currentSize = computed(() =>
    collapsed.value ? pxToPercent(config.collapsedWidth) : size.value
  );

  // 自动保存状态
  watch(
    [collapsed, size, expandedKeys],
    () => {
      try {
        const state: SidebarState = {
          collapsed: collapsed.value,
          size: size.value,
          expandedKeys: Array.from(expandedKeys.value),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // 忽略存储错误
      }
    },
    { deep: true }
  );

  // 操作方法
  const toggleCollapse = (): void => {
    collapsed.value = !collapsed.value;
  };

  const expand = (): void => {
    if (collapsed.value) collapsed.value = false;
  };

  const collapse = (): void => {
    if (!collapsed.value) collapsed.value = true;
  };

  const setSize = (newSize: number): void => {
    const minSize = pxToPercent(config.minWidth);
    const maxSize = pxToPercent(config.maxWidth);
    size.value = Math.max(minSize, Math.min(maxSize, newSize));
  };

  const finalizeDrag = (): void => {
    isDragging.value = false;
  };

  const startDrag = (): void => {
    isDragging.value = true;
  };

  const toggleSubMenu = (key: string): void => {
    const newSet = new Set(expandedKeys.value);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    expandedKeys.value = newSet;
  };

  const expandSubMenu = (key: string): void => {
    if (!expandedKeys.value.has(key)) {
      expandedKeys.value = new Set([...expandedKeys.value, key]);
    }
  };

  const collapseSubMenu = (key: string): void => {
    if (expandedKeys.value.has(key)) {
      const newSet = new Set(expandedKeys.value);
      newSet.delete(key);
      expandedKeys.value = newSet;
    }
  };

  const expandToActive = (): void => {
    const keys = menuUtils.getExpandedKeysByPath(config.menus);
    expandedKeys.value = new Set([...expandedKeys.value, ...keys]);
  };

  // 恢复状态
  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: SidebarState = JSON.parse(saved);
        collapsed.value = state.collapsed ?? false;

        const minSize = pxToPercent(config.minWidth);
        const maxSize = pxToPercent(config.maxWidth);
        size.value = Math.max(minSize, Math.min(maxSize, state.size ?? pxToPercent(config.defaultWidth)));

        expandedKeys.value = new Set(state.expandedKeys ?? []);
      }
    } catch {
      // 使用默认值
    }
  });

  return {
    collapsed,
    width: currentWidth,
    size,
    currentWidth,
    currentSize,
    expandedKeys,
    isDragging,
    config,
    ...menuUtils,
    toggleCollapse,
    expand,
    collapse,
    setSize,
    startDrag,
    finalizeDrag,
    toggleSubMenu,
    expandSubMenu,
    collapseSubMenu,
    expandToActive,
  };
}
