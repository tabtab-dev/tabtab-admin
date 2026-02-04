<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

/**
 * 错误信息接口
 */
interface ErrorInfo {
  /** 错误对象 */
  error: Error;
  /** 错误堆栈 */
  stack?: string;
  /** 组件信息 */
  component?: string;
}

const router = useRouter();

/**
 * 错误状态
 */
const error = ref<ErrorInfo | null>(null);

/**
 * 是否显示详细错误信息（开发模式）
 */
const showDetails = ref(false);

/**
 * 捕获错误
 */
onErrorCaptured((err, instance, info) => {
  error.value = {
    error: err instanceof Error ? err : new Error(String(err)),
    stack: err instanceof Error ? err.stack : undefined,
    component: instance?.$options?.name || info,
  };
  
  // 阻止错误继续传播
  return false;
});

/**
 * 重试
 */
const handleRetry = () => {
  error.value = null;
  window.location.reload();
};

/**
 * 返回首页
 */
const handleGoHome = () => {
  error.value = null;
  router.push('/');
};

/**
 * 是否是开发环境
 */
const isDev = import.meta.env.DEV;
</script>

<template>
  <div class="h-full">
    <!-- 错误状态 -->
    <div
      v-if="error"
      class="h-full flex items-center justify-center p-6"
    >
      <div class="max-w-md w-full text-center space-y-6">
        <!-- 错误图标 -->
        <div class="flex justify-center">
          <div class="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle class="h-10 w-10 text-destructive" />
          </div>
        </div>

        <!-- 错误标题 -->
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-foreground">出错了</h2>
          <p class="text-muted-foreground">
            抱歉，页面加载时发生了错误
          </p>
        </div>

        <!-- 错误信息（仅开发模式） -->
        <div
          v-if="isDev && error"
          class="text-left bg-muted rounded-lg p-4 overflow-auto max-h-48"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-destructive">错误详情</span>
            <Button
              variant="ghost"
              size="sm"
              @click="showDetails = !showDetails"
            >
              {{ showDetails ? '收起' : '展开' }}
            </Button>
          </div>
          <pre v-if="showDetails" class="text-xs text-muted-foreground overflow-auto">{{ error.error.message }}

{{ error.stack }}

Component: {{ error.component }}</pre>
          <p v-else class="text-xs text-muted-foreground truncate">
            {{ error.error.message }}
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            @click="handleGoHome"
          >
            <Home class="h-4 w-4 mr-2" />
            返回首页
          </Button>
          <Button
            @click="handleRetry"
          >
            <RefreshCw class="h-4 w-4 mr-2" />
            重新加载
          </Button>
        </div>
      </div>
    </div>

    <!-- 正常内容 -->
    <slot v-else />
  </div>
</template>
