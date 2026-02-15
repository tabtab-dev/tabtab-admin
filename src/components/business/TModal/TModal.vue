<script setup lang="ts">
/**
 * TModal - 基于 antdv-next 的对话框组件
 *
 * @description 支持通过 Props 配置生成对话框，样式与 shadcn-vue 主题对齐
 * @example
 * 基础用法：
 *   import { ref } from 'vue'
 *   import { TModal } from '@/components/data/TModal'
 *
 *   const open = ref(false)
 *
 *   <TModal v-model:open="open" title="标题" @ok="handleOk">
 *     <p>内容</p>
 *   </TModal>
 *
 * @example
 * 与 TForm 结合 - 模式1：TModal 控制提交（推荐用于异步提交场景）
 *   const formRef = ref<TFormExpose>()
 *   const open = ref(false)
 *   const formData = ref({ name: '' })
 *
 *   const schema: FormSchema = {
 *     fields: [{ name: 'name', type: 'input', label: '姓名', rules: [{ required: true }] }]
 *   }
 *
 *   async function handleSubmit(values) {
 *     await saveData(values)
 *     open.value = false
 *   }
 *
 *   <TModal v-model:open="open" title="编辑" :form-ref="formRef" @ok="handleSubmit">
 *     <TForm ref="formRef" v-model="formData" :schema="schema" embedded />
 *   </TModal>
 *
 * @example
 * 与 TForm 结合 - 模式2：TForm 控制提交（适合简单表单场景）
 *   <TModal v-model:open="open" title="编辑" :footer="null">
 *     <TForm v-model="formData" :schema="schema" @submit="handleSubmit" />
 *   </TModal>
 *
 * @example
 * 与 TTable 结合：
 *   <TModal v-model:open="open" title="选择用户" width="800">
 *     <TTable :schema="tableSchema" :data="userData" />
 *   </TModal>
 */
import { computed, ref, watch, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConfigProvider, Modal } from 'antdv-next'
import { cn } from '@/lib/utils'
import { getAntdvLocale } from '@/i18n/locales'
import { useResponsive } from '@/composables/useResponsive'
import type { TModalProps, TModalEmits, TModalExpose, TFormExpose, ModalResponsiveConfig } from './types'

/**
 * 导入主题配置
 */
import { useTModalTheme } from './theme'

/**
 * 导入样式
 */
import './TModal.css'

/**
 * 组件选项
 */
defineOptions({
  name: 'TModal'
})

/**
 * i18n
 */
const { locale } = useI18n()

const { smallerThan, isMobile } = useResponsive()

const responsiveConfig = computed<ModalResponsiveConfig>(() => {
  return props.responsive || { enabled: true }
})

const isResponsiveEnabled = computed(() => responsiveConfig.value.enabled !== false)

const mobileBreakpoint = computed(() => responsiveConfig.value.mobileBreakpoint || 'md')

const isMobileView = computed(() => {
  if (!isResponsiveEnabled.value) return false
  return smallerThan(mobileBreakpoint.value)
})

const responsiveWidth = computed(() => {
  if (!isMobileView.value) return props.width

  if (responsiveConfig.value.fullScreenOnMobile) {
    return '100%'
  }

  if (responsiveConfig.value.fullWidthOnMobile) {
    return responsiveConfig.value.mobileMaxWidth || 'calc(100vw - 32px)'
  }

  return responsiveConfig.value.mobileWidth || props.width
})

const responsiveStyles = computed(() => {
  if (!isMobileView.value || !responsiveConfig.value.fullScreenOnMobile) {
    return props.styles
  }

  return {
    ...props.styles,
    body: {
      ...props.styles?.body,
      maxHeight: 'calc(100vh - 200px)',
      overflowY: 'auto',
    },
  }
})

/**
 * antdv locale
 */
const antdvLocale = ref<any>(null)

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
const props = withDefaults(defineProps<TModalProps>(), {
  open: false,
  width: 520,
  centered: false,
  mask: true,
  maskClosable: true,
  keyboard: true,
  destroyOnHidden: false,
  okText: undefined,
  cancelText: undefined,
  okType: 'primary',
  closable: true,
  confirmLoading: false,
  zIndex: 1000,
  focusTriggerAfterClose: true,
  loading: false,
  forceRender: false,
  closeOnSubmitSuccess: false,
  formRef: undefined,
  footer: undefined
})

/**
 * Emits 定义
 */
const emit = defineEmits<TModalEmits & {
  /** 表单提交成功（当提供 formRef 时触发） */
  submit: [values: Record<string, any>]
}>()

/**
 * 内部状态
 */
const internalOpen = ref(props.open)
const internalConfirmLoading = ref(props.confirmLoading)

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
 * 监听外部 confirmLoading 变化
 */
watch(
  () => props.confirmLoading,
  (newVal) => {
    internalConfirmLoading.value = newVal
  },
  { immediate: true }
)

