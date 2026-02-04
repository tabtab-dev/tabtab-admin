<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BentoCardProps } from '@/types/bento';

/**
 * FeatureCard 组件 - 功能特性卡片
 * 用于展示指标、功能或次要信息
 */
const props = withDefaults(defineProps<BentoCardProps>(), {
  size: 'md',
  variant: 'default',
  colSpan: 1,
  rowSpan: 1
});

/**
 * 计算卡片样式类名
 */
const cardClasses = computed(() => {
  const variantClasses = {
    default: 'bg-card border-border hover:border-primary/30',
    gradient: 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10',
    outline: 'bg-transparent border-2 border-primary/20 hover:border-primary/40',
    glass: 'bg-card/30 backdrop-blur-sm border-border/30'
  };

  return [
    'transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
    variantClasses[props.variant || 'default']
  ].filter(Boolean).join(' ');
});

/**
 * 计算趋势颜色
 */
const trendColor = computed(() => {
  return props.trend?.isPositive ? 'text-green-500' : 'text-red-500';
});

/**
 * 计算趋势图标
 */
const trendIcon = computed(() => {
  return props.trend?.isPositive ? '↑' : '↓';
});
</script>

<template>
  <Card :class="cardClasses">
    <CardHeader class="pb-2">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2">
          <component v-if="icon" :is="icon" class="h-5 w-5 text-muted-foreground" />
          <CardTitle class="text-base font-semibold">{{ title }}</CardTitle>
        </div>
        <Badge v-if="trend" :variant="trend.isPositive ? 'default' : 'destructive'" class="text-xs">
          {{ trendIcon }} {{ Math.abs(trend.value) }}%
        </Badge>
      </div>
      <CardDescription v-if="description" class="text-xs mt-1">
        {{ description }}
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
      <div v-if="value !== undefined" class="text-2xl font-bold">
        {{ value }}
      </div>
      <slot>
        <p class="text-xs text-muted-foreground">
          展示功能、指标、工作流程或交互演示
        </p>
      </slot>
      <Button v-if="action" @click="action.onClick" variant="outline" size="sm" class="w-full">
        {{ action.label }}
      </Button>
    </CardContent>
  </Card>
</template>
