<script setup lang="ts">
/**
 * TFormItem - 表单字段渲染组件
 *
 * @description 根据 field.type 渲染对应的 antd 表单控件，支持异步选项加载
 * @example
 *   <TFormItem :field="field" :form-data="formData" />
 */
import { computed, ref, watch, onMounted, shallowRef } from 'vue'
import TFormList from './TFormList.vue'
import TFormGroup from './TFormGroup.vue'
import type { FormField, FormOption, AsyncOptionsLoader } from './types'

/**
 * 组件 Props 定义
 */
interface Props {
  /** 字段配置 */
  field: FormField
  /** 表单数据 */
  formData: Record<string, any>
}

const props = defineProps<Props>()

/**
 * 异步选项加载状态
 */
const isLoadingOptions = ref(false)

/**
 * 已加载的选项列表 - 使用 shallowRef 优化性能
 */
const loadedOptions = shallowRef<FormOption[]>([])

/**
 * 选项缓存 - 用于缓存异步加载的选项
 * @description 使用 Map 存储缓存，key 为序列化后的表单数据快照
 */
const optionsCache = new Map<string, FormOption[]>()

/**
 * 防抖定时器
 */
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

/**
 * 虚拟滚动配置
 */
const virtualScrollConfig = computed(() => {
  if (!props.field.virtualScroll) return null
  if (props.field.virtualScroll === true) {
    return { enabled: true, itemHeight: 32, overscan: 5 }
  }
  return {
    enabled: props.field.virtualScroll.enabled ?? true,
    itemHeight: props.field.virtualScroll.itemHeight ?? 32,
    overscan: props.field.virtualScroll.overscan ?? 5
  }
})

/**
 * 获取异步选项防抖时间
 */
const optionsDebounceTime = computed(() => props.field.optionsDebounce ?? 300)

/**
 * 计算字段是否禁用
 * @returns 是否禁用
 */
const isDisabled = computed<boolean>(() => {
  if (typeof props.field.disabled === 'function') {
    return props.field.disabled(props.formData)
  }
  return props.field.disabled ?? false
})

/**
 * 计算字段值（双向绑定）
 */
const fieldValue = computed<any>({
  /** 获取字段值 */
  get: () => props.formData[props.field.name as string],
  /** 设置字段值 */
  set: (val: any) => {
    props.formData[props.field.name as string] = val
  }
})

/**
 * 判断是否需要异步加载选项
 * @returns 是否需要异步加载
 */
const isAsyncOptions = computed(() => typeof props.field.options === 'function')

/**
 * 获取最终使用的选项列表
 * @returns 选项列表
 */
const finalOptions = computed<FormOption[]>(() => {
  if (isAsyncOptions.value) {
    return loadedOptions.value
  }
  return props.field.options || []
})

/**
 * 生成缓存 key
 * @param formData - 表单数据
 * @returns 缓存 key
 */
function generateCacheKey(formData: Record<string, any>): string {
  // 提取可能影响选项的字段值
  const cacheFields = props.field.props?.cacheFields as string[] | undefined
  if (cacheFields && cacheFields.length > 0) {
    const cacheData: Record<string, any> = {}
    cacheFields.forEach(field => {
      cacheData[field] = formData[field]
    })
    return JSON.stringify(cacheData)
  }
  // 默认使用整个 formData
  return JSON.stringify(formData)
}

/**
 * 加载异步选项 - 带防抖和缓存
 */
async function loadAsyncOptions(): Promise<void> {
  if (!isAsyncOptions.value) return

  // 清除之前的防抖定时器
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  // 使用防抖延迟加载
  debounceTimer.value = setTimeout(async () => {
    const cacheKey = generateCacheKey(props.formData)

    // 检查缓存
    if (optionsCache.has(cacheKey)) {
      loadedOptions.value = optionsCache.get(cacheKey)!
      return
    }

    isLoadingOptions.value = true
    try {
      const loader = props.field.options as AsyncOptionsLoader
      const result = await loader(props.formData)
      loadedOptions.value = result

      // 存入缓存
      optionsCache.set(cacheKey, result)

      // 限制缓存大小，防止内存泄漏
      if (optionsCache.size > 50) {
        const firstKey = optionsCache.keys().next().value
        optionsCache.delete(firstKey)
      }
    } catch (error) {
      console.error(`[TForm] 加载字段 "${props.field.name}" 的选项失败:`, error)
      loadedOptions.value = []
    } finally {
      isLoadingOptions.value = false
    }
  }, optionsDebounceTime.value)
}

/**
 * 清除选项缓存
 */
function clearOptionsCache(): void {
  optionsCache.clear()
}

