<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMediaQuery } from '@vueuse/core';
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
}>();

/**
 * 转换后的菜单数据
 */
const sidebarMenus = ref<SidebarMenuItem[]>([]);

/**
 * 是否正在加载图标
 */
const isLoadingIcons = ref(false);

/**
 * 异步转换菜单数据
 */
const loadMenus = async () => {
  if (menuStore.menus.length === 0) {
    sidebarMenus.value = [];
    return;
  }

  isLoadingIcons.value = true;
  try {
    sidebarMenus.value = await convertMenuItems(menuStore.menus);
  } catch (error) {
    console.error('[AppSidebar] Failed to load menus:', error);
  } finally {
    isLoadingIcons.value = false;
  }
};

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
 * 监听菜单变化，更新 sidebar 配置
 */
watch(
  () => menuStore.menus,
  () => {
    loadMenus();
  },
  { deep: true, immediate: true }
);

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
  <div class="h-full flex">
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
