<script setup lang="ts">
import { computed } from 'vue';

/**
 * 组件属性
 */
interface Props {
  /** 尺寸 */
  size?: number;
  /** 是否折叠状态 */
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 36,
  collapsed: false,
});

/**
 * 实际尺寸
 */
const actualSize = computed(() => {
  return props.collapsed ? props.size * 0.9 : props.size;
});
</script>

<template>
  <svg
    :width="actualSize"
    :height="actualSize"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    class="logo-svg"
    :class="{ 'logo-collapsed': collapsed }"
  >
    <defs>
      <!-- 主渐变 - 使用当前主题主色 -->
      <linearGradient id="logo-gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" class="logo-gradient-stop-1" />
        <stop offset="100%" class="logo-gradient-stop-2" />
      </linearGradient>
      <!-- 次渐变 - 更深的颜色 -->
      <linearGradient id="logo-gradient-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" class="logo-gradient-stop-3" />
        <stop offset="100%" class="logo-gradient-stop-4" />
      </linearGradient>
      <!-- 阴影滤镜 -->
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
      </filter>
    </defs>

    <!-- 背景圆角矩形 -->
    <rect x="20" y="20" width="160" height="160" rx="40" fill="url(#logo-gradient-main)" />

    <!-- 第一个 T - 主白色，带阴影 -->
    <g transform="translate(50, 65)" filter="url(#shadow)">
      <!-- 横线 - 更粗 -->
      <rect x="0" y="0" width="70" height="14" rx="7" fill="white" />
      <!-- 竖线 - 更粗 -->
      <rect x="28" y="0" width="14" height="70" rx="7" fill="white" />
    </g>

    <!-- 第二个 T - 深色/黑色，更清晰 -->
    <g transform="translate(80, 55)" filter="url(#shadow)">
      <!-- 横线 - 深色 -->
      <rect x="0" y="0" width="70" height="14" rx="7" fill="#1a1a2e" />
      <!-- 竖线 - 深色 -->
      <rect x="28" y="0" width="14" height="70" rx="7" fill="#1a1a2e" />
    </g>
  </svg>
</template>

<style scoped>
.logo-svg {
  transition: all 0.3s ease;
}

.logo-collapsed {
  transform: scale(0.9);
}

/* 使用 CSS 变量控制渐变色 */
.logo-gradient-stop-1 {
  stop-color: var(--primary);
  stop-opacity: 1;
}

.logo-gradient-stop-2 {
  stop-color: var(--primary);
  stop-opacity: 0.8;
}

.logo-gradient-stop-3 {
  stop-color: var(--primary);
  stop-opacity: 0.6;
}

.logo-gradient-stop-4 {
  stop-color: var(--primary);
  stop-opacity: 0.4;
}
</style>
