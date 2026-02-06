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
import { useI18n } from 'vue-i18n'
import { ConfigProvider } from 'antdv-next'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Search, RotateCcw } from 'lucide-vue-next'
import TFormItem from './TFormItem.vue'
import { useTFormTheme } from './theme'
import { useSearchForm, useFormMeta } from './composables'
import { getAntdvLocale } from '@/i18n/locales'
import type { FormSchema, TFormProps, TFormEmits, TFormExpose, FormField, NamePath, FieldWatch, FormInstance, FormValidateErrorInfo } from './types'

/**
 * 导入样式
 */
import './TForm.css'

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
 * i18n
 */
const { t, locale } = useI18n()

/**
 * TForm 主题配置
 * @description 组件级主题配置，不影响全局 antdv-next 主题
 */
const tformTheme = useTFormTheme()

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
  // 设置 dayjs 语言
  dayjs.locale(currentLocale === 'zh-CN' ? 'zh-cn' : 'en')
}

/**
 * 监听语言变化
 */
watch(locale, loadAntdvLocale, { immediate: true })

/**
 * 插槽
 */
const slots = useSlots()

/**
 * Form 实例引用
 */
const formRef = ref<FormInstance | null>(null)

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
 * 搜索表单国际化文本
 */
const searchFormLocale = computed(() => ({
  searchText: t('common.search'),
  resetText: t('common.reset'),
  expandButtonText: t('common.expand'),
  collapseButtonText: t('common.collapse'),
}))

/**
 * 使用搜索表单逻辑
 */
const {
  isCollapsed,
  isSearchMode,
  searchConfig,
  visibleFields,
  searchVisibleFields,
  hasMoreFields,
  shouldShowInline,
  toggleCollapse
} = useSearchForm({
  schema: props.schema,
  formData,
  locale: searchFormLocale
})

/**
 * 使用 useFormMeta 管理表单状态
 */
const {
  meta: formMeta,
  setInitialData,
  updateMeta,
  markTouched,
  setValid,
  setSubmitting,
  setValidating,
  getMetaSnapshot
} = useFormMeta()

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
  setInitialData(formData)
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
function handleFinishFailed(errorInfo: FormValidateErrorInfo): void {
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
  // 普通表单模式下触发 actions.onReset 回调
  if (!isSearchMode.value && props.schema.actions?.onReset) {
    props.schema.actions.onReset()
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
function handleFieldsChange(changedFields: unknown[], allFields: unknown[]): void {
  emit('fieldsChange', changedFields as any, allFields as any)
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
  updateMeta(formData)

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
  getMeta: getMetaSnapshot,

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
    return formRef.value ?? undefined
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
  <ConfigProvider v-if="antdvLocale" :theme="tformTheme" :locale="antdvLocale">
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
      :variant="schema.variant"
      :validate-trigger="schema.validateTrigger"
      :validate-messages="schema.validateMessages"
      :preserve="schema.preserve"
      :clear-on-destroy="schema.clearOnDestroy"
      :scroll-to-first-error="schema.scrollToFirstError"
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
            class="inline-flex items-center justify-center rounded-md bg-primary px-3 py-[5px] text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <Search class="w-4 h-4 mr-1" />
            {{ searchConfig.searchText }}
          </button>
          <button
            v-if="searchConfig.showReset"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-[5px] text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            @click="handleReset"
          >
            <RotateCcw class="w-4 h-4 mr-1" />
            {{ searchConfig.resetText }}
          </button>
          <button
            v-if="searchConfig.showCollapseButton && hasMoreFields"
            type="button"
            class="collapse-btn"
            :data-collapsed="isCollapsed"
            @click="toggleCollapse"
          >
            {{ isCollapsed ? searchConfig.expandButtonText : searchConfig.collapseButtonText }}
            <ChevronDown class="chevron-icon w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <!-- 网格布局：条件多时纵向排列 -->
      <template v-else>
        <!-- 折叠状态：搜索条件 + 展开按钮同行 -->
        <div
          v-if="isCollapsed"
          class="search-form-container search-form-collapsed-row"
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

          <!-- 折叠状态下的操作按钮（放在最后一列） -->
          <div class="search-form-actions-collapsed">
            <button
              type="submit"
              :disabled="loading"
              class="search-btn-collapsed"
            >
              <Search class="w-4 h-4 mr-1" />
              {{ searchConfig.searchText }}
            </button>
            <button
              v-if="searchConfig.showReset"
              type="button"
              class="reset-btn-collapsed"
              @click="handleReset"
            >
              <RotateCcw class="w-4 h-4 mr-1" />
              {{ searchConfig.resetText }}
            </button>
            <button
              v-if="searchConfig.showCollapseButton && hasMoreFields"
              type="button"
              class="collapse-btn collapse-btn-inline"
              :data-collapsed="isCollapsed"
              @click="toggleCollapse"
            >
              {{ searchConfig.expandButtonText }}
              <ChevronDown class="chevron-icon w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <!-- 展开状态：搜索条件网格 + 按钮同行（放在最后一列） -->
        <template v-else>
          <div
            class="search-form-container search-form-expanded-row"
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

            <!-- 展开状态下的操作按钮（放在最后一列） -->
            <div class="search-form-actions-expanded">
              <button
                type="submit"
                :disabled="loading"
                class="search-btn-expanded"
              >
                <Search class="w-4 h-4 mr-1" />
                {{ searchConfig.searchText }}
              </button>
              <button
                v-if="searchConfig.showReset"
                type="button"
                class="reset-btn-expanded"
                @click="handleReset"
              >
                <RotateCcw class="w-4 h-4 mr-1" />
                {{ searchConfig.resetText }}
              </button>
              <button
                v-if="searchConfig.showCollapseButton && hasMoreFields"
                type="button"
                class="collapse-btn collapse-btn-inline"
                :data-collapsed="isCollapsed"
                @click="toggleCollapse"
              >
                {{ searchConfig.collapseButtonText }}
                <ChevronDown class="chevron-icon w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </template>
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
            {{ schema.actions?.submitText || t('common.submit') }}
          </Button>
          <Button
            v-if="schema.actions?.showReset"
            type="button"
            variant="outline"
            @click="handleReset"
          >
            {{ schema.actions?.resetText || t('common.reset') }}
          </Button>
        </div>
      </a-form-item>
    </template>
    </a-form>
  </ConfigProvider>
</template>
