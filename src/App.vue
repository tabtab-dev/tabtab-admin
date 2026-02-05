<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip'

/**
 * App 根组件
 * @description 全局配置，只保留基础的 TooltipProvider
 * 具体的 antdv-next 主题配置由各个组件内部管理（TForm、TTable等）
 */
</script>

<template>
  <TooltipProvider>
    <router-view />
  </TooltipProvider>
</template>
