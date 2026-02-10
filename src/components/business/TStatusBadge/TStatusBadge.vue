<script setup lang="ts">
/**
 * TStatusBadge - 状态徽章组件
 *
 * @description 统一的状态展示组件，支持多种颜色、变体和尺寸
 * @example
 * 基础用法：
 *   <TStatusBadge status="active" />
 *
 * 自定义映射：
 *   <TStatusBadge
 *     :status="user.status"
 *     :status-map="{
 *       active: { text: '启用', color: 'success' },
 *       inactive: { text: '禁用', color: 'default' }
 *     }"
 *   />
 *
 * 带圆点：
 *   <TStatusBadge status="processing" show-dot />
 */
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { getVariantConfig, getSizeConfig, statusColorConfig } from './theme'
import type { TStatusBadgeProps, TStatusBadgeEmits, TStatusBadgeExpose, StatusType, StatusConfig } from './types'

/**
 * 组件选项
 */
defineOptions({
  name: 'TStatusBadge'
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TStatusBadgeProps>(), {
  size: 'default',
  variant: 'soft',
  showDot: false,
  clickable: false
})

/**
 * Emits 定义
 */
const emit = defineEmits<TStatusBadgeEmits>()

/**
 * 默认状态映射
 */
const defaultStatusMap: Record<string, StatusConfig> = {
  // 布尔值
  true: { text: '是', color: 'success' },
  false: { text: '否', color: 'default' },
  // 常见状态
  active: { text: '启用', color: 'success' },
  inactive: { text: '禁用', color: 'default' },
  enabled: { text: '启用', color: 'success' },
  disabled: { text: '禁用', color: 'default' },
  // 通用状态
  success: { text: '成功', color: 'success' },
  error: { text: '失败', color: 'error' },
  warning: { text: '警告', color: 'warning' },
  info: { text: '信息', color: 'info' },
  // 处理状态
  processing: { text: '处理中', color: 'processing' },
  pending: { text: '待处理', color: 'pending' },
  completed: { text: '已完成', color: 'success' },
  // 用户状态
  online: { text: '在线', color: 'success' },
  offline: { text: '离线', color: 'default' },
  busy: { text: '忙碌', color: 'warning' },
  away: { text: '离开', color: 'pending' },
  // 审核状态
  approved: { text: '已通过', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' },
  reviewing: { text: '审核中', color: 'processing' }
}

/**
 * 状态值转为字符串键
 */
const statusKey = computed(() => {
  const status = props.status
  if (typeof status === 'boolean') {
    return status ? 'true' : 'false'
  }
  return String(status).toLowerCase()
})

/**
 * 状态配置
 */
const statusConfig = computed((): StatusConfig => {
  // 优先使用自定义文本和颜色
  if (props.text || props.color) {
    return {
      text: props.text || statusKey.value,
      color: props.color || 'default'
    }
  }

  // 使用自定义状态映射
  const map = props.statusMap || defaultStatusMap
  if (map[statusKey.value]) {
    return map[statusKey.value]
  }

  // 尝试在默认映射中查找
  if (defaultStatusMap[statusKey.value]) {
    return defaultStatusMap[statusKey.value]
  }

  // 兜底：使用状态值本身作为文本
  return {
    text: String(props.status),
    color: 'default'
  }
})

/**
 * 变体样式
 */
const variantStyle = computed(() => {
  return getVariantConfig(props.variant, statusConfig.value.color)
})

/**
 * 尺寸配置
 */
const sizeCfg = computed(() => {
  return getSizeConfig(props.size)
})

/**
 * 圆点颜色
 */
const dotColorClass = computed(() => {
  const color = statusConfig.value.color
  return statusColorConfig[color]?.dot ?? statusColorConfig.default.dot
})

/**
 * 处理点击
 */
function handleClick() {
  if (props.clickable) {
    emit('click', props.status)
  }
}

/**
 * 获取当前状态
 */
function getStatus() {
  return props.status
}

/**
 * 获取状态文本
 */
function getText() {
  return statusConfig.value.text
}

/**
 * 暴露方法
 */
defineExpose<TStatusBadgeExpose>({
  getStatus,
  getText
})
</script>

<template>
  <span
    :class="cn(
      't-status-badge inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200',
      variantStyle.bg,
      variantStyle.text,
      variantStyle.border,
      sizeCfg.padding,
      sizeCfg.textSize,
      sizeCfg.height,
      clickable && 'cursor-pointer hover:opacity-80',
      className
    )"
    @click="handleClick"
  >
    <!-- 圆点指示器 -->
    <span
      v-if="showDot || variant === 'dot'"
      :class="cn(
        'rounded-full shrink-0',
        dotColorClass,
        sizeCfg.dotSize,
        (statusConfig.color === 'processing' || statusConfig.color === 'pending') && 'animate-pulse'
      )"
    />

    <!-- 状态文本 -->
    <span class="truncate">
      {{ statusConfig.text }}
    </span>
  </span>
</template>

<style scoped>
.t-status-badge {
  /* 确保文字垂直居中 */
  line-height: 1;
}

/* 脉冲动画用于处理中状态 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
