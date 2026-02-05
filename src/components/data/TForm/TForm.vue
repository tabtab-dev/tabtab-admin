<script setup lang="ts">
/**
 * TForm - 基于 antdv-next 的 JSON 配置化表单组件
 *
 * @description 支持通过 JSON Schema 配置生成表单，样式与 shadcn-vue 主题对齐
 * @example
 * 使用示例：
 *   import { ref } from 'vue'
 *   import { TForm } from '@/components/data/TForm'
 *   import type { FormSchema, TFormExpose } from '@/components/data/TForm'
 *
 *   const formRef = ref<TFormExpose>()
 *   const formData = ref({})
 *
 *   const schema: FormSchema = {
 *     fields: [
 *       { name: 'name', type: 'input', label: '姓名', rules: [{ required: true }] }
 *     ]
 *   }
 *
 *   // 模板中使用
 *   // <TForm ref="formRef" v-model="formData" :schema="schema" />
 */
import { computed, reactive, ref, watch, useSlots, nextTick } from 'vue'
import { ConfigProvider } from 'antdv-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Search, RotateCcw } from 'lucide-vue-next'
import TFormItem from './TFormItem.vue'
import { useTFormTheme } from './theme'
import type { FormSchema, TFormProps, TFormEmits, TFormExpose, FormField, NamePath, FieldWatch } from './types'

/**
 * 组件选项
 */
