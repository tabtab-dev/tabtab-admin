<script setup lang="ts">
/**
 * MiniChart 组件 - 迷你图表
 * 用于展示趋势数据，支持柱状图和折线图
 */
interface MiniChartProps {
  /** 图表类型 */
  type?: 'bar' | 'line';
  /** 数据数组，值为 0-100 */
  data: number[];
  /** 图表颜色 */
  color?: string;
  /** 是否显示动画 */
  animated?: boolean;
  /** 高度 */
  height?: number;
}

withDefaults(defineProps<MiniChartProps>(), {
  type: 'bar',
  color: 'bg-primary',
  animated: true,
  height: 60
});

/**
 * 生成折线路径
 * @param data - 数据数组
 * @param width - 图表宽度
 * @param height - 图表高度
 * @returns SVG path 路径
 */
function generateLinePath(data: number[], width: number, height: number): string {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  
  return data.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / range) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
}

/**
 * 生成区域填充路径
 * @param data - 数据数组
 * @param width - 图表宽度
 * @param height - 图表高度
 * @returns SVG path 路径
 */
function generateAreaPath(data: number[], width: number, height: number): string {
  const linePath = generateLinePath(data, width, height);
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}
</script>

<template>
  <div class="w-full" :style="{ height: `${height}px` }">
    <!-- 柱状图 -->
    <div v-if="type === 'bar'" class="flex items-end justify-between gap-1 h-full">
      <div
        v-for="(value, index) in data"
        :key="index"
        :class="[color, 'rounded-t transition-all duration-700 ease-out']"
        :style="{
          width: `${100 / data.length}%`,
          height: animated ? '0%' : `${value}%`,
          animationDelay: `${index * 100}ms`
        }"
        class="mini-bar"
      />
    </div>
    
    <!-- 折线图 -->
    <svg
      v-else
      class="w-full h-full overflow-visible"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
    >
      <!-- 渐变定义 -->
      <defs>
        <linearGradient :id="`gradient-${data.join('')}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :class="color.replace('bg-', 'text-')" stop-color="currentColor" stop-opacity="0.3" />
          <stop offset="100%" :class="color.replace('bg-', 'text-')" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>
      
      <!-- 区域填充 -->
      <path
        :d="generateAreaPath(data, 100, 60)"
        :fill="`url(#gradient-${data.join('')})`"
        class="transition-all duration-1000"
      />
      
      <!-- 折线 -->
      <path
        :d="generateLinePath(data, 100, 60)"
        fill="none"
        :class="[color.replace('bg-', 'stroke-'), 'stroke-2']"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-all duration-1000"
      />
      
      <!-- 数据点 -->
      <circle
        v-for="(value, index) in data"
        :key="`point-${index}`"
        :cx="index * (100 / (data.length - 1))"
        :cy="60 - value * 0.6"
        r="2"
        :class="color.replace('bg-', 'fill-')"
        class="transition-all duration-500"
        :style="{ animationDelay: `${index * 100}ms` }"
      />
    </svg>
  </div>
</template>

<style scoped>
.mini-bar {
  animation: growUp 0.7s ease-out forwards;
}

@keyframes growUp {
  from {
    height: 0%;
  }
}
</style>
