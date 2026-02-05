<script setup lang="ts">
import { computed } from 'vue';

/**
 * MasonryGrid Props 接口定义
 * @property columns - 列数配置，支持响应式断点
 * @property gap - 卡片间距，可选 sm/md/lg
 * @property className - 自定义类名
 */
interface MasonryGridProps {
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const props = withDefaults(defineProps<MasonryGridProps>(), {
  columns: () => ({
    default: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  }),
  gap: 'md',
  className: ''
});

/**
 * 计算间距类名
 * @returns 对应的 gap CSS 类
 */
const gapClasses = computed(() => {
  const gaps = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };
  return gaps[props.gap];
});

/**
 * 计算 CSS columns 样式
 * 使用 CSS columns 实现瀑布流布局
 * @returns CSS 样式对象
 */
const columnStyles = computed(() => {
  const cols = props.columns;
  return {
    '--masonry-cols-default': cols.default || 1,
    '--masonry-cols-sm': cols.sm || cols.default || 1,
    '--masonry-cols-md': cols.md || cols.sm || cols.default || 1,
    '--masonry-cols-lg': cols.lg || cols.md || cols.sm || cols.default || 1,
    '--masonry-cols-xl': cols.xl || cols.lg || cols.md || cols.sm || cols.default || 1
  };
});
</script>

<template>
  <div 
    class="masonry-grid" 
    :class="[gapClasses, className]"
    :style="columnStyles"
  >
    <slot />
  </div>
</template>

<style scoped>
/**
 * 瀑布流布局样式
 * 使用 CSS columns 实现，配合 break-inside 防止卡片被截断
 */
.masonry-grid {
  column-count: var(--masonry-cols-default);
  column-gap: inherit;
}

/* 响应式断点 */
@media (min-width: 640px) {
  .masonry-grid {
    column-count: var(--masonry-cols-sm);
  }
}

@media (min-width: 768px) {
  .masonry-grid {
    column-count: var(--masonry-cols-md);
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    column-count: var(--masonry-cols-lg);
  }
}

@media (min-width: 1280px) {
  .masonry-grid {
    column-count: var(--masonry-cols-xl);
  }
}

/* 子元素样式 - 防止被截断并添加底部间距 */
.masonry-grid > * {
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: var(--masonry-gap, 1rem);
}

/* 最后一个元素移除底部间距 */
.masonry-grid > *:last-child {
  margin-bottom: 0;
}
</style>
