<script setup lang="ts">
/**
 * TEmptyState - 空状态组件
 *
 * @description 统一的空状态展示组件，支持多种预设类型
 * @example
 * 基础用法：
 *   <TEmptyState title="暂无数据" description="开始添加您的第一条数据吧" />
 *
 * 搜索为空：
 *   <TEmptyState type="search" title="未找到相关结果" />
 *
 * 带操作按钮：
 *   <TEmptyState
 *     title="暂无数据"
 *     description="点击下方按钮添加数据"
 *     :action="{ text: '添加数据', type: 'primary', iconName: 'Plus', onClick: handleAdd }"
 *   />
 */
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Inbox,
  Search,
  Database,
  AlertCircle,
  WifiOff,
  Lock,
  Plus
} from 'lucide-vue-next'
import * as icons from 'lucide-vue-next'
import type { TEmptyStateProps, TEmptyStateEmits, TEmptyStateExpose, EmptyType, EmptyAction } from './types'

/**
 * 组件选项
 */
defineOptions({
  name: 'TEmptyState'
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TEmptyStateProps>(), {
  type: 'default',
  size: 'default',
  bordered: false,
  showBackground: true
})

/**
 * Emits 定义
 */
const emit = defineEmits<TEmptyStateEmits>()

/**
 * 预设类型配置
 */
const typeConfig: Record<EmptyType, { icon: typeof Inbox; title: string; description: string }> = {
  default: {
    icon: Inbox,
    title: '暂无数据',
    description: '暂无相关数据'
  },
  search: {
    icon: Search,
    title: '未找到结果',
    description: '请尝试调整搜索条件'
  },
  data: {
    icon: Database,
    title: '暂无数据',
    description: '开始添加您的第一条数据吧'
  },
  error: {
    icon: AlertCircle,
    title: '出错了',
    description: '加载数据时发生错误，请稍后重试'
  },
  network: {
    icon: WifiOff,
    title: '网络异常',
    description: '请检查网络连接后重试'
  },
  permission: {
    icon: Lock,
    title: '无权限',
    description: '您没有权限访问此内容'
  }
}

/**
 * 尺寸配置
 */
const sizeConfig = {
  sm: {
    wrapper: 'py-8',
    icon: 'w-10 h-10',
    iconWrapper: 'w-16 h-16',
    title: 'text-base',
    description: 'text-xs'
  },
  default: {
    wrapper: 'py-12',
    icon: 'w-12 h-12',
    iconWrapper: 'w-20 h-20',
    title: 'text-lg',
    description: 'text-sm'
  },
  lg: {
    wrapper: 'py-16',
    icon: 'w-16 h-16',
    iconWrapper: 'w-24 h-24',
    title: 'text-xl',
    description: 'text-base'
  }
}

/**
 * 当前类型配置
 */
const currentTypeConfig = computed(() => typeConfig[props.type])

/**
 * 当前尺寸配置
 */
const currentSizeConfig = computed(() => sizeConfig[props.size])

/**
 * 图标组件
 */
const IconComponent = computed(() => {
  if (props.icon) return props.icon
  if (props.iconName) {
    return (icons as Record<string, unknown>)[props.iconName] as typeof Inbox | null
  }
  return currentTypeConfig.value.icon
})

/**
 * 标题文本
 */
const titleText = computed(() => props.title || currentTypeConfig.value.title)

/**
 * 描述文本
 */
const descriptionText = computed(() => props.description || currentTypeConfig.value.description)

/**
 * 获取按钮变体
 */
function getButtonVariant(type: EmptyAction['type']) {
  switch (type) {
    case 'primary':
      return 'default'
    case 'ghost':
      return 'ghost'
    case 'link':
      return 'link'
    default:
      return 'outline'
  }
}

/**
 * 获取操作图标
 */
function getActionIcon(action: EmptyAction) {
  if (action.icon) return action.icon
  if (action.iconName) {
    return (icons as Record<string, unknown>)[action.iconName] as typeof Plus | null
  }
  return null
}

/**
 * 处理操作点击
 */
function handleActionClick() {
  if (props.action?.onClick) {
    props.action.onClick()
  }
  emit('actionClick')
}

/**
 * 触发操作
 */
function triggerAction() {
  handleActionClick()
}

/**
 * 暴露方法
 */
defineExpose<TEmptyStateExpose>({
  triggerAction
})
</script>

<template>
  <div
    :class="cn(
      't-empty-state flex flex-col items-center justify-center text-center',
      currentSizeConfig.wrapper,
      bordered && 'border rounded-lg',
      showBackground && 'bg-muted/30',
      className
    )"
  >
    <!-- 图标 -->
    <div
      :class="cn(
        'flex items-center justify-center rounded-full bg-muted mb-4',
        currentSizeConfig.iconWrapper
      )"
    >
      <component
        :is="IconComponent"
        :class="cn('text-muted-foreground/60', currentSizeConfig.icon)"
      />
    </div>

    <!-- 标题 -->
    <h3
      :class="cn(
        'font-semibold text-foreground mb-1',
        currentSizeConfig.title
      )"
    >
      {{ titleText }}
    </h3>

    <!-- 描述 -->
    <p
      :class="cn(
        'text-muted-foreground max-w-sm',
        currentSizeConfig.description
      )"
    >
      {{ descriptionText }}
    </p>

    <!-- 操作按钮 -->
    <div v-if="action" class="mt-4">
      <Button
        :variant="getButtonVariant(action.type)"
        @click="handleActionClick"
      >
        <component
          :is="getActionIcon(action)"
          v-if="getActionIcon(action)"
          class="w-4 h-4 mr-1.5"
        />
        {{ action.text }}
      </Button>
    </div>

    <!-- 自定义内容插槽 -->
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.t-empty-state {
  /* 平滑过渡 */
  transition: all 0.2s ease;
}
</style>
