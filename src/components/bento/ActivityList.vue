<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ActivityItem } from '@/types/bento';

/**
 * ActivityList Props 接口
 * @property title - 列表标题
 * @property items - 活动项列表
 * @property maxItems - 最大显示数量，默认5
 */
interface ActivityListProps {
  title?: string;
  items: ActivityItem[];
  maxItems?: number;
}

withDefaults(defineProps<ActivityListProps>(), {
  title: '最近活动',
  maxItems: 5
});

/**
 * 活动类型对应的颜色样式
 */
const typeColors = {
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
};

/**
 * 活动类型对应的图标
 */
const typeIcons = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ'
};
</script>

<template>
  <Card>
    <CardHeader class="pb-2">
      <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="pt-0">
      <div class="space-y-2">
        <div
          v-for="item in items.slice(0, maxItems)"
          :key="item.id"
          class="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Badge :class="['flex-shrink-0 text-xs', typeColors[item.type]]" variant="outline">
            {{ typeIcons[item.type] }}
          </Badge>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ item.title }}</p>
            <p v-if="item.description" class="text-xs text-muted-foreground mt-0.5 truncate">
              {{ item.description }}
            </p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ item.time }}</p>
          </div>
        </div>
        <div v-if="items.length === 0" class="text-center py-4 text-sm text-muted-foreground">
          暂无活动记录
        </div>
      </div>
    </CardContent>
  </Card>
</template>
