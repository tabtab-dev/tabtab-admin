<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BentoCardProps } from '@/types/bento';

/**
 * SupportingCard 组件 - 辅助信息卡片
 * 用于展示次要信息、状态、提示等
 */
const props = withDefaults(defineProps<BentoCardProps>(), {
  size: 'sm',
  variant: 'default',
  colSpan: 1,
  rowSpan: 1
});

/**
 * 计算卡片样式类名
 */
const cardClasses = computed(() => {
  const variantClasses = {
    default: 'bg-card border-border hover:border-muted-foreground/30',
    gradient: 'bg-gradient-to-br from-muted/5 to-background border-muted/10',
    outline: 'bg-transparent border border-muted-foreground/20 hover:border-muted-foreground/40',
    glass: 'bg-card/20 backdrop-blur-sm border-border/20'
  };

  return [
    'transition-all duration-300',
    variantClasses[props.variant || 'default']
  ].filter(Boolean).join(' ');
});
</script>

<template>
  <Card :class="cardClasses">
    <CardHeader class="pb-2">
      <div class="flex items-center gap-2">
        <component v-if="icon" :is="icon" class="h-4 w-4 text-muted-foreground" />
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
      </div>
      <CardDescription v-if="description" class="text-xs mt-0.5">
        {{ description }}
      </CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
      <div v-if="value !== undefined" class="text-xl font-semibold">
        {{ value }}
      </div>
      <slot>
        <p class="text-xs text-muted-foreground">
          展示用例、集成、性能或关键亮点
        </p>
      </slot>
    </CardContent>
  </Card>
</template>
