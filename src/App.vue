<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip'
import { onMounted, onUnmounted } from 'vue'
import Sonner from '@/components/ui/sonner/Sonner.vue'
import { setupGlobalErrorHandler } from '@/utils/errorHandler'

/**
 * App 根组件
 * @description 全局配置，只保留基础的 TooltipProvider
 * 具体的 antdv-next 主题配置由各个组件内部管理（TForm、TTable等）
 */

/**
 * 全局错误处理器
 * 捕获未处理的 Promise rejection 和全局错误
 */
onMounted(() => {
  // 设置全局错误处理
  setupGlobalErrorHandler()
})
</script>

<template>
  <TooltipProvider>
    <router-view />
    <Sonner />
  </TooltipProvider>
</template>
