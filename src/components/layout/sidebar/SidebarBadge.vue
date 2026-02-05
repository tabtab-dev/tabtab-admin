<script setup lang="ts">
/**
 * 组件属性
 */
interface Props {
  /** 徽标数量 */
  count?: number;
  /** 显示模式 */
  mode?: 'compact' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'full',
});

/**
 * 格式化徽标数字
 * @param num 数字
 * @returns 格式化后的字符串
 */
const formatBadge = (num: number): string => {
  return num > 99 ? '99+' : String(num);
};
</script>

<template>
  <!-- 紧凑模式：用于折叠状态或图标右上角 -->
  <span
    v-if="mode === 'compact' && count"
    class="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] font-medium flex items-center justify-center rounded-full bg-destructive text-destructive-foreground"
  >
    {{ formatBadge(count) }}
  </span>

  <!-- 完整模式：用于展开状态的 Badge 组件 -->
  <Badge
    v-else-if="mode === 'full' && count"
    variant="destructive"
    class="h-5 px-1.5 text-xs"
  >
    {{ formatBadge(count) }}
  </Badge>
</template>
