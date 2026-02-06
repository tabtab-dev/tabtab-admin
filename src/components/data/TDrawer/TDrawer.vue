<script setup lang="ts">
/**
 * TDrawer - 基于 antdv-next 的抽屉组件
 *
 * @description 支持通过 Props 配置生成抽屉，样式与 shadcn-vue 主题对齐
 * @example
 * 基础用法：
 *   import { ref } from 'vue'
 *   import { TDrawer } from '@/components/data/TDrawer'
 *
 *   const open = ref(false)
 *
 *   <TDrawer v-model:open="open" title="标题">
 *     <p>内容</p>
 *   </TDrawer>
 *
 * @example
 * 与 TForm 结合：
 *   <TDrawer v-model:open="open" title="编辑" :footer="null">
 *     <TForm v-model="formData" :schema="schema" @submit="handleSubmit" />
 *   </TDrawer>
 *
 * @example
 * 与 TTable 结合：
 *   <TDrawer v-model:open="open" title="选择用户" size="large">
 *     <TTable :schema="tableSchema" :data="userData" />
 *   </TDrawer>
 */
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConfigProvider, Drawer } from 'antdv-next'
import { useScrollLock } from '@vueuse/core'
import type { Locale } from 'antdv-next/lib/locale'
import { cn } from '@/lib/utils'
import { getAntdvLocale } from '@/i18n/locales'
import type { TDrawerProps, TDrawerEmits, TDrawerExpose } from './types'

/**
 * 导入主题配置
 */
import { useTDrawerTheme } from './theme'

/**
 * 导入样式
 */
import './TDrawer.css'

/**
 * 组件选项
 */
defineOptions({
  name: 'TDrawer'
})

/**
 * i18n
 */
const { locale } = useI18n()

/**
 * antdv locale
 */
const antdvLocale = ref<Locale | null>(null)

/**
 * 加载 antdv locale
 */
async function loadAntdvLocale() {
  const currentLocale = locale.value as 'zh-CN' | 'en-US'
  antdvLocale.value = await getAntdvLocale(currentLocale)
}

/**
 * 监听语言变化
 */
watch(locale, loadAntdvLocale, { immediate: true })

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TDrawerProps>(), {
  open: false,
  placement: 'right',
  size: 'default',
  mask: true,
  maskClosable: true,
  keyboard: true,
  destroyOnHidden: false,
  closable: true,
  zIndex: 1000,
  loading: false,
  forceRender: false,
  push: () => ({ distance: 180 }),
  getContainer: () => document.body
})

/**
 * Emits 定义
 */
const emit = defineEmits<TDrawerEmits>()

/**
 * 内部状态
 */
const internalOpen = ref(props.open)

/**
 * 使用 VueUse 的 useScrollLock 锁定 body 滚动
 * 抽屉打开时自动锁定外层滚动，关闭时恢复
 */
const isLocked = useScrollLock(document.body)

/**
 * 监听抽屉状态，自动锁定/解锁 body 滚动
 */
watch(
  () => internalOpen.value,
  (open) => {
    isLocked.value = open
  },
  { immediate: true }
)

/**
 * 监听外部 open 变化
 */
watch(
  () => props.open,
  (newVal) => {
    internalOpen.value = newVal
  },
  { immediate: true }
)

/**
 * 计算属性：处理 class 类型
 */
const drawerClass = computed(() => {
  if (typeof props.class === 'string') {
    return props.class
  }
  if (Array.isArray(props.class)) {
    return cn(props.class)
  }
  return undefined
})

/**
 * 主题配置
 */
const themeConfig = useTDrawerTheme()

/**
 * 处理显隐变化
 * @param open - 是否打开
 */
function handleOpenChange(open: boolean): void {
  internalOpen.value = open
  emit('update:open', open)
}

/**
 * 处理抽屉关闭
 * @param e - 事件
 */
function handleClose(e: MouseEvent | KeyboardEvent): void {
  emit('close', e)
  emit('update:open', false)
}

/**
 * 处理动画结束后的回调
 * @param open - 是否打开
 */
function handleAfterOpenChange(open: boolean): void {
  emit('afterOpenChange', open)
}

/**
 * 处理键盘按下
 * @param e - 键盘事件
 */
function handleKeydown(e: KeyboardEvent): void {
  emit('keydown', e)
}

/**
 * 处理键盘抬起
 * @param e - 键盘事件
 */
function handleKeyup(e: KeyboardEvent): void {
  emit('keyup', e)
}

/**
 * 处理鼠标移入
 * @param e - 鼠标事件
 */
function handleMouseenter(e: MouseEvent): void {
  emit('mouseenter', e)
}

/**
 * 处理鼠标移出
 * @param e - 鼠标事件
 */
function handleMouseleave(e: MouseEvent): void {
  emit('mouseleave', e)
}

/**
 * 处理点击
 * @param e - 鼠标事件
 */
function handleClick(e: MouseEvent): void {
  emit('click', e)
}

/**
 * 打开抽屉
 */
function open(): void {
  internalOpen.value = true
  emit('update:open', true)
}

/**
 * 关闭抽屉
 */
function close(): void {
  internalOpen.value = false
  emit('update:open', false)
}

/**
 * 获取当前打开状态
 * @returns 是否打开
 */
function isOpen(): boolean {
  return internalOpen.value
}

/**
 * 暴露方法
 * @description 通过 ref 调用这些方法
 */
defineExpose<TDrawerExpose>({
  open,
  close,
  isOpen
})
</script>

<template>
  <ConfigProvider v-if="antdvLocale" :locale="antdvLocale" :theme="themeConfig">
    <Drawer
      :open="internalOpen"
      :title="title"
      :placement="placement"
      :size="size"
      :mask="mask"
      :mask-closable="maskClosable"
      :keyboard="keyboard"
      :destroy-on-hidden="destroyOnHidden"
      :closable="closable"
      :close-icon="closeIcon"
      :extra="extra"
      :footer="footer"
      :z-index="zIndex"
      :force-render="forceRender"
      :get-container="getContainer"
      :loading="loading"
      :push="push"
      :resizable="resizable"
      :root-class="rootClass"
      :root-style="rootStyle"
      :classes="classes"
      :styles="styles"
      :class="cn('t-drawer', drawerClass)"
      @close="handleClose"
      @update:open="handleOpenChange"
      @after-open-change="handleAfterOpenChange"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      @click="handleClick"
    >
      <!-- 默认插槽 - 内容区 -->
      <slot />

      <!-- 标题插槽 -->
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>

      <!-- 底部插槽 -->
      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>

      <!-- 额外操作插槽 -->
      <template v-if="$slots.extra" #extra>
        <slot name="extra" />
      </template>

      <!-- 关闭图标插槽 -->
      <template v-if="$slots.closeIcon" #closeIcon>
        <slot name="closeIcon" />
      </template>
    </Drawer>
  </ConfigProvider>
</template>

<style scoped>
/* 样式已迁移到 TDrawer.css */
</style>