/**
 * 监听表单数据变化，重新加载异步选项
 * @description 使用 { flush: 'post' } 确保在 DOM 更新后执行
 */
watch(
  () => props.formData,
  () => {
    if (isAsyncOptions.value) {
      loadAsyncOptions()
    }
  },
  { deep: true, flush: 'post' }
)

/**
 * 组件挂载时加载异步选项
 */
onMounted(() => {
  if (isAsyncOptions.value) {
    loadAsyncOptions()
  }
})

/**
 * 组件映射表 - 用于动态渲染组件
 */
const componentMap: Record<string, string> = {
  'input': 'a-input',
  'password': 'a-input-password',
  'textarea': 'a-textarea',
  'number': 'a-input-number',
  'select': 'a-select',
  'radio': 'a-radio-group',
  'radio-button': 'a-radio-group',
  'checkbox': 'a-checkbox-group',
  'checkbox-single': 'a-checkbox',
  'switch': 'a-switch',
  'slider': 'a-slider',
  'rate': 'a-rate',
  'auto-complete': 'a-auto-complete',
  'mention': 'a-mentions',
  'date-picker': 'a-date-picker',
  'month-picker': 'a-date-picker',
  'quarter-picker': 'a-date-picker',
  'year-picker': 'a-date-picker',
  'week-picker': 'a-date-picker',
  'range-picker': 'a-range-picker',
  'time-picker': 'a-time-picker',
  'time-range-picker': 'a-time-range-picker',
  'cascader': 'a-cascader',
  'tree-select': 'a-tree-select',
  'upload': 'a-upload',
  'transfer': 'a-transfer',
  'segmented': 'a-segmented'
}

/**
 * 日期选择器类型映射
 */
const datePickerTypes: Record<string, string> = {
  'month-picker': 'month',
  'quarter-picker': 'quarter',
  'year-picker': 'year',
  'week-picker': 'week'
}

/**
 * 处理验证规则 - 为 checkbox-single 和 switch 类型的必填验证做特殊处理
 * @description 布尔类型的字段使用 required: true 时，需要验证值是否为 true 而不是是否有值
 */
const processedRules = computed(() => {
  if (!props.field.rules) return undefined

  return props.field.rules.map(rule => {
    // 如果是 checkbox-single 或 switch 类型，且使用了 required: true
    // 自动转换为自定义验证器
    if (
      (props.field.type === 'checkbox-single' || props.field.type === 'switch') &&
      rule.required === true &&
      !rule.validator
    ) {
      return {
        ...rule,
        validator: (_: any, value: boolean) => {
          if (value !== true) {
            return Promise.reject(new Error(rule.message || '请勾选此项'))
          }
          return Promise.resolve()
        }
      }
    }
    return rule
  })
})

/**
 * 暴露方法
 */
defineExpose({
  clearOptionsCache
})
</script>

