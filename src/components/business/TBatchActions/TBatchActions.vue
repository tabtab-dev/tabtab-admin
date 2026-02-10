<script setup lang="ts">
/**
 * TBatchActions - 批量操作栏组件
 *
 * @description 表格/列表批量操作栏，显示选中数量和操作按钮
 * @example
 * 基础用法：
 *   <TBatchActions
 *     :count="selectedCount"
 *     :actions="[
 *       { text: '批量删除', type: 'danger', onClick: handleBatchDelete },
 *       { text: '批量导出', onClick: handleBatchExport }
 *     ]"
 *     @clear="clearSelection"
 *   />
 *
 * 带确认：
 *   <TBatchActions
 *     :count="selectedCount"
 *     :actions="[
 *       {
 *         text: '批量删除',
 *         type: 'danger',
 *         confirm: true,
 *         confirmText: '确定要删除选中的数据吗？',
 *         onClick: handleBatchDelete
 *       }
 *     ]"
 *   />
 */
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, AlertCircle } from 'lucide-vue-next'
import * as icons from 'lucide-vue-next'
import { TModal } from '@/components/business/TModal'
import type { TBatchActionsProps, TBatchActionsEmits, TBatchActionsExpose, BatchAction } from './types'

/**
 * 组件选项
 */
defineOptions({
  name: 'TBatchActions'
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TBatchActionsProps>(), {
  itemName: '项',
  showClear: true,
  clearText: '清除选择',
  sticky: false,
  stickyOffset: 0
})

/**
 * Emits 定义
 */
const emit = defineEmits<TBatchActionsEmits>()

/**
 * 确认弹窗状态
 */
const confirmModalOpen = ref(false)
const pendingAction = ref<BatchAction | null>(null)

/**
 * 过滤后的操作按钮
 */
const visibleActions = computed(() => {
  return (props.actions || []).filter(action => {
    if (typeof action.show === 'function') {
      return action.show()
    }
    return action.show !== false
  })
})

/**
 * 是否显示操作栏
 */
const isVisible = computed(() => props.count > 0)

/**
 * 选中数量文本
 */
const countText = computed(() => {
  if (props.total !== undefined) {
    return `已选 ${props.count} / 共 ${props.total} ${props.itemName}`
  }
  return `已选 ${props.count} ${props.itemName}`
})

/**
 * 获取按钮变体
 */
function getButtonVariant(type: BatchAction['type']) {
  switch (type) {
    case 'primary':
      return 'default'
    case 'danger':
      return 'destructive'
    case 'ghost':
      return 'ghost'
    default:
      return 'outline'
  }
}

/**
 * 检查按钮是否禁用
 */
function isButtonDisabled(action: BatchAction) {
  if (typeof action.disabled === 'function') {
    return action.disabled()
  }
  return action.disabled === true
}

/**
 * 获取图标组件
 */
function getIconComponent(action: BatchAction) {
  if (action.icon) return action.icon
  if (action.iconName) {
    return (icons as Record<string, unknown>)[action.iconName] as typeof X | null
  }
  return null
}

/**
 * 处理操作点击
 */
function handleActionClick(action: BatchAction) {
  if (action.confirm) {
    pendingAction.value = action
    confirmModalOpen.value = true
  } else {
    action.onClick()
    emit('actionClick', action)
  }
}

/**
 * 处理确认操作
 */
function handleConfirm() {
  if (pendingAction.value) {
    pendingAction.value.onClick()
    emit('actionClick', pendingAction.value)
    pendingAction.value = null
  }
  confirmModalOpen.value = false
}

/**
 * 处理清除
 */
function handleClear() {
  emit('clear')
}

/**
 * 获取选中数量
 */
function getCount() {
  return props.count
}

/**
 * 触发清除
 */
function clearSelection() {
  handleClear()
}

/**
 * 暴露方法
 */
defineExpose<TBatchActionsExpose>({
  getCount,
  clearSelection
})
</script>

<template>
  <div
    v-if="isVisible"
    :class="cn(
      't-batch-actions flex items-center justify-between gap-4 px-3 py-2 rounded-lg border bg-card',
      sticky && 'sticky z-20',
      className
    )"
    :style="sticky ? { top: `${stickyOffset}px` } : undefined"
  >
    <!-- 左侧：选中数量 -->
    <div class="flex items-center gap-2">
      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">
        {{ count }}
      </span>
      <span class="text-sm text-muted-foreground">
        {{ countText }}
      </span>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="flex items-center gap-2">
      <!-- 操作按钮 -->
      <Button
        v-for="(action, index) in visibleActions"
        :key="index"
        :variant="getButtonVariant(action.type)"
        :disabled="isButtonDisabled(action)"
        size="sm"
        :class="cn('gap-1.5', action.className)"
        @click="handleActionClick(action)"
      >
        <component
          :is="getIconComponent(action)"
          v-if="getIconComponent(action)"
          class="w-3.5 h-3.5"
        />
        {{ action.text }}
      </Button>

      <!-- 分隔线 -->
      <div v-if="visibleActions.length > 0 && showClear" class="w-px h-4 bg-border mx-0.5" />

      <!-- 清除按钮 -->
      <Button
        v-if="showClear"
        variant="ghost"
        size="sm"
        class="gap-1.5 text-muted-foreground hover:text-foreground"
        @click="handleClear"
      >
        <X class="w-3.5 h-3.5" />
        {{ clearText }}
      </Button>
    </div>
  </div>

  <!-- 确认弹窗 - 移到外层避免影响布局 -->
  <TModal
    v-model:open="confirmModalOpen"
    :title="pendingAction?.confirmTitle || '确认操作'"
    width="400"
    @ok="handleConfirm"
  >
    <div class="flex items-center gap-3 py-2">
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 shrink-0">
        <AlertCircle class="w-5 h-5 text-destructive" />
      </div>
      <div class="flex-1">
        <p class="text-sm text-muted-foreground">
          {{ pendingAction?.confirmText || '确定要执行此操作吗？' }}
        </p>
      </div>
    </div>
  </TModal>
</template>

<style scoped>
.t-batch-actions {
  /* 动画效果 */
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
