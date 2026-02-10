<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/global/theme';

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

const themeStore = useThemeStore();

/**
 * 实际尺寸 - 确保为整数像素
 */
const actualSize = computed(() => {
  // 折叠状态下与菜单按钮大小保持一致 (48px)
  return props.collapsed ? 48 : props.size;
});

/**
 * 计算圆角半径 - 与主题设置保持一致
 * 将主题的 rem 半径转换为 SVG viewBox 坐标系中的值
 * 主题 radius 范围 0-1.5rem，对应 SVG rx 范围 0-60 (相对于 200x200 viewBox)
 */
const borderRadius = computed(() => {
  const maxRadius = 60; // 对应 1.5rem 的最大圆角
  const themeRadius = themeStore.layoutConfig.radius;
  // 按比例计算，最大 1.5rem 对应 60px 圆角
  return Math.round((themeRadius / 1.5) * maxRadius);
});
</script>

<template>
  <div
    class="logo-container"
    :style="{ width: actualSize + 'px', height: actualSize + 'px' }"
  >
    <svg
      :width="actualSize"
      :height="actualSize"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      class="logo-svg"
      :class="{ 'logo-collapsed': collapsed }"
      shape-rendering="geometricPrecision"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <!-- 主渐变 - 使用当前主题主色 -->
        <linearGradient id="logo-gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" class="logo-gradient-stop-1" />
          <stop offset="100%" class="logo-gradient-stop-2" />
        </linearGradient>
      </defs>

      <!-- 背景圆角矩形 - 使用主题设置的圆角 -->
      <rect
        x="20"
        y="20"
        width="160"
        height="160"
        :rx="borderRadius"
        fill="url(#logo-gradient-main)"
        shape-rendering="geometricPrecision"
      />

      <!-- 第一个 T - 主白色 -->
      <g transform="translate(50, 65)">
        <!-- 横线 -->
        <rect x="0" y="0" width="70" height="14" rx="7" fill="white" shape-rendering="geometricPrecision" />
        <!-- 竖线 -->
        <rect x="28" y="0" width="14" height="70" rx="7" fill="white" shape-rendering="geometricPrecision" />
      </g>

      <!-- 第二个 T - 深色 -->
      <g transform="translate(80, 55)">
        <!-- 横线 -->
        <rect x="0" y="0" width="70" height="14" rx="7" fill="#1a1a2e" shape-rendering="geometricPrecision" />
        <!-- 竖线 -->
        <rect x="28" y="0" width="14" height="70" rx="7" fill="#1a1a2e" shape-rendering="geometricPrecision" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.logo-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 使用 CSS 阴影代替 SVG 滤镜，更清晰 */
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
  /* 强制 GPU 渲染 */
  transform: translateZ(0);
  /* 防止亚像素渲染问题 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.logo-svg {
  display: block;
  /* 确保 SVG 本身也有硬件加速 */
  transform: translateZ(0);
}

.logo-collapsed {
  /* 折叠状态下保持与菜单按钮一致的大小 */
}

/* 使用 CSS 变量控制渐变色 */
.logo-gradient-stop-1 {
  stop-color: var(--primary);
  stop-opacity: 1;
}

.logo-gradient-stop-2 {
  stop-color: var(--primary);
  stop-opacity: 0.85;
}
</style>
