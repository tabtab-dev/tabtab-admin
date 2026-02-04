<script setup lang="ts">
import { computed } from 'vue';
import type { BentoGridProps } from '@/types/bento';

const props = withDefaults(defineProps<BentoGridProps>(), {
  columns: 3,
  gap: 'md',
  className: ''
});

const gridClasses = computed(() => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return [
    'grid',
    columnClasses[props.columns],
    gapClasses[props.gap],
    props.className
  ].filter(Boolean).join(' ');
});
</script>

<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>
