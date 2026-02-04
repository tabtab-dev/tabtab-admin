<script setup lang="ts">
/**
 * 页面骨架屏组件
 * 用于页面加载时显示占位内容
 */
</script>

<template>
  <div class="p-6 space-y-6 animate-pulse">
    <!-- 页面标题区域 -->
    <div class="space-y-3">
      <div class="h-8 w-48 bg-muted rounded"></div>
      <div class="h-4 w-96 bg-muted/50 rounded"></div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="p-4 border rounded-lg space-y-3">
        <div class="flex items-center justify-between">
          <div class="h-4 w-20 bg-muted rounded"></div>
          <div class="h-8 w-8 bg-muted rounded-full"></div>
        </div>
        <div class="h-8 w-24 bg-muted rounded"></div>
        <div class="h-3 w-32 bg-muted/50 rounded"></div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="border rounded-lg p-4 space-y-4">
      <!-- 表格头部 -->
      <div class="flex items-center justify-between pb-4 border-b">
        <div class="h-6 w-32 bg-muted rounded"></div>
        <div class="flex items-center gap-2">
          <div class="h-9 w-32 bg-muted rounded"></div>
          <div class="h-9 w-24 bg-muted rounded"></div>
        </div>
      </div>

      <!-- 表格行 -->
      <div v-for="i in 5" :key="i" class="flex items-center gap-4 py-3">
        <div class="h-4 w-12 bg-muted rounded"></div>
        <div class="h-4 flex-1 bg-muted rounded"></div>
        <div class="h-4 w-32 bg-muted rounded"></div>
        <div class="h-4 w-24 bg-muted rounded"></div>
        <div class="h-4 w-20 bg-muted rounded"></div>
        <div class="h-8 w-20 bg-muted rounded"></div>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between pt-4 border-t">
        <div class="h-4 w-32 bg-muted rounded"></div>
        <div class="flex items-center gap-2">
          <div v-for="i in 5" :key="i" class="h-8 w-8 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>
