<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-vue-next';
import type { BentoCardProps } from '@/types/bento';

/**
 * HeroCard 组件 - 仪表板主卡片
 * 用于展示核心指标和重要信息，带有渐变背景和动画效果
 */
const props = withDefaults(defineProps<BentoCardProps>(), {
  size: 'xl',
  variant: 'gradient'
});

/**
 * 计算趋势颜色
 */
const trendColor = computed(() => {
  return props.trend?.isPositive ? 'text-emerald-400' : 'text-red-400';
});

/**
 * 计算趋势背景色
 */
const trendBgColor = computed(() => {
  return props.trend?.isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20';
});
</script>

<template>
  <Card
    class="relative overflow-hidden border-0 shadow-lg group"
    :style="{ borderRadius: 'calc(var(--radius))' }"
  >
    <!-- 渐变背景 -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
    
    <!-- 装饰性光晕 -->
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
    <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
    
    <!-- 网格纹理 -->
    <div 
      class="absolute inset-0 opacity-10"
      style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 20px 20px;"
    />
    
    <CardHeader class="relative pb-2">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <!-- 图标容器 -->
          <div class="p-3 bg-white/20 backdrop-blur-sm" :style="{ borderRadius: 'calc(var(--radius) * 0.8)' }">
            <component v-if="icon" :is="icon" class="h-8 w-8 text-white" />
          </div>
          <div>
            <p class="text-white/70 text-sm font-medium">{{ title }}</p>
            <CardTitle class="text-3xl font-bold text-white mt-1">{{ value }}</CardTitle>
          </div>
        </div>
        
        <!-- 趋势徽章 -->
        <div
          v-if="trend"
          :class="['flex items-center gap-1 px-3 py-1.5 backdrop-blur-sm', trendBgColor]"
          :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
        >
          <component :is="trend.isPositive ? TrendingUp : TrendingDown" class="h-4 w-4 text-white" />
          <span class="text-sm font-semibold text-white">{{ Math.abs(trend.value) }}%</span>
        </div>
      </div>
      
      <p v-if="description" class="text-white/80 text-sm mt-3">{{ description }}</p>
    </CardHeader>
    
    <CardContent class="relative space-y-4">
      <!-- 插槽内容 -->
      <slot />
      
      <!-- 操作按钮 -->
      <Button 
        v-if="action" 
        @click="action.onClick" 
        variant="secondary" 
        size="default" 
        class="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm group/btn"
      >
        {{ action.label }}
        <ArrowRight class="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
      </Button>
    </CardContent>
  </Card>
</template>