<template>
  <a-form-item
    :name="field.name"
    :label="field.label"
    :rules="processedRules"
    :label-col="field.labelCol"
    :wrapper-col="field.wrapperCol"
    :tooltip="field.tooltip"
    :has-feedback="field.hasFeedback"
    :validate-status="field.validateStatus"
    :help="field.help"
    :extra="field.extra"
    :required="field.required"
    :validate-trigger="field.validateTrigger"
    :validate-debounce="field.validateDebounce"
    :validate-first="field.validateFirst"
    :hidden="field.hiddenItem"
    :layout="field.layout"
  >
    <!-- Input 输入框 -->
    <a-input
      v-if="field.type === 'input'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      v-bind="field.props"
    />

    <!-- Password 密码框 -->
    <a-input-password
      v-else-if="field.type === 'password'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      v-bind="field.props"
    />

    <!-- Textarea 文本域 -->
    <a-textarea
      v-else-if="field.type === 'textarea'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      v-bind="field.props"
    />

    <!-- Number 数字输入框 -->
    <a-input-number
      v-else-if="field.type === 'number'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- Select 选择器 -->
    <a-select
      v-else-if="field.type === 'select'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      :options="finalOptions"
      :loading="isLoadingOptions"
      :virtual="virtualScrollConfig?.enabled"
      :list-height="virtualScrollConfig ? virtualScrollConfig.itemHeight * 10 : undefined"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- Radio 单选框组 -->
    <a-radio-group
      v-else-if="field.type === 'radio'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    >
      <a-radio
        v-for="opt in finalOptions"
        :key="String(opt.value)"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </a-radio>
    </a-radio-group>

    <!-- RadioButton 按钮式单选框 -->
    <a-radio-group
      v-else-if="field.type === 'radio-button'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    >
      <a-radio-button
        v-for="opt in finalOptions"
        :key="String(opt.value)"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </a-radio-button>
    </a-radio-group>

    <!-- Checkbox 复选框组 -->
    <a-checkbox-group
      v-else-if="field.type === 'checkbox'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    >
      <a-checkbox
        v-for="opt in finalOptions"
        :key="String(opt.value)"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </a-checkbox>
    </a-checkbox-group>

    <!-- CheckboxSingle 单个复选框 -->
    <a-checkbox
      v-else-if="field.type === 'checkbox-single'"
      v-model:checked="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    >
      {{ field.props?.label || '' }}
    </a-checkbox>

    <!-- Switch 开关 -->
    <a-switch
      v-else-if="field.type === 'switch'"
      v-model:checked="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    />

    <!-- Slider 滑块 -->
    <a-slider
      v-else-if="field.type === 'slider'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    />

    <!-- Rate 评分 -->
    <a-rate
      v-else-if="field.type === 'rate'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    />

    <!-- AutoComplete 自动完成 -->
    <a-auto-complete
      v-else-if="field.type === 'auto-complete'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      :options="finalOptions"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- Mentions 提及 -->
    <a-mentions
      v-else-if="field.type === 'mention'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      :options="finalOptions"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- DatePicker 日期选择器 -->
    <a-date-picker
      v-else-if="field.type === 'date-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- MonthPicker 月份选择器 -->
    <a-date-picker
      v-else-if="field.type === 'month-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      picker="month"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- QuarterPicker 季度选择器 -->
    <a-date-picker
      v-else-if="field.type === 'quarter-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      picker="quarter"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- YearPicker 年份选择器 -->
    <a-date-picker
      v-else-if="field.type === 'year-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      picker="year"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- WeekPicker 周选择器 -->
    <a-date-picker
      v-else-if="field.type === 'week-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      picker="week"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- RangePicker 日期范围选择器 -->
    <a-range-picker
      v-else-if="field.type === 'range-picker'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- TimePicker 时间选择器 -->
    <a-time-picker
      v-else-if="field.type === 'time-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- TimeRangePicker 时间范围选择器 -->
    <a-time-range-picker
      v-else-if="field.type === 'time-range-picker'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- Cascader 级联选择器 -->
    <a-cascader
      v-else-if="field.type === 'cascader'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      :options="finalOptions"
      :virtual="virtualScrollConfig?.enabled"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- TreeSelect 树形选择器 -->
    <a-tree-select
      v-else-if="field.type === 'tree-select'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      :tree-data="finalOptions"
      :virtual="virtualScrollConfig?.enabled"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- Upload 文件上传 -->
    <a-upload
      v-else-if="field.type === 'upload'"
      v-model:file-list="fieldValue"
      :disabled="isDisabled"
      v-bind="field.props"
    >
      <a-button v-if="!field.props?.customUpload">
        <template #icon>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </template>
        {{ field.props?.uploadText || '点击上传' }}
      </a-button>
    </a-upload>

    <!-- Transfer 穿梭框 -->
    <a-transfer
      v-else-if="field.type === 'transfer'"
      v-model:target-keys="fieldValue"
      :data-source="finalOptions"
      :disabled="isDisabled"
      :render="(item: any) => item.label"
      v-bind="field.props"
    />

    <!-- ColorPicker 颜色选择器 -->
    <div
      v-else-if="field.type === 'color-picker'"
      class="flex items-center gap-2"
    >
      <input
        v-model="fieldValue"
        type="color"
        :disabled="isDisabled"
        class="w-10 h-10 p-0 border rounded cursor-pointer"
        v-bind="field.props"
      >
      <a-input
        v-model:value="fieldValue"
        :disabled="isDisabled"
        :placeholder="field.placeholder"
        style="width: 120px"
        v-bind="field.props?.inputProps"
      />
    </div>

    <!-- Segmented 分段控制器 -->
    <a-segmented
      v-else-if="field.type === 'segmented'"
      v-model:value="fieldValue"
      :options="finalOptions"
      :disabled="isDisabled"
      v-bind="field.props"
    />

    <!-- List 动态列表 -->
    <TFormList
      v-else-if="field.type === 'list' && field.listConfig"
      :field="field"
      :form-data="formData"
      :list-config="field.listConfig"
    />

    <!-- Group 分组 -->
    <TFormGroup
      v-else-if="field.type === 'group' && field.groupConfig"
      :field="field"
      :form-data="formData"
      :group-config="field.groupConfig"
    />

    <!-- Custom 自定义插槽 -->
    <slot
      v-else-if="field.type === 'custom'"
      :name="field.slot"
      :field="field"
      :value="fieldValue"
      :disabled="isDisabled"
    />
  </a-form-item>
</template>
