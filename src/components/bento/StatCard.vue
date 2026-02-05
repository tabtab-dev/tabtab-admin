<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';
import MiniChart from './MiniChart.vue';

/**
 * StatCard 组件 - 统计指标卡片
 * 带有彩色图标、趋势指示器和迷你图表
 */
interface StatCardProps {
  /** 标题 */
  title: string;
  /** 数值 */
  value: string | number;
  /** 描述 */
  description?: string;
  /** 图标组件 */
  icon: any;
  /** 图标颜色主题 */
  colorTheme?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'cyan';
  /** 趋势值 */
  trend?: number;
  /** 图表数据 */
  chartData?: number[];
}

const props = withDefaults(defineProps<StatCardProps>(), {
  colorTheme: 'blue',
  trend: 0
});

/**
 * 色彩主题配置
 */
const colorThemes = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
    border: 'border-blue-500/20',
    chart: 'bg-blue-500',
    gradient: 'from-blue-500/5 to-transparent'
  },
  green: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-500/20',
    chart: 'bg-emerald-500',
    gradient: 'from-emerald-500/5 to-transparent'
  },
  orange: {
    bg: 'bg-orange-500/10',
    icon: 'text-orange-500',
    border: 'border-orange-500/20',
    chart: 'bg-orange-500',
    gradient: 'from-orange-500/5 to-transparent'
  },
  purple: {
    bg: 'bg-violet-500/10',
    icon: 'text-violet-500',
    border: 'border-violet-500/20',
    chart: 'bg-violet-500',
    gradient: 'from-violet-500/5 to-transparent'
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-500',
    border: 'border-red-500/20',
    chart: 'bg-red-500',
    gradient: 'from-red-500/5 to-transparent'
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    icon: 'text-cyan-500',
    border: 'border-cyan-500/20',
    chart: 'bg-cyan-500',
    gradient: 'from-cyan-500/5 to-transparent'
  }
};

/**
 * 当前主题
 */
const theme = computed(() => colorThemes[props.colorTheme]);

/**
 * 趋势是否正向
 */
const isPositive = computed(() => props.trend >= 0);
</script>

<template>
  <Card
    class="group relative overflow-hidden border border-border/40 shadow-sm transition-all duration-300 hover:-translate-y-1 rounded-xl"
  >
    <!-- 背景渐变 -->
    <div 
      :class="['absolute inset-0 bg-gradient-to-br opacity-50', theme.gradient]"
    />
    
    <CardContent class="relative p-5">
      <div class="flex items-start justify-between">
        <!-- 左侧内容 -->
        <div class="flex-1 min-w-0">
          <!-- 图标和标题 -->
          <div class="flex items-center gap-2 mb-3">
            <div :class="['p-2 rounded-lg', theme.bg]">
              <component :is="icon" :class="['h-4 w-4', theme.icon]" />
            </div>
            <span class="text-sm font-medium text-muted-foreground">{{ title }}</span>
          </div>
          
          <!-- 数值 -->
          <div class="text-2xl font-bold tracking-tight mb-1">
            {{ value }}
          </div>
          
          <!-- 描述 -->
          <p v-if="description" class="text-xs text-muted-foreground truncate">
            {{ description }}
          </p>
          
          <!-- 趋势 -->
          <div v-if="trend !== 0" class="flex items-center gap-1 mt-2">
            <component
              :is="isPositive ? ArrowUpRight : ArrowDownRight"
              :class="['h-3 w-3', isPositive ? 'text-emerald-500' : 'text-red-500']"
            />
            <span :class="['text-xs font-medium', isPositive ? 'text-emerald-500' : 'text-red-500']">
              {{ Math.abs(trend) }}%
            </span>
            <span class="text-xs text-muted-foreground">vs 上月</span>
          </div>
        </div>
        
        <!-- 右侧图表 -->
        <div v-if="chartData && chartData.length > 0" class="w-20 ml-3">
          <MiniChart :data="chartData" :color="theme.chart" :height="50" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
