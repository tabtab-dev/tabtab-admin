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
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import * as icons from 'lucide-vue-next'
import type { TPageHeaderProps, TPageHeaderEmits, TPageHeaderExpose, PageAction, BreadcrumbItem } from './types'

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
      className
    )"
    :style="sticky ? { top: `${stickyOffset}px` } : undefined"
  >
    <!-- 面包屑 -->
    <nav v-if="breadcrumbs && breadcrumbs.length > 0" class="mb-3">
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
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-muted-foreground mt-1.5 text-sm">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- 右侧：操作按钮 -->
      <div v-if="visibleActions.length > 0" class="flex items-center gap-2 shrink-0">
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