defineOptions({
  name: 'TForm'
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TFormProps>(), {
  modelValue: () => ({}),
  loading: false
})

/**
 * Emits 定义
 */
const emit = defineEmits<TFormEmits>()

/**
 * TForm 主题配置
 * @description 组件级主题配置，不影响全局 antdv-next 主题
 */
const tformTheme = useTFormTheme()

/**
 * 插槽
 */
const slots = useSlots()

/**
 * Form 实例引用
 */
const formRef = ref<any>()

/**
 * 内部表单数据
 */
const formData = reactive<Record<string, any>>({})

/**
 * 字段禁用状态映射
 */
const fieldDisabledMap = reactive<Map<string, boolean>>(new Map())

/**
 * 字段隐藏状态映射
 */
const fieldHiddenMap = reactive<Map<string, boolean>>(new Map())

/**
 * 搜索表单折叠状态
 */
const isCollapsed = ref(props.schema.searchConfig?.collapsed ?? false)

/**
 * 计算是否为搜索表单模式
 */
const isSearchMode = computed(() => props.schema.searchConfig?.enabled === true)

/**
 * 计算搜索表单配置
 */
const searchConfig = computed(() => ({
  collapseThreshold: 3,
  showCollapseButton: true,
  collapseButtonText: '收起',
  expandButtonText: '展开',
  columns: 3,
  gutter: 16,
  searchText: '搜索',
  resetText: '重置',
  showReset: true,
  ...props.schema.searchConfig
}))

/**
 * 表单状态管理
 */
const formMeta = reactive({
  /** 是否修改过 */
  dirty: false,
  /** 是否触碰过 */
  touched: false,
  /** 是否验证通过 */
  valid: true,
  /** 是否提交中 */
  submitting: false,
  /** 是否验证中 */
  validating: false
})

/**
 * 原始表单数据（用于比较 dirty 状态）
 */
const initialFormData = ref<Record<string, any>>({})

/**
 * 获取字段名的字符串表示
 * @param name - 字段名
 * @returns 字符串形式的字段名
 */
function getFieldKey(name: NamePath): string {
  if (Array.isArray(name)) {
    return name.join('.')
  }
  return String(name)
}

/**
 * 设置字段禁用状态
 * @param name - 字段名
 * @param disabled - 是否禁用
 */
function setFieldDisabled(name: NamePath, disabled: boolean): void {
  const key = getFieldKey(name)
  fieldDisabledMap.set(key, disabled)
}

/**
 * 设置字段隐藏状态
 * @param name - 字段名
 * @param hidden - 是否隐藏
 */
function setFieldHidden(name: NamePath, hidden: boolean): void {
  const key = getFieldKey(name)
  fieldHiddenMap.set(key, hidden)
}

/**
 * 获取字段禁用状态
 * @param field - 字段配置
 * @returns 是否禁用
 */
function getFieldDisabled(field: FormField): boolean {
  const key = getFieldKey(field.name)
  if (fieldDisabledMap.has(key)) {
    return fieldDisabledMap.get(key)!
  }
  if (typeof field.disabled === 'function') {
    return field.disabled(formData)
  }
  return field.disabled ?? false
}

/**
 * 获取字段隐藏状态
 * @param field - 字段配置
 * @returns 是否隐藏
 */
function getFieldHidden(field: FormField): boolean {
  const key = getFieldKey(field.name)
  if (fieldHiddenMap.has(key)) {
    return fieldHiddenMap.get(key)!
  }
  if (typeof field.hidden === 'function') {
    return field.hidden(formData)
  }
  return field.hidden ?? false
}

/**
 * 计算可见字段列表
 * @description 根据 hidden 和 dependencies 配置过滤字段
 */
const visibleFields = computed<FormField[]>(() => {
  return props.schema.fields.filter((field) => {
    // 隐藏字段（优先使用动态状态）
    if (getFieldHidden(field)) return false

    // 依赖联动
    if (field.dependencies) {
      const { field: depField, condition } = field.dependencies
      const depValue = formData[depField]
      return condition(depValue, formData)
    }

    return true
  })
})

/**
 * 计算搜索表单显示的字段
 * @description 根据折叠状态决定显示哪些字段
 */
const searchVisibleFields = computed<FormField[]>(() => {
  const fields = visibleFields.value
  if (!isSearchMode.value || !isCollapsed.value) {
    return fields
  }
  // 折叠模式下只显示阈值数量的字段
  return fields.slice(0, searchConfig.value.collapseThreshold)
})

/**
 * 计算是否有更多字段被折叠
 */
const hasMoreFields = computed(() => {
  return visibleFields.value.length > searchConfig.value.collapseThreshold
})

/**
 * 计算是否使用同行布局
 * @description 当字段数量较少时，搜索条件和按钮显示在一行
 */
const shouldShowInline = computed(() => {
  // 字段数量少于等于阈值+1时，使用同行布局
  return visibleFields.value.length <= searchConfig.value.collapseThreshold + 1
})

/**
 * 计算操作按钮的 wrapperCol
 * @description 用于水平布局时按钮的对齐
 */
const actionWrapperCol = computed(() => {
  if (props.schema.layout !== 'horizontal') return undefined

  const labelSpan = props.schema.labelCol?.span || 0
  const wrapperSpan = props.schema.wrapperCol?.span || 24

  return {
    offset: labelSpan,
    span: wrapperSpan
  }
})

/**
 * 初始化表单数据
 * @description 设置字段默认值
 */
function initFormData(): void {
  props.schema.fields.forEach((field) => {
    const fieldName = field.name as string
    if (field.defaultValue !== undefined && formData[fieldName] === undefined) {
      formData[fieldName] = field.defaultValue
    }
  })
  // 保存初始数据用于比较 dirty 状态
  initialFormData.value = JSON.parse(JSON.stringify(formData))
}

/**
 * 更新表单状态
 */
function updateFormMeta(): void {
  // 检查 dirty 状态
  formMeta.dirty = JSON.stringify(formData) !== JSON.stringify(initialFormData.value)
}

/**
 * 标记表单为已触碰
 */
function markTouched(): void {
  formMeta.touched = true
}

/**
 * 处理表单提交成功
 * @param values - 表单值
 */
function handleFinish(values: Record<string, any>): void {
  emit('update:modelValue', { ...formData })
  emit('submit', values)
}

/**
 * 处理表单提交失败
 * @param errorInfo - 错误信息
 */
function handleFinishFailed(errorInfo: any): void {
  emit('finishFailed', errorInfo)
}

/**
 * 处理表单重置
 */
function handleReset(): void {
  formRef.value?.resetFields()
  // 搜索表单模式下触发重置回调
  if (isSearchMode.value && props.schema.searchConfig?.onReset) {
    props.schema.searchConfig.onReset()
  }
  emit('reset')
}

/**
 * 处理搜索
 * @param values - 表单值
 */
function handleSearch(values: Record<string, any>): void {
  // 搜索表单模式下触发搜索回调
  if (isSearchMode.value && props.schema.searchConfig?.onSearch) {
    props.schema.searchConfig.onSearch(values as any)
  }
  emit('submit', values)
}

/**
 * 切换折叠状态
 */
function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value
}

