<script setup lang="ts">
/**
 * 图标组件
 * @description 基于 lucide-vue-next 的图标组件
 */
import { useIcon } from '@/composables/useIcon';

interface Props {
  /** 图标名称（支持 PascalCase, kebab-case, camelCase） */
  name: string;
  /** 图标大小 */
  size?: number | string;
  /** 图标类名 */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
});

const currentIcon = useIcon(() => props.name);

const iconSize = computed(() => 
  typeof props.size === 'number' ? props.size : parseInt(props.size, 10)
);
</script>

<template>
  <component
    :is="currentIcon"
    v-if="currentIcon"
    :size="iconSize"
    :class="props.class"
  />
  <span v-else class="inline-block" :style="{ width: iconSize + 'px', height: iconSize + 'px' }" />
</template>
