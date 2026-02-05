<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ActivityItem } from '@/types/bento';

/**
 * ActivityCard Props 接口
 * @property title - 卡片标题
 * @property items - 活动项列表
 * @property maxItems - 最大显示数量，默认 6
 */
interface ActivityCardProps {
  title?: string;
  items: ActivityItem[];
  maxItems?: number;
}

withDefaults(defineProps<ActivityCardProps>(), {
  title: '最近活动',
  maxItems: 6
});

/**
 * 活动类型对应的样式配置
 */
const typeStyles = {
  success: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  warning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500'
  },
  error: {
    bg: 'bg-red-500/10',
    text: 'text-red-600',
    border: 'border-red-500/20',
    dot: 'bg-red-500'
  },
  info: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500'
  }
};
</script>

<template>
  <Card
    class="border border-border/40 shadow-sm rounded-xl"
  >
    <CardHeader class="pb-3">
      <CardTitle class="text-base font-semibold">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="pt-0">
      <ScrollArea class="h-[280px] pr-4">
        <div class="space-y-3">
          <div
            v-for="(item, index) in items.slice(0, maxItems)"
            :key="item.id"
            class="group flex items-start gap-3 p-3 transition-all duration-200 hover:bg-muted/50 cursor-pointer rounded-lg"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <!-- 状态指示点 -->
            <div :class="['w-2 h-2 mt-2 rounded-full flex-shrink-0', typeStyles[item.type].dot]" />
            
            <!-- 内容区域 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {{ item.title }}
                </p>
                <Badge 
                  :class="['text-xs flex-shrink-0', typeStyles[item.type].bg, typeStyles[item.type].text, typeStyles[item.type].border]" 
                  variant="outline"
                >
                  {{ item.type === 'success' ? '成功' : item.type === 'warning' ? '警告' : item.type === 'error' ? '错误' : '信息' }}
                </Badge>
              </div>
              <p v-if="item.description" class="text-xs text-muted-foreground mt-1 truncate">
                {{ item.description }}
              </p>
              <p class="text-xs text-muted-foreground/70 mt-1.5">{{ item.time }}</p>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div class="w-12 h-12 bg-muted/50 flex items-center justify-center mb-3 rounded-lg">
              <svg class="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm">暂无活动记录</p>
          </div>
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>