/**
 * 处理字段值变化
 * @param changedValues - 变化的值
 */
function handleValuesChange(changedValues: Record<string, any>): void {
  Object.assign(formData, changedValues)
  emit('update:modelValue', { ...formData })
  emit('change', changedValues, { ...formData })
}

/**
 * 处理字段变化
 * @param changedFields - 变化的字段
 * @param allFields - 所有字段
 */
function handleFieldsChange(changedFields: any[], allFields: any[]): void {
  emit('fieldsChange', changedFields, allFields)
}

/**
 * 表单方法对象（用于 watch 回调）
 */
const formMethods = {
  setFieldValue: (name: NamePath, value: any) => {
    formRef.value?.setFieldValue(name, value)
  },
  getFieldValue: (name: NamePath) => {
    return formRef.value?.getFieldValue(name)
  },
  setFieldDisabled,
  setFieldHidden
}

/**
 * 收集所有字段的 watch 配置
 */
const allWatches = computed(() => {
  const watches: Array<{ field: string; watch: FieldWatch }> = []
  props.schema.fields.forEach((field) => {
    if (field.watch && field.watch.length > 0) {
      field.watch.forEach((w) => {
        watches.push({ field: getFieldKey(field.name), watch: w })
      })
    }
  })
  return watches
})

/**
 * 处理字段值变化（包含 watch 触发）
 * @param changedValues - 变化的值
 */
function handleValuesChangeWithWatch(changedValues: Record<string, any>): void {
  Object.assign(formData, changedValues)

  // 更新表单状态
  markTouched()
  updateFormMeta()

  // 触发字段 watch
  nextTick(() => {
    allWatches.value.forEach(({ watch }) => {
      const watchedField = watch.field
      if (watchedField in changedValues) {
        const value = formData[watchedField]
        watch.handler(value, { ...formData }, formMethods)
      }
    })
  })

  emit('update:modelValue', { ...formData })
  emit('change', changedValues, { ...formData })
}

/**
 * 暴露方法
 * @description 通过 ref 调用这些方法
 */
defineExpose<TFormExpose>({
  /**
   * 验证表单
   */
  validate: (nameList) => {
    return formRef.value?.validateFields(nameList) || Promise.resolve({})
  },

  /**
   * 验证所有字段
   */
  validateFields: (nameList) => {
    return formRef.value?.validateFields(nameList) || Promise.resolve({})
  },

  /**
   * 重置表单
   */
  resetFields: (nameList) => {
    formRef.value?.resetFields(nameList)
  },

  /**
   * 清除验证
   */
  clearValidate: (nameList) => {
    formRef.value?.clearValidate(nameList)
  },

  /**
   * 获取单个字段值
   */
  getFieldValue: (name) => {
    return formRef.value?.getFieldValue(name)
  },

  /**
   * 获取多个字段值
   */
  getFieldsValue: (nameList) => {
    return formRef.value?.getFieldsValue(nameList) || {}
  },

  /**
   * 设置单个字段值
   */
  setFieldValue: (name, value) => {
    formRef.value?.setFieldValue(name, value)
  },

  /**
   * 设置多个字段值
   */
  setFieldsValue: (values) => {
    formRef.value?.setFieldsValue(values)
  },

  /**
   * 设置字段禁用状态
   */
  setFieldDisabled,

  /**
   * 获取表单状态
   */
  getMeta: () => ({ ...formMeta }),

  /**
   * 检查表单是否修改过
   */
  isDirty: () => formMeta.dirty,

  /**
   * 检查表单是否触碰过
   */
  isTouched: () => formMeta.touched,

  /**
   * 检查表单是否有效
   */
  isValid: () => formMeta.valid,

  /**
   * 获取 antd Form 实例
   */
  getFormInstance: () => {
    return formRef.value
  }
})

/**
 * 监听外部 modelValue 变化
 */
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      Object.assign(formData, newVal)
    }
  },
  { immediate: true, deep: true }
)

/**
 * 监听 schema 变化重新初始化
 */
watch(
  () => props.schema,
  () => {
    initFormData()
  },
  { deep: true }
)

/**
 * 初始化
 */
initFormData()
</script>

