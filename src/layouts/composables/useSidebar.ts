import { defaultSidebarConfig, type SidebarConfig } from '@/components/layout/sidebar/config';
import { useMenuUtils } from './useMenuUtils';

/**
 * 存储键名
 */
const STORAGE_KEY = 'sidebar-state';

/**
 * 存储的状态接口
 */
interface SidebarState {
  /** 是否折叠 */
  collapsed: boolean;
  /** 展开时的宽度（百分比） */
  size: number;
  /** 展开的子菜单 keys */
  expandedKeys: string[];
}

/**
 * 使用侧栏
 * @param config 侧栏配置
 */
export function useSidebar(config: SidebarConfig = defaultSidebarConfig) {
  const route = useRoute();
  const { width: windowWidth } = useWindowSize();

  // 将像素转换为百分比
  const pxToPercent = (px: number): number => (px / windowWidth.value) * 100;

  // 将百分比转换为像素
  const percentToPx = (percent: number): number => (percent / 100) * windowWidth.value;

  // ============ 状态 ============
  const collapsed = ref(false);
  const size = ref(pxToPercent(config.defaultWidth)); // 使用百分比存储
  const expandedKeys = ref<Set<string>>(new Set());
  const isDragging = ref(false);

  // 使用统一的菜单工具函数
  const menuUtils = useMenuUtils({ expandedKeys });

  // ============ 计算属性 ============

  /**
   * 当前宽度（像素）
   */
  const currentWidth = computed(() => {
    return collapsed.value ? config.collapsedWidth : percentToPx(size.value);
  });

  /**
   * 当前尺寸（百分比）
   */
  const currentSize = computed(() => {
    return collapsed.value ? pxToPercent(config.collapsedWidth) : size.value;
  });

  // ============ 方法 ============

  /**
   * 切换折叠/展开
   */
  const toggleCollapse = (): void => {
    collapsed.value = !collapsed.value;
    saveState();
  };

  /**
   * 展开侧栏
   */
  const expand = (): void => {
    if (collapsed.value) {
      collapsed.value = false;
      saveState();
    }
  };

  /**
   * 折叠侧栏
   */
  const collapse = (): void => {
    if (!collapsed.value) {
      collapsed.value = true;
      saveState();
    }
  };

  /**
   * 设置尺寸（百分比）
   */
  const setSize = (newSize: number): void => {
    const minSize = pxToPercent(config.minWidth);
    const maxSize = pxToPercent(config.maxWidth);
    size.value = Math.max(minSize, Math.min(maxSize, newSize));
  };

  /**
   * 完成拖拽
   */
  const finalizeDrag = (): void => {
    isDragging.value = false;
    saveState();
  };

  /**
   * 开始拖拽
   */
  const startDrag = (): void => {
    isDragging.value = true;
  };

  /**
   * 切换子菜单展开/收起
   */
  const toggleSubMenu = (key: string): void => {
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key);
    } else {
      expandedKeys.value.add(key);
    }
    expandedKeys.value = new Set(expandedKeys.value);
    saveState();
  };

  /**
   * 展开子菜单
   */
  const expandSubMenu = (key: string): void => {
    if (!expandedKeys.value.has(key)) {
      expandedKeys.value.add(key);
      expandedKeys.value = new Set(expandedKeys.value);
      saveState();
    }
  };

  /**
   * 收起子菜单
   */
  const collapseSubMenu = (key: string): void => {
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key);
      expandedKeys.value = new Set(expandedKeys.value);
      saveState();
    }
  };

  /**
   * 展开当前激活菜单的所有父级
   */
  const expandToActive = (): void => {
    const keys = menuUtils.getExpandedKeysByPath(config.menus);
    keys.forEach((key) => {
      expandedKeys.value.add(key);
    });
    expandedKeys.value = new Set(expandedKeys.value);
    saveState();
  };

  /**
   * 保存状态到 localStorage
   */
  const saveState = (): void => {
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
  };

  /**
   * 从 localStorage 恢复状态
   */
  const restoreState = (): void => {
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
  };

  // ============ 生命周期 ============

  onMounted(() => {
    restoreState();
  });

  return {
    // 状态
    collapsed,
    width: currentWidth,
    size,
    currentWidth,
    currentSize,
    expandedKeys,
    isDragging,
    config,

    // 菜单工具函数（统一使用）
    ...menuUtils,

    // 操作方法
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
