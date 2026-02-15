<script setup lang="ts">
import { useSidebar } from '@/layouts/composables/useSidebar';
import { useThemeStore } from '@/stores/global/theme';
import { useMenuStore } from '@/stores/global/menu';
import { defaultSidebarConfig, convertMenuItems } from './config';
import type { SidebarMenuItem } from '@/types/menu';
import DesktopSidebar from './DesktopSidebar.vue';
import MobileSidebar from './MobileSidebar.vue';

const router = useRouter();
const themeStore = useThemeStore();
const menuStore = useMenuStore();

/**
 * 是否为桌面端
 */
const isDesktop = useMediaQuery('(min-width: 1024px)');

/**
 * 组件属性
 */
const props = defineProps<{
  /** 是否折叠 */
  collapsed?: boolean;
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  /** 更新折叠状态 */
  (e: 'update:collapsed', value: boolean): void;
  /** 切换折叠 */
  (e: 'toggle-collapse'): void;
}>();

/**
 * 转换后的菜单数据（同步转换）
 */
const sidebarMenus = computed<SidebarMenuItem[]>(() => {
  if (menuStore.menus.length === 0) {
    return [];
  }
  return convertMenuItems(menuStore.menus);
});

/**
 * 动态侧栏配置 - 使用 computed 确保响应式
 */
const dynamicSidebarConfig = computed(() => ({
  ...defaultSidebarConfig,
  menus: sidebarMenus.value,
}));

/**
 * 使用侧栏逻辑
 */
const sidebarState = useSidebar(dynamicSidebarConfig.value);

/**
 * 折叠状态 - 优先使用外部传入的值
 */
const collapsed = computed({
  get: () => props.collapsed ?? sidebarState.collapsed.value,
  set: (value) => {
    sidebarState.collapsed.value = value;
    emit('update:collapsed', value);
  },
});

/**
 * 处理折叠切换
 */
const handleToggleCollapse = (): void => {
  // 切换内部状态
  sidebarState.toggleCollapse();
  // 同步通知父组件（如果使用了 v-model:collapsed）
  emit('update:collapsed', sidebarState.collapsed.value);
  emit('toggle-collapse');
};

const {
  currentSize,
  isDragging,
  expandedKeys,
  setSize,
  startDrag,
  finalizeDrag,
  toggleSubMenu
} = sidebarState;

/**
 * 处理 resize 事件 - 拖拽调整宽度时更新主题配置
 * @param newSize - 新的尺寸（百分比）
 */
const handleResize = (newSize: number): void => {
  // 将百分比转换为像素
  const pxSize = Math.round((newSize / 100) * window.innerWidth);
  // 更新主题配置
  themeStore.updateLayoutConfig({ sidebarWidth: pxSize });
  // 同步更新 sidebar 内部的 size
  setSize(newSize);
};

/**
 * 处理拖拽状态变化
 * @param dragging - 是否正在拖拽
 */
const handleDragging = (dragging: boolean): void => {
  if (dragging) {
    startDrag();
  } else {
    finalizeDrag();
  }
};

/**
 * 处理导航
 * @param path - 导航路径
 */
const handleNavigate = (path: string): void => {
  router.push(path);
};
</script>

<template>
  <div class="h-full flex min-w-0">
    <!-- 桌面端侧栏 - 仅在桌面端渲染 -->
    <DesktopSidebar
      v-if="isDesktop"
      :config="dynamicSidebarConfig"
      :collapsed="collapsed"
      :current-size="currentSize"
      :is-dragging="isDragging"
      :expanded-keys="expandedKeys"
      @resize="handleResize"
      @dragging="handleDragging"
      @toggle-sub-menu="toggleSubMenu"
      @navigate="handleNavigate"
      @toggle-collapse="handleToggleCollapse"
    >
      <slot />
    </DesktopSidebar>

    <!-- 移动端侧栏 - 仅在移动端渲染 -->
    <MobileSidebar
      v-else
      :config="dynamicSidebarConfig"
      :expanded-keys="expandedKeys"
      @toggle-sub-menu="toggleSubMenu"
      @navigate="handleNavigate"
    >
      <slot />
    </MobileSidebar>
  </div>
</template>