/**
 * 计算属性：处理 class 类型
 */
const modalClass = computed(() => {
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
const themeConfig = useTModalTheme()

/**
 * 处理确定按钮点击
 * @param e - 鼠标事件
 */
async function handleOk(e: MouseEvent): Promise<void> {
  // 如果提供了 formRef，先触发表单验证和提交
  // 使用 unref 获取 ref 的值，支持 Ref<T> 和 { value: T } 两种形式
  const formInstance = props.formRef ? unref(props.formRef) : undefined
  if (formInstance) {
    try {
      internalConfirmLoading.value = true
      const values = await formInstance.validate()
      emit('submit', values)
      emit('ok', e)

      // 如果配置了提交成功后自动关闭，则关闭弹窗
      if (props.closeOnSubmitSuccess) {
        close()
      }
    } catch (error) {
      // 表单验证失败，不触发 ok 事件，保持弹窗打开
      console.log('表单验证失败:', error)
    } finally {
      internalConfirmLoading.value = false
    }
  } else {
    emit('ok', e)
  }
}

/**
 * 处理取消/关闭
 * @param e - 鼠标事件
 */
function handleCancel(e: MouseEvent): void {
  emit('cancel', e)
  emit('update:open', false)
}

/**
 * 处理显隐变化
 * @param open - 是否打开
 */
function handleOpenChange(open: boolean): void {
  internalOpen.value = open
  emit('update:open', open)
}

/**
 * 处理完全关闭后的回调
 */
function handleAfterClose(): void {
  emit('afterClose')
}

/**
 * 处理动画结束后的回调
 * @param open - 是否打开
 */
function handleAfterOpenChange(open: boolean): void {
  emit('afterOpenChange', open)
}

/**
 * 打开弹窗
 */
function open(): void {
  internalOpen.value = true
  emit('update:open', true)
}

/**
 * 关闭弹窗
 */
function close(): void {
  internalOpen.value = false
  emit('update:open', false)
}

/**
 * 设置确认按钮 loading 状态
 * @param loading - 是否 loading
 */
function setConfirmLoading(loading: boolean): void {
  internalConfirmLoading.value = loading
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
defineExpose<TModalExpose>({
  open,
  close,
  setConfirmLoading,
  isOpen
})
</script>

<template>
  <ConfigProvider v-if="antdvLocale" :locale="antdvLocale" :theme="themeConfig">
    <Modal
      :open="internalOpen"
      :title="title"
      :width="responsiveWidth"
      :centered="centered"
      :mask="mask"
      :mask-closable="maskClosable"
      :keyboard="keyboard"
      :destroy-on-hidden="destroyOnHidden"
      :ok-text="okText"
      :cancel-text="cancelText"
      :ok-type="okType"
      :ok-button-props="okButtonProps"
      :cancel-button-props="cancelButtonProps"
      :closable="closable"
      :close-icon="closeIcon"
      :confirm-loading="internalConfirmLoading"
      :z-index="zIndex"
      :footer="typeof footer === 'boolean' ? (footer ? undefined : null) : footer"
      :force-render="forceRender"
      :get-container="getContainer"
      :transition-name="transitionName"
      :mask-transition-name="maskTransitionName"
      :focus-trigger-after-close="focusTriggerAfterClose"
      :loading="loading"
      :modal-render="modalRender"
      :root-class="rootClass"
      :root-style="rootStyle"
      :classes="responsiveStyles ? { ...classes, ...responsiveStyles } : classes"
      :styles="responsiveStyles"
      :class="cn('t-modal', { 't-modal-mobile': isMobileView, 't-modal-fullscreen': isMobileView && responsiveConfig.fullScreenOnMobile }, modalClass)"
      :wrap-class-name="wrapClassName"
      @ok="handleOk"
      @cancel="handleCancel"
      @update:open="handleOpenChange"
      @after-close="handleAfterClose"
      @after-open-change="handleAfterOpenChange"
    >
      <!-- 默认插槽 - 内容区 -->
      <slot />

      <!-- 标题插槽 -->
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>

      <!-- 底部插槽 - 仅在用户提供了 footer 插槽时渲染 -->
      <template v-if="$slots.footer" #footer="footerParams">
        <slot name="footer" v-bind="footerParams" />
      </template>

      <!-- 确认按钮文字插槽 -->
      <template v-if="$slots.okText" #okText>
        <slot name="okText" />
      </template>

      <!-- 取消按钮文字插槽 -->
      <template v-if="$slots.cancelText" #cancelText>
        <slot name="cancelText" />
      </template>

      <!-- 关闭图标插槽 -->
      <template v-if="$slots.closeIcon" #closeIcon>
        <slot name="closeIcon" />
      </template>

      <!-- 自定义渲染对话框插槽 -->
      <template v-if="$slots.modalRender" #modalRender="{ node }">
        <slot name="modalRender" :node="node" />
      </template>
    </Modal>
  </ConfigProvider>
</template>