<template>
  <ConfigProvider :theme="tformTheme">
    <a-form
      ref="formRef"
      :model="formData"
      :layout="isSearchMode ? 'inline' : schema.layout"
      :label-col="isSearchMode ? undefined : schema.labelCol"
      :wrapper-col="isSearchMode ? undefined : schema.wrapperCol"
      :label-align="schema.labelAlign"
      :size="schema.size"
      :disabled="schema.disabled || loading"
      :colon="schema.colon"
      :class="cn(
        't-form',
        {
          't-form-search': isSearchMode,
          't-form-collapsed': isSearchMode && isCollapsed
        },
        $attrs.class as string
      )"
      @finish="handleSearch"
      @finish-failed="handleFinishFailed"
      @values-change="handleValuesChangeWithWatch"
      @fields-change="handleFieldsChange"
    >
    <!-- 搜索表单布局 -->
    <template v-if="isSearchMode">
      <!-- 同行布局：条件少时横向排列 -->
      <div
        v-if="shouldShowInline"
        class="search-form-inline"
      >
        <div class="search-form-fields">
          <TFormItem
            v-for="field in searchVisibleFields"
            :key="String(field.name)"
            :field="field"
            :form-data="formData"
            class="search-form-item-inline"
          >
            <!-- 自定义插槽透传 -->
            <template
              v-if="field.type === 'custom' && field.slot && slots[field.slot]"
              v-slot:[field.slot]="slotProps"
            >
              <slot :name="field.slot" v-bind="slotProps" />
            </template>
          </TFormItem>
        </div>

        <!-- 搜索表单操作按钮 -->
        <div class="search-form-actions-inline">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <Search class="w-4 h-4 mr-1" />
            {{ searchConfig.searchText }}
          </button>
          <button
            v-if="searchConfig.showReset"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            @click="handleReset"
          >
            <RotateCcw class="w-4 h-4 mr-1" />
            {{ searchConfig.resetText }}
          </button>
          <button
            v-if="searchConfig.showCollapseButton && hasMoreFields"
            type="button"
            class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
            @click="toggleCollapse"
          >
            {{ isCollapsed ? searchConfig.expandButtonText : searchConfig.collapseButtonText }}
            <ChevronDown v-if="isCollapsed" class="w-4 h-4 ml-1" />
            <ChevronUp v-else class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <!-- 网格布局：条件多时纵向排列 -->
      <template v-else>
        <div
          class="search-form-container"
          :style="{
            display: 'grid',
            gridTemplateColumns: `repeat(${searchConfig.columns}, minmax(0, 1fr))`,
            gap: `${searchConfig.gutter}px`
          }"
        >
          <TFormItem
            v-for="field in searchVisibleFields"
            :key="String(field.name)"
            :field="field"
            :form-data="formData"
            class="search-form-item"
          >
            <!-- 自定义插槽透传 -->
            <template
              v-if="field.type === 'custom' && field.slot && slots[field.slot]"
              v-slot:[field.slot]="slotProps"
            >
              <slot :name="field.slot" v-bind="slotProps" />
            </template>
          </TFormItem>
        </div>

        <!-- 搜索表单操作按钮 -->
        <div class="search-form-actions">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <Search class="w-4 h-4 mr-1" />
            {{ searchConfig.searchText }}
          </button>
          <button
            v-if="searchConfig.showReset"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            @click="handleReset"
          >
            <RotateCcw class="w-4 h-4 mr-1" />
            {{ searchConfig.resetText }}
          </button>
          <button
            v-if="searchConfig.showCollapseButton && hasMoreFields"
            type="button"
            class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
            @click="toggleCollapse"
          >
            {{ isCollapsed ? searchConfig.expandButtonText : searchConfig.collapseButtonText }}
            <ChevronDown v-if="isCollapsed" class="w-4 h-4 ml-1" />
            <ChevronUp v-else class="w-4 h-4 ml-1" />
          </button>
        </div>
      </template>
    </template>

    <!-- 普通表单布局 -->
    <template v-else>
      <!-- 表单字段 -->
      <TFormItem
        v-for="field in visibleFields"
        :key="String(field.name)"
        :field="field"
        :form-data="formData"
      >
        <!-- 自定义插槽透传 -->
        <template
          v-if="field.type === 'custom' && field.slot && slots[field.slot]"
          v-slot:[field.slot]="slotProps"
        >
          <slot :name="field.slot" v-bind="slotProps" />
        </template>
      </TFormItem>

      <!-- 操作按钮 -->
      <a-form-item
        v-if="schema.actions?.showSubmit !== false || schema.actions?.showReset"
        :wrapper-col="actionWrapperCol"
      >
        <div
          :class="cn(
            'flex gap-2',
            {
              'justify-start': schema.actions?.align === 'left',
              'justify-center': schema.actions?.align === 'center',
              'justify-end': !schema.actions?.align || schema.actions?.align === 'right'
            }
          )"
        >
          <Button
            v-if="schema.actions?.showSubmit !== false"
            type="submit"
            :loading="loading"
          >
            {{ schema.actions?.submitText || '提交' }}
          </Button>
          <Button
            v-if="schema.actions?.showReset"
            type="button"
            variant="outline"
            @click="handleReset"
          >
            {{ schema.actions?.resetText || '重置' }}
          </Button>
        </div>
      </a-form-item>
    </template>
    </a-form>
  </ConfigProvider>
