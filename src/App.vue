<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip'
import { toast } from 'vue-sonner'
import { onMounted, onUnmounted } from 'vue'
import Sonner from '@/components/ui/sonner/Sonner.vue'

/**
 * App 根组件
 * @description 全局配置，只保留基础的 TooltipProvider
 * 具体的 antdv-next 主题配置由各个组件内部管理（TForm、TTable等）
 */

/**
 * 全局错误处理器
 * 捕获未处理的 Promise rejection 和全局错误
 */
function handleUnhandledRejection(event: PromiseRejectionEvent) {
  console.error('Unhandled Promise Rejection:', event.reason)
  const message = event.reason?.message || String(event.reason)
  toast.error(message || '操作失败，请重试')
  event.preventDefault()
}

function handleError(event: ErrorEvent) {
  console.error('Global Error:', event.error)
  const message = event.error?.message || '发生未知错误'
  toast.error(message || '操作失败，请重试')
  event.preventDefault()
}

onMounted(() => {
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  window.addEventListener('error', handleError)
})

onUnmounted(() => {
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  window.removeEventListener('error', handleError)
})
</script>

<template>
  <TooltipProvider>
    <router-view />
    <Sonner />
  </TooltipProvider>
</template>
