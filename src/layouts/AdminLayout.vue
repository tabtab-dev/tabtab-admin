<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import TabBar from './TabBar.vue';
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue';
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
                      <component :is="Component" :key="route.path + '-' + refreshKey" />
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