</template>

<style scoped>
@reference "@/assets/css/app.css";

/* 表单标签样式 - 对齐 shadcn-vue */
.t-form :deep(.ant-form-item-label) {
  @apply font-medium text-foreground;
}

/* 错误提示样式 */
.t-form :deep(.ant-form-item-explain-error) {
  @apply text-sm text-destructive mt-1;
}

/* 输入框样式对齐 */
.t-form :deep(.ant-input),
.t-form :deep(.ant-input-password),
.t-form :deep(.ant-input-number-input) {
  @apply rounded-md border-border bg-background text-foreground;
  @apply placeholder:text-muted-foreground;
  @apply focus:border-ring focus:ring-2 focus:ring-ring/50;
}

/* 输入框聚焦状态 */
.t-form :deep(.ant-input:focus),
.t-form :deep(.ant-input-focused),
.t-form :deep(.ant-input-password:focus),
.t-form :deep(.ant-input-number:focus),
.t-form :deep(.ant-input-number-focused) {
  @apply border-ring ring-2 ring-ring/50;
}

/* 选择器样式 */
.t-form :deep(.ant-select-selector) {
  @apply rounded-md border-border bg-background text-foreground;
  @apply focus:border-ring focus:ring-2 focus:ring-ring/50;
}

/* 选择器聚焦状态 */
.t-form :deep(.ant-select-focused .ant-select-selector) {
  @apply border-ring ring-2 ring-ring/50;
}

/* 文本域样式 */
.t-form :deep(.ant-input-textarea) textarea {
  @apply rounded-md border-border bg-background text-foreground;
}

/* 单选框和复选框样式 */
.t-form :deep(.ant-radio-wrapper),
.t-form :deep(.ant-checkbox-wrapper) {
  @apply text-foreground;
}

/* 开关样式 */
.t-form :deep(.ant-switch) {
  @apply bg-muted;
}

.t-form :deep(.ant-switch-checked) {
  @apply bg-primary;
}

/* 日期选择器样式 */
.t-form :deep(.ant-picker) {
  @apply rounded-md border-border bg-background text-foreground;
}

.t-form :deep(.ant-picker-focused) {
  @apply border-ring ring-2 ring-ring/50;
}

/* 级联选择器样式 */
.t-form :deep(.ant-cascader-picker) {
  @apply rounded-md border-border bg-background text-foreground;
}

/* 树形选择器样式 */
.t-form :deep(.ant-tree-select) .ant-select-selector {
  @apply rounded-md border-border bg-background text-foreground;
}

/* 禁用状态 */
.t-form :deep(.ant-input-disabled),
.t-form :deep(.ant-select-disabled .ant-select-selector),
.t-form :deep(.ant-picker-disabled) {
  @apply bg-muted text-muted-foreground;
}

/* 上传组件样式 */
.t-form :deep(.ant-upload) {
  @apply text-foreground;
}

.t-form :deep(.ant-upload-list-item) {
  @apply text-foreground;
}

.t-form :deep(.ant-upload-list-item-name) {
  @apply text-foreground;
}

/* 穿梭框样式 */
.t-form :deep(.ant-transfer) {
  @apply text-foreground;
}

.t-form :deep(.ant-transfer-list) {
  @apply border-border bg-background;
}

.t-form :deep(.ant-transfer-list-header) {
  @apply bg-muted/50 text-foreground border-border;
}

