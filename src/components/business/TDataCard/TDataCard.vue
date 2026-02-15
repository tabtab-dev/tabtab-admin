<script setup lang="ts">
/**
 * TDataCard - 统计卡片组件
 *
 * @description 用于展示数据统计信息，支持图标、趋势、多种主题色
 * 样式与 shadcn-vue Card 保持一致：border + rounded-xl
 * @example
 * 基础用法：
 *   <TDataCard title="总用户" :value="1234" icon-name="Users" color="blue" />
 *
 * 带趋势：
 *   <TDataCard
 *     title="销售额"
 *     :value="56789"
 *     prefix="¥"
 *     icon-name="DollarSign"
 *     color="green"
 *     :trend="{ value: 12.5, direction: 'up' }"
 *   />
 */
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import * as icons from 'lucide-vue-next'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import { getColorConfig, getSizeConfig } from './theme'
import { useResponsive } from '@/composables/useResponsive'
import type { TDataCardProps, TDataCardEmits, TDataCardExpose, DataCardResponsiveConfig } from './types'

/**
 * 组件选项
 */
defineOptions({
  name: 'TDataCard'
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TDataCardProps>(), {
  color: 'default',
  size: 'default',
  loading: false,
  bordered: true,
  clickable: false
})

/**
 * Emits 定义
 */
const emit = defineEmits<TDataCardEmits>()

const { smallerThan } = useResponsive()

const responsiveConfig = computed<DataCardResponsiveConfig>(() => {
  return props.responsive || { enabled: true }
})

const isResponsiveEnabled = computed(() => responsiveConfig.value.enabled !== false)

const mobileBreakpoint = computed(() => responsiveConfig.value.mobileBreakpoint || 'md')

const isMobileView = computed(() => {
  if (!isResponsiveEnabled.value) return false
  return smallerThan(mobileBreakpoint.value)
})

const responsiveSize = computed(() => {
  if (!isMobileView.value) return props.size
  return responsiveConfig.value.mobileSize || 'sm'
})

const showIcon = computed(() => {
  if (isMobileView.value && responsiveConfig.value.hideIconOnMobile) {
    return false
  }
  return !!IconComponent.value
})

const showTrend = computed(() => {
  if (isMobileView.value && responsiveConfig.value.hideTrendOnMobile) {
    return false
  }
  return !!props.trend
})

/**
 * 颜色配置
 */
const colorCfg = computed(() => getColorConfig(props.color))

/**
 * 尺寸配置
 */
const sizeCfg = computed(() => getSizeConfig(responsiveSize.value))

/**
 * 图标组件
 */
const IconComponent = computed(() => {
  if (props.icon) return props.icon
  if (props.iconName) {
    return (icons as Record<string, unknown>)[props.iconName] as typeof TrendingUp | null
  }
  return null
})

/**
 * 趋势图标
 */
const TrendIcon = computed(() => {
  if (!props.trend) return null
  const direction = props.trend.direction || 'neutral'
  switch (direction) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    default:
      return Minus
  }
})

/**
 * 趋势颜色
 */
const trendColorClass = computed(() => {
  if (!props.trend) return ''
  const direction = props.trend.direction || 'neutral'
  switch (direction) {
    case 'up':
      return 'text-emerald-600'
    case 'down':
      return 'text-red-600'
    default:
      return 'text-muted-foreground'
  }
})

/**
 * 趋势背景色
 */
const trendBgClass = computed(() => {
  if (!props.trend) return ''
  const direction = props.trend.direction || 'neutral'
  switch (direction) {
    case 'up':
      return 'bg-emerald-50'
    case 'down':
      return 'bg-red-50'
    default:
      return 'bg-muted'
  }
})

/**
 * 处理点击
 */
function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}

/**
 * 获取当前值
 */
function getValue() {
  return props.value
}

/**
 * 暴露方法
 */
defineExpose<TDataCardExpose>({
  getValue
})
</script>

<template>
  <div
    :class="cn(
      // 基础样式 - 与 shadcn-vue Card 保持一致
      'relative overflow-hidden rounded-xl border bg-card text-card-foreground',
      // 过渡效果
      'transition-all duration-200',
      // 边框颜色
      bordered && colorCfg.border,
      // 悬停效果
      clickable && 'cursor-pointer hover:-translate-y-0.5',
      // 尺寸
      sizeCfg.padding,
      props.className
    )"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl"
    >
      <div class="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>

    <div class="flex items-start justify-between gap-4">
      <!-- 左侧内容 -->
      <div class="flex-1 min-w-0">
        <!-- 标题 -->
        <p :class="cn('text-muted-foreground font-medium truncate', sizeCfg.titleSize)">
          {{ title }}
        </p>

        <!-- 数值 -->
        <div class="mt-1 flex items-baseline gap-1">
          <span v-if="prefix" class="text-muted-foreground text-lg">{{ prefix }}</span>
          <span :class="cn('font-bold tracking-tight', colorCfg.text, sizeCfg.valueSize)">
            {{ value }}
          </span>
          <span v-if="suffix" class="text-muted-foreground text-sm">{{ suffix }}</span>
        </div>

        <!-- 描述 -->
        <p v-if="description" class="mt-1 text-xs text-muted-foreground truncate">
          {{ description }}
        </p>

        <!-- 趋势 -->
        <div v-if="showTrend" class="mt-2 flex items-center gap-1.5">
          <span
            :class="cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium',
              trendBgClass,
              trendColorClass
            )"
          >
            <component :is="TrendIcon" class="w-3 h-3" />
            {{ trend.value }}
          </span>
          <span v-if="trend.text" class="text-xs text-muted-foreground">
            {{ trend.text }}
          </span>
        </div>
      </div>

      <!-- 右侧图标 -->
      <div
        v-if="showIcon"
        :class="cn(
          'flex items-center justify-center rounded-lg shrink-0',
          colorCfg.iconBg,
          sizeCfg.iconSize
        )"
      >
        <component
          :is="IconComponent"
          :class="cn('text-primary', sizeCfg.iconSize === 'w-8 h-8' ? 'w-4 h-4' : sizeCfg.iconSize === 'w-10 h-10' ? 'w-5 h-5' : 'w-6 h-6')"
        />
      </div>
    </div>
  </div>
</template>
