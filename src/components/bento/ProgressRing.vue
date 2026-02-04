<script setup lang="ts">
import { computed } from 'vue';

/**
 * ProgressRing 组件 - 环形进度条
 * 用于展示百分比数据，带中心文字显示
 */
interface ProgressRingProps {
  /** 进度值 0-100 */
  progress: number;
  /** 圆环大小 */
  size?: number;
  /** 线条粗细 */
  strokeWidth?: number;
  /** 主颜色类名 */
  color?: string;
  /** 是否显示中心文字 */
  showText?: boolean;
  /** 中心文字 */
  text?: string;
}

const props = withDefaults(defineProps<ProgressRingProps>(), {
  size: 80,
  strokeWidth: 8,
  color: 'text-primary',
  showText: true,
  text: ''
});

/**
 * 计算圆环半径
 */
const radius = computed(() => (props.size - props.strokeWidth) / 2);

/**
 * 计算圆周长
 */
const circumference = computed(() => 2 * Math.PI * radius.value);

/**
 * 计算进度偏移量
 */
const strokeDashoffset = computed(() => {
  const progress = Math.min(Math.max(props.progress, 0), 100);
  return circumference.value - (progress / 100) * circumference.value;
});

/**
 * 计算中心显示文字
 */
const displayText = computed(() => {
  if (props.text) return props.text;
  return `${Math.round(props.progress)}%`;
});
</script>

<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- SVG 圆环 -->
    <svg
      class="transform -rotate-90"
      :width="size"
      :height="size"
    >
      <!-- 背景圆环 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        class="text-muted/20"
        :stroke-width="strokeWidth"
        stroke="currentColor"
      />
      
      <!-- 进度圆环 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :class="color"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        class="transition-all duration-1000 ease-out"
      />
    </svg>
    
    <!-- 中心文字 -->
    <div v-if="showText" class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-lg font-bold">{{ displayText }}</span>
    </div>
  </div>
</template>