.t-form :deep(.ant-transfer-list-body) {
  @apply bg-background;
}

.t-form :deep(.ant-transfer-list-content-item) {
  @apply text-foreground;
}

.t-form :deep(.ant-transfer-list-content-item:hover) {
  @apply bg-muted/50;
}

/* 分段控制器样式 */
.t-form :deep(.ant-segmented) {
  @apply bg-muted text-foreground;
}

.t-form :deep(.ant-segmented-item-selected) {
  @apply bg-background text-foreground shadow-sm;
}

.t-form :deep(.ant-segmented-item:hover:not(.ant-segmented-item-selected)) {
  @apply text-foreground;
}

/* 颜色选择器样式 */
.t-form input[type="color"] {
  @apply border-border bg-background;
}

.t-form input[type="color"]:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* 时间范围选择器样式 */
.t-form :deep(.ant-picker-range) {
  @apply rounded-md border-border bg-background text-foreground;
}

.t-form :deep(.ant-picker-range-focused) {
  @apply border-ring ring-2 ring-ring/50;
}

/* 滑块样式 */
.t-form :deep(.ant-slider) {
  @apply text-foreground;
}

.t-form :deep(.ant-slider-rail) {
  @apply bg-muted;
}

.t-form :deep(.ant-slider-track) {
  @apply bg-primary;
}

.t-form :deep(.ant-slider-handle) {
  @apply border-primary bg-background;
}

/* 评分样式 */
.t-form :deep(.ant-rate) {
  @apply text-foreground;
}

.t-form :deep(.ant-rate-star) {
  @apply text-muted-foreground;
}

.t-form :deep(.ant-rate-star-full) {
  @apply text-primary;
}

/* 数字输入框样式 */
.t-form :deep(.ant-input-number) {
  @apply rounded-md border-border bg-background text-foreground;
}

.t-form :deep(.ant-input-number-handler-wrap) {
  @apply border-border bg-muted;
}

.t-form :deep(.ant-input-number-handler) {
  @apply border-border;
}

.t-form :deep(.ant-input-number-handler-up-inner),
.t-form :deep(.ant-input-number-handler-down-inner) {
  @apply text-muted-foreground;
}

/* 自动完成样式 */
.t-form :deep(.ant-select-dropdown) {
  @apply bg-popover border-border;
}

.t-form :deep(.ant-select-item) {
  @apply text-foreground;
}

.t-form :deep(.ant-select-item-option-active) {
  @apply bg-muted;
}

.t-form :deep(.ant-select-item-option-selected) {
  @apply bg-primary/10;
}

/* 提及样式 */
.t-form :deep(.ant-mentions) {
  @apply rounded-md border-border bg-background text-foreground;
}

.t-form :deep(.ant-mentions-focused) {
  @apply border-ring ring-2 ring-ring/50;
}

/* 下拉菜单样式 */
.t-form :deep(.ant-dropdown-menu) {
  @apply bg-popover border-border;
}

.t-form :deep(.ant-dropdown-menu-item) {
  @apply text-foreground;
}

.t-form :deep(.ant-dropdown-menu-item:hover) {
  @apply bg-muted;
}

/* 日期选择器面板样式 */
.t-form :deep(.ant-picker-panel) {
  @apply bg-popover border-border;
}

.t-form :deep(.ant-picker-header) {
  @apply border-border text-foreground;
}

.t-form :deep(.ant-picker-header-view) {
  @apply text-foreground;
}

.t-form :deep(.ant-picker-cell) {
  @apply text-foreground;
}

.t-form :deep(.ant-picker-cell-in-view) {
  @apply text-foreground;
}

.t-form :deep(.ant-picker-cell-selected .ant-picker-cell-inner) {
  @apply bg-primary text-primary-foreground;
}

.t-form :deep(.ant-picker-cell-today .ant-picker-cell-inner::before) {
  @apply border-primary;
}

.t-form :deep(.ant-picker-time-panel-column) {
  @apply bg-popover;
}

.t-form :deep(.ant-picker-time-panel-cell-inner) {
  @apply text-foreground;
}

.t-form :deep(.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner) {
  @apply bg-primary text-primary-foreground;
}

/* 级联选择器下拉样式 */
.t-form :deep(.ant-cascader-menus) {
  @apply bg-popover border-border;
}

.t-form :deep(.ant-cascader-menu) {
  @apply border-border;
}

