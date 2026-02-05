<script setup lang="ts">
/**
 * TFormItem - 表单字段渲染组件
 *
 * @description 根据 field.type 渲染对应的 antd 表单控件，支持异步选项加载
 * @example
 *   <TFormItem :field="field" :form-data="formData" />
 */
import { computed, ref, watch, onMounted } from 'vue'
import TFormList from './TFormList.vue'
import TFormGroup from './TFormGroup.vue'
import type { FormField, FormOption, AsyncOptionsLoader } from './types'

/**
 * 中文日期配置
 * @description 用于日期选择器的中文显示
 */
const dateLocale = {
  lang: {
    placeholder: '请选择日期',
    yearPlaceholder: '请选择年份',
    quarterPlaceholder: '请选择季度',
    monthPlaceholder: '请选择月份',
    weekPlaceholder: '请选择周',
    rangePlaceholder: ['开始日期', '结束日期'],
    rangeYearPlaceholder: ['开始年份', '结束年份'],
    rangeMonthPlaceholder: ['开始月份', '结束月份'],
    rangeWeekPlaceholder: ['开始周', '结束周'],
    locale: 'zh_CN',
    today: '今天',
    now: '此刻',
    backToToday: '返回今天',
    ok: '确定',
    timeSelect: '选择时间',
    dateSelect: '选择日期',
    weekSelect: '选择周',
    clear: '清除',
    month: '月',
    year: '年',
    previousMonth: '上个月 (PageUp)',
    nextMonth: '下个月 (PageDown)',
    monthSelect: '选择月份',
    yearSelect: '选择年份',
    decadeSelect: '选择年代',
    yearFormat: 'YYYY年',
    dayFormat: 'D日',
    dateFormat: 'YYYY年M月D日',
    dateTimeFormat: 'YYYY年M月D日 HH时mm分ss秒',
    previousYear: '上一年 (Control键加左方向键)',
    nextYear: '下一年 (Control键加右方向键)',
    previousDecade: '上一年代',
    nextDecade: '下一年代',
    previousCentury: '上一世纪',
    nextCentury: '下一世纪',
    shortMonths: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    shortWeekDays: '日_一_二_三_四_五_六'.split('_'),
    weekDays: '周日_周一_周二_周三_周四_周五_周六'.split('_')
  },
  timePickerLocale: {
    placeholder: '请选择时间',
    rangePlaceholder: ['开始时间', '结束时间']
  }
}

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
 * 已加载的选项列表
 */
const loadedOptions = ref<FormOption[]>([])

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
 * 加载异步选项
 */
async function loadAsyncOptions(): Promise<void> {
  if (!isAsyncOptions.value) return

  isLoadingOptions.value = true
  try {
    const loader = props.field.options as AsyncOptionsLoader
    const result = await loader(props.formData)
    loadedOptions.value = result
  } catch (error) {
    console.error(`[TForm] 加载字段 "${props.field.name}" 的选项失败:`, error)
    loadedOptions.value = []
  } finally {
    isLoadingOptions.value = false
  }
}

/**
 * 监听表单数据变化，重新加载异步选项
 */
watch(
  () => props.formData,
  () => {
    if (isAsyncOptions.value) {
      loadAsyncOptions()
    }
  },
  { deep: true }
)

/**
 * 组件挂载时加载异步选项
 */
onMounted(() => {
  if (isAsyncOptions.value) {
    loadAsyncOptions()
  }
})
</script>

<template>
  <a-form-item
    :name="field.name"
    :label="field.label"
    :rules="field.rules"
    :label-col="field.labelCol"
    :wrapper-col="field.wrapperCol"
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
      :locale="dateLocale"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- MonthPicker 月份选择器 -->
    <a-date-picker
      v-else-if="field.type === 'month-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      :locale="dateLocale"
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
      :locale="dateLocale"
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
      :locale="dateLocale"
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
      :locale="dateLocale"
      picker="week"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- RangePicker 日期范围选择器 -->
    <a-range-picker
      v-else-if="field.type === 'range-picker'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      :locale="dateLocale"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- TimePicker 时间选择器 -->
    <a-time-picker
      v-else-if="field.type === 'time-picker'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :disabled="isDisabled"
      :locale="dateLocale"
      style="width: 100%"
      v-bind="field.props"
    />

    <!-- TimeRangePicker 时间范围选择器 -->
    <a-time-range-picker
      v-else-if="field.type === 'time-range-picker'"
      v-model:value="fieldValue"
      :disabled="isDisabled"
      :locale="dateLocale"
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
