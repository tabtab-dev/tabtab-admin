<script setup lang="ts">
import ErrorBoundary from './ErrorBoundary.vue';

/**
 * 异步加载骨架屏组件
 */
const PageSkeleton = defineAsyncComponent(() => import('./PageSkeleton.vue'));

/**
 * 组件属性
 */
interface Props {
  /** 刷新 key - 用于触发局部刷新 */
  refreshKey?: number;
  /** 过渡动画名称 */
  transitionName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  refreshKey: 0,
  transitionName: 'fade-slide',
});
</script>

<template>
  <ErrorBoundary>
    <router-view v-slot="{ Component, route }">
      <Transition
        :name="route.meta.transition as string || transitionName"
        mode="out-in"
        appear
      >
        <Suspense>
          <template #default>
            <component
              :is="Component"
              :key="route.path + '-' + refreshKey"
            />
          </template>
          <template #fallback>
            <PageSkeleton />
          </template>
        </Suspense>
      </Transition>
    </router-view>
  </ErrorBoundary>
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