.t-form :deep(.ant-cascader-menu-item) {
  @apply text-foreground;
}

.t-form :deep(.ant-cascader-menu-item:hover) {
  @apply bg-muted;
}

.t-form :deep(.ant-cascader-menu-item-active) {
  @apply bg-primary/10;
}

/* 树形选择器下拉样式 */
.t-form :deep(.ant-select-tree) {
  @apply bg-popover;
}

.t-form :deep(.ant-select-tree-node-content-wrapper) {
  @apply text-foreground;
}

.t-form :deep(.ant-select-tree-node-content-wrapper:hover) {
  @apply bg-muted;
}

.t-form :deep(.ant-select-tree-node-selected) {
  @apply bg-primary/10;
}

/* 表单验证错误样式 */
.t-form :deep(.ant-form-item-has-error .ant-input),
.t-form :deep(.ant-form-item-has-error .ant-input-number),
.t-form :deep(.ant-form-item-has-error .ant-picker),
.t-form :deep(.ant-form-item-has-error .ant-select-selector) {
  @apply border-destructive;
}

/* 表单验证成功样式 */
.t-form :deep(.ant-form-item-has-success .ant-input),
.t-form :deep(.ant-form-item-has-success .ant-input-number),
.t-form :deep(.ant-form-item-has-success .ant-picker),
.t-form :deep(.ant-form-item-has-success .ant-select-selector) {
  @apply border-primary;
}

/* 加载状态样式 */
.t-form :deep(.ant-select-loading .ant-select-selector) {
  @apply bg-muted;
}

/* 占位符样式 */
.t-form :deep(.ant-input::placeholder),
.t-form :deep(.ant-input-number-input::placeholder) {
  @apply text-muted-foreground;
}

/* 清除按钮样式 */
.t-form :deep(.ant-input-clear-icon),
.t-form :deep(.ant-select-clear) {
  @apply text-muted-foreground hover:text-foreground;
}

/* 后缀图标样式 */
.t-form :deep(.ant-picker-suffix),
.t-form :deep(.ant-select-arrow),
.t-form :deep(.ant-cascader-picker-arrow) {
  @apply text-muted-foreground;
}

/* ==================== 搜索表单样式 ==================== */

/* 搜索表单容器 */
.t-form-search {
  @apply w-full;
}

/* ========== 同行布局样式 ========== */

/* 同行布局容器 */
.t-form-search .search-form-inline {
  @apply flex items-end gap-4 w-full;
}

/* 同行布局字段区域 */
.t-form-search .search-form-fields {
  @apply flex flex-1 items-end gap-4 min-w-0;
}

/* 同行布局字段项 */
.t-form-search .search-form-item-inline {
  @apply mb-0 flex-1 min-w-0;
}

.t-form-search .search-form-item-inline :deep(.ant-form-item) {
  @apply mb-0;
}

.t-form-search .search-form-item-inline :deep(.ant-form-item-label) {
  @apply pb-1;
}

.t-form-search .search-form-item-inline :deep(.ant-form-item-control) {
  @apply min-w-0;
}

/* 同行布局按钮区域 */
.t-form-search .search-form-actions-inline {
  @apply flex items-center gap-2 flex-shrink-0 pb-[1px];
}

/* ========== 网格布局样式 ========== */

/* 搜索表单网格容器 */
.t-form-search .search-form-container {
  @apply w-full;
}

/* 搜索表单字段项 */
.t-form-search .search-form-item {
  @apply mb-0;
}

.t-form-search .search-form-item :deep(.ant-form-item-label) {
  @apply pb-1;
}

.t-form-search .search-form-item :deep(.ant-form-item-control) {
  @apply min-w-0;
}

/* 搜索表单操作按钮区域 */
.t-form-search .search-form-actions {
  @apply flex items-center gap-2 mt-4 pt-4 border-t border-border;
}

/* 搜索表单折叠状态 */
.t-form-search.t-form-collapsed .search-form-container {
  @apply overflow-hidden;
}

/* 响应式布局 - 移动端 */
@media (max-width: 640px) {
  .t-form-search .search-form-container {
    grid-template-columns: 1fr !important;
  }
}

/* 响应式布局 - 平板 */
@media (min-width: 641px) and (max-width: 1024px) {
  .t-form-search .search-form-container {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
</style>
