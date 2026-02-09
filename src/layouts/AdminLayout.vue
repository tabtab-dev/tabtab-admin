<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import TabBar from './TabBar.vue';
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue';
import PageContainer from '@/components/layout/PageContainer.vue';
import { useThemeStore } from '@/stores/global/theme';

/**
 * 主题 store
 */
const themeStore = useThemeStore();

/**
 * 侧栏折叠状态 - 使用 computed 实现双向绑定
 * 与 themeStore.layoutConfig.sidebarCollapsed 保持同步
 */
const sidebarCollapsed = computed({
  get: () => themeStore.layoutConfig.sidebarCollapsed,
  set: (value) => themeStore.updateLayoutConfig({ sidebarCollapsed: value })
});

/**
 * 刷新 key - 用于触发局部刷新
 */
const refreshKey = ref(0);

/**
 * 切换侧栏折叠
 */
const toggleSidebarCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

/**
 * 处理标签栏刷新事件 - 局部刷新
 */
const handleTabRefresh = (event: CustomEvent<{ path: string }>) => {
  const { path } = event.detail;
  // 如果刷新的是当前页面，增加 refreshKey 触发组件重新渲染
  if (path === window.location.pathname) {
    refreshKey.value++;
  }
};

onMounted(() => {
  // 监听标签栏刷新事件
  window.addEventListener('tab-refresh', handleTabRefresh as EventListener);
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('tab-refresh', handleTabRefresh as EventListener);
});
</script>

<template>
  <!-- 使用 TailwindCSS 的 grid 布局替代多层 flex 嵌套 -->
  <div class="h-screen bg-background grid grid-rows-[auto_1fr]">
    <!-- 顶部导航栏 -->
    <Header
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-collapse="toggleSidebarCollapse"
    />

    <!-- 主体区域：使用 AppSidebar 内部的 ResizablePanelGroup 处理布局 -->
    <AppSidebar v-model:collapsed="sidebarCollapsed" class="overflow-hidden">
      <!-- 主内容区 -->
      <div class="h-full flex flex-col min-w-0">
        <!-- 标签栏 - 根据主题配置显示/隐藏 -->
        <TabBar
          v-if="themeStore.layoutConfig.showTabBar"
          :class="{ 'sticky top-0 z-10 bg-background': themeStore.layoutConfig.fixedTabBar }"
          class="flex-shrink-0"
        />

        <!-- 页面内容容器 -->
        <div class="flex-1 overflow-auto bg-muted/30 p-6">
          <PageContainer :refresh-key="refreshKey" />
        </div>
      </div>
    </AppSidebar>
  </div>
</template>
