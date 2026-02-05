<script setup lang="ts">
import { ref, defineAsyncComponent, watch, onMounted, onUnmounted } from 'vue';
import Header from '@/components/layout/Header.vue';
import TabBar from './TabBar.vue';
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import ErrorBoundary from '@/components/layout/ErrorBoundary.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useThemeStore } from '@/stores/global/theme';

/**
 * 异步加载骨架屏组件
 */
const PageSkeleton = defineAsyncComponent(() => import('@/components/layout/PageSkeleton.vue'));

/**
 * 主题 store
 */
const themeStore = useThemeStore();

/**
 * 侧栏折叠状态 - 从主题配置初始化
 */
const sidebarCollapsed = ref(themeStore.layoutConfig.sidebarCollapsed);

/**
 * 切换侧栏折叠
 */
const toggleSidebarCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  // 同步更新主题配置
  themeStore.updateLayoutConfig({ sidebarCollapsed: sidebarCollapsed.value });
};

/**
 * 监听主题配置中的 sidebarCollapsed 变化，实现实时联动
 */
watch(
  () => themeStore.layoutConfig.sidebarCollapsed,
  (newValue) => {
    if (sidebarCollapsed.value !== newValue) {
      sidebarCollapsed.value = newValue;
    }
  }
);

/**
 * 处理标签栏刷新事件
 */
const handleTabRefresh = (event: CustomEvent<{ path: string }>) => {
  const { path } = event.detail;
  // 如果刷新的是当前页面，则重新加载
  if (path === window.location.pathname) {
    window.location.reload();
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
  <div class="h-screen bg-background flex flex-col">
    <Header
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-collapse="toggleSidebarCollapse"
    />
    <div class="flex-1 overflow-hidden">
      <AppSidebar v-model:collapsed="sidebarCollapsed">
        <ScrollArea class="h-full flex flex-col">
          <!-- 标签栏 - 根据主题配置显示/隐藏 -->
          <TabBar v-if="themeStore.layoutConfig.showTabBar" />
          
          <!-- 页面标题栏 -->
          <PageHeader />

          <!-- 页面内容 -->
          <div class="flex-1 p-6 bg-muted/30">
            <ErrorBoundary>
              <router-view v-slot="{ Component, route }">
                <Transition
                  :name="route.meta.transition as string || 'fade-slide'"
                  mode="out-in"
                  appear
                >
                  <Suspense>
                    <template #default>
                      <component :is="Component" :key="route.path" />
                    </template>
                    <template #fallback>
                      <PageSkeleton />
                    </template>
                  </Suspense>
                </Transition>
              </router-view>
            </ErrorBoundary>
          </div>
        </ScrollArea>
      </AppSidebar>
    </div>
  </div>
</template>

<style scoped>
/* 页面切换动画 - 淡入滑动 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }
  
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
