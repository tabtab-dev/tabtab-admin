<script setup lang="ts">
/**
 * TPageHeader - 页面头部组件
 *
 * @description 统一的页面头部组件，包含标题、副标题、面包屑、操作按钮等
 * @example
 * 基础用法：
 *   <TPageHeader
 *     title="用户管理"
 *     subtitle="管理系统用户账号和权限分配"
 *   />
 *
 * 带操作按钮：
 *   <TPageHeader
 *     title="用户管理"
 *     :actions="[
 *       { text: '添加用户', type: 'primary', iconName: 'Plus', onClick: handleAdd }
 *     ]"
 *   />
 *
 * 带面包屑：
 *   <TPageHeader
 *     title="用户详情"
 *     :breadcrumbs="[
 *       { title: '首页', path: '/' },
 *       { title: '用户管理', path: '/users' },
 *       { title: '用户详情' }
 *     ]"
 *     show-back
 *   />
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import * as icons from 'lucide-vue-next'
import { useResponsive } from '@/composables/useResponsive'
import type { TPageHeaderProps, TPageHeaderEmits, TPageHeaderExpose, PageAction, BreadcrumbItem, PageHeaderResponsiveConfig } from './types'

/**
 * 组件选项
 */
defineOptions({
  name: 'TPageHeader'
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TPageHeaderProps>(), {
  showBack: false,
  sticky: false,
  stickyOffset: 0,
  showExtra: false
})

/**
 * Emits 定义
 */
const emit = defineEmits<TPageHeaderEmits>()

/**
 * 路由实例
 */
const router = useRouter()

const { smallerThan, isMobile } = useResponsive()

const responsiveConfig = computed<PageHeaderResponsiveConfig>(() => {
  return props.responsive || { enabled: true }
})

const isResponsiveEnabled = computed(() => responsiveConfig.value.enabled !== false)

const mobileBreakpoint = computed(() => responsiveConfig.value.mobileBreakpoint || 'md')

const isMobileView = computed(() => {
  if (!isResponsiveEnabled.value) return false
  return smallerThan(mobileBreakpoint.value)
})

const showSubtitle = computed(() => {
  if (isMobileView.value && responsiveConfig.value.hideSubtitleOnMobile) {
    return false
  }
  return !!props.subtitle
})

const showBreadcrumbs = computed(() => {
  if (isMobileView.value && responsiveConfig.value.hideBreadcrumbsOnMobile) {
    return false
  }
  return props.breadcrumbs && props.breadcrumbs.length > 0
})

const titleSizeClass = computed(() => {
  if (isMobileView.value) {
    const size = responsiveConfig.value.mobileTitleSize || 'sm'
    switch (size) {
      case 'sm': return 'text-xl'
      case 'lg': return 'text-3xl'
      default: return 'text-2xl'
    }
  }
  return 'text-2xl sm:text-3xl'
})

const primaryAction = computed(() => {
  if (!isMobileView.value || !responsiveConfig.value.collapseActionsOnMobile) {
    return null
  }
  return visibleActions.value[0] || null
})

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
 * 处理返回
 */
function handleBack() {
  if (props.onBack) {
    props.onBack()
  } else {
    router.back()
  }
  emit('back')
}

/**
 * 处理面包屑点击
 */
function handleBreadcrumbClick(item: BreadcrumbItem, index: number) {
  if (item.path && item.clickable !== false) {
    router.push(item.path)
  }
  emit('breadcrumbClick', item, index)
}

/**
 * 获取按钮变体
 */
function getButtonVariant(type: PageAction['type']) {
  switch (type) {
    case 'primary':
      return 'default'
    case 'danger':
      return 'destructive'
    case 'ghost':
      return 'ghost'
    case 'link':
      return 'link'
    default:
      return 'outline'
  }
}

/**
 * 检查按钮是否禁用
 */
function isButtonDisabled(action: PageAction) {
  if (typeof action.disabled === 'function') {
    return action.disabled()
  }
  return action.disabled === true
}

/**
 * 获取图标组件
 */
function getIconComponent(action: PageAction) {
  if (action.icon) return action.icon
  if (action.iconName) {
    return (icons as Record<string, unknown>)[action.iconName] as typeof ChevronLeft | null
  }
  return null
}

/**
 * 获取标题
 */
function getTitle() {
  return props.title
}

/**
 * 触发返回
 */
function goBack() {
  handleBack()
}

/**
 * 暴露方法
 */
defineExpose<TPageHeaderExpose>({
  getTitle,
  goBack
})
</script>

<template>
  <div
    :class="cn(
      't-page-header pb-6',
      sticky && 'sticky z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      { 't-page-header-mobile': isMobileView },
      className
    )"
    :style="sticky ? { top: `${stickyOffset}px` } : undefined"
  >
    <!-- 面包屑 -->
    <nav v-if="showBreadcrumbs" class="mb-3">
      <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li
          v-for="(item, index) in breadcrumbs"
          :key="index"
          class="flex items-center"
        >
          <span
            :class="cn(
              'transition-colors',
              item.path && item.clickable !== false
                ? 'hover:text-foreground cursor-pointer'
                : 'text-foreground font-medium'
            )"
            @click="handleBreadcrumbClick(item, index)"
          >
            {{ item.title }}
          </span>
          <ChevronRight
            v-if="index < breadcrumbs.length - 1"
            class="w-4 h-4 mx-1 text-muted-foreground"
          />
        </li>
      </ol>
    </nav>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- 左侧：返回按钮 + 标题区 -->
      <div class="flex items-start gap-3">
        <!-- 返回按钮 -->
        <Button
          v-if="showBack"
          variant="ghost"
          size="icon"
          class="shrink-0 h-9 w-9 -ml-2"
          @click="handleBack"
        >
          <ChevronLeft class="w-5 h-5" />
        </Button>

        <!-- 标题区 -->
        <div>
          <h1 :class="cn('font-bold tracking-tight', titleSizeClass)">
            {{ title }}
          </h1>
          <p v-if="showSubtitle" class="text-muted-foreground mt-1.5 text-sm">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- 右侧：操作按钮 -->
      <div v-if="visibleActions.length > 0" class="flex items-center gap-2 shrink-0">
        <!-- 移动端折叠模式：只显示主要操作 -->
        <template v-if="primaryAction">
          <Button
            :variant="getButtonVariant(primaryAction.type)"
            :disabled="isButtonDisabled(primaryAction)"
            :class="cn('gap-2', primaryAction.className)"
            @click="primaryAction.onClick"
          >
            <component
              :is="getIconComponent(primaryAction)"
              v-if="getIconComponent(primaryAction)"
              class="w-4 h-4"
            />
            {{ primaryAction.text }}
          </Button>
        </template>
        <!-- 正常模式：显示所有操作 -->
        <template v-else>
          <Button
            v-for="(action, index) in visibleActions"
            :key="index"
            :variant="getButtonVariant(action.type)"
            :disabled="isButtonDisabled(action)"
            :class="cn('gap-2', action.className)"
            @click="action.onClick"
          >
            <component
              :is="getIconComponent(action)"
              v-if="getIconComponent(action)"
              class="w-4 h-4"
            />
            {{ action.text }}
          </Button>
        </template>
      </div>
    </div>

    <!-- 额外内容插槽 -->
    <div v-if="showExtra || $slots.extra" class="mt-4">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.t-page-header {
  /* 确保粘性头部有正确的层级 */
}
</style>
