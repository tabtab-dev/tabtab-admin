<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 当前路由
 */
const route = useRoute();

/**
 * 页面标题 - 从路由元数据获取
 */
const pageTitle = computed(() => {
  const title = route.meta?.title as string | undefined;
  return title || '';
});
</script>

<template>
  <div v-if="pageTitle" class="px-6 py-3 border-b border-border/30 bg-muted/30 backdrop-blur-sm">
    <h1 class="text-lg font-semibold text-foreground">
      {{ pageTitle }}
    </h1>
  </div>
</template>
