<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { QuickAction } from '@/types/bento';

/**
 * QuickActions Props 接口
 * @property title - 标题
 * @property actions - 快捷操作列表
 */
interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];
}

withDefaults(defineProps<QuickActionsProps>(), {
  title: '快捷操作'
});

/**
 * 操作按钮样式配置
 */
const actionStyles = {
  primary: {
    bg: 'bg-primary hover:bg-primary/90',
    text: 'text-primary-foreground',
    shadow: 'shadow-primary/25'
  },
  default: {
    bg: 'bg-muted hover:bg-muted/80',
    text: 'text-muted-foreground hover:text-foreground',
    shadow: ''
  },
  danger: {
    bg: 'bg-red-500 hover:bg-red-600',
    text: 'text-white',
    shadow: 'shadow-red-500/25'
  }
};
</script>

<template>
  <Card class="border-0 shadow-sm">
    <CardHeader class="pb-3">
      <CardTitle class="text-base font-semibold">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="pt-0">
      <div class="grid grid-cols-2 gap-3">
        <Button
          v-for="(action, index) in actions"
          :key="action.id"
          @click="action.onClick"
          :class="[
            'h-auto py-4 px-3 flex flex-col items-center gap-2 rounded-xl transition-all duration-200 border-0',
            actionStyles[action.variant || 'default'].bg,
            actionStyles[action.variant || 'default'].text,
            actionStyles[action.variant || 'default'].shadow,
            'hover:shadow-lg hover:-translate-y-0.5'
          ]"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div 
            v-if="action.icon" 
            :class="[
              'p-2 rounded-lg',
              action.variant === 'primary' ? 'bg-white/20' : 'bg-background/50'
            ]"
          >
            <component :is="action.icon" class="h-5 w-5" />
          </div>
          <span class="text-sm font-medium">{{ action.label }}</span>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
