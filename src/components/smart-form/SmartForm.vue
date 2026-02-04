<script setup lang="ts" generic="T extends GenericObject">
import { computed, ref, toRef, provide, h, defineComponent, type VNode } from 'vue'
import { useForm, type GenericObject, type FormContext } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@/components/ui/button'
import { SmartFormField, SmartFormGroup } from './components'
import { useFieldConditions, useFormChange, useFieldGroups } from './composables'
import type {
  SmartFormConfig,
  SmartFormExpose,
} from './types'
import type { FieldState } from './composables'

/**
 * RenderActions 组件 - 用于渲染自定义操作按钮
 */
const RenderActions = defineComponent<{
  renderActions: (props: {
    form: FormContext<GenericObject>
    isSubmitting: boolean
    isValid: boolean
    handleSubmit: () => void
    handleReset: () => void
  }) => VNode
  form: FormContext<GenericObject>
  isSubmitting: boolean
  isValid: boolean
  handleSubmit: () => void
  handleReset: () => void
}>({
  name: 'RenderActions',
  props: ['renderActions', 'form', 'isSubmitting', 'isValid', 'handleSubmit', 'handleReset'],
  setup(props) {
    return () => {
      try {
        return props.renderActions({
          form: props.form,
          isSubmitting: props.isSubmitting,
          isValid: props.isValid,
          handleSubmit: props.handleSubmit,
          handleReset: props.handleReset,
        })
      } catch (error) {
        console.error('[SmartForm] renderActions error:', error)
        return null
      }
    }
  },
})

/**
 * SmartForm 组件 - 基于 VeeValidate + Zod 的通用表单组件
 */
const props = withDefaults(defineProps<SmartFormConfig<T>>(), {
  validateOnBlur: true,
  validateOnChange: false,
  validateOnMount: false,
  showLabels: true,
  showDescriptions: true,
  labelPosition: 'top',
  layout: 'vertical',
  gridCols: 2,
  submitText: '提交',
  resetText: '重置',
  showReset: false,
  submitDisabled: false,
  submitLoading: false,
  card: false,
})

const emit = defineEmits<{
  (e: 'submit', values: T): void
  (e: 'change', values: Partial<T>): void
  (e: 'reset'): void
}>()

/**
 * 构建初始值（带类型安全检查）
 */
const buildInitialValues = (): T => {
  const values: Record<string, unknown> = {}
  props.fields.forEach((field) => {
    const fieldName = String(field.name)
    // 验证字段名
    if (!fieldName) {
      console.warn('[SmartForm] Field name is empty, skipping')
      return
    }

    if (field.defaultValue !== undefined) {
      values[fieldName] = field.defaultValue
    } else {
      switch (field.type) {
        case 'checkbox':
        case 'switch':
          values[fieldName] = false
          break
        case 'multi-select':
        case 'tags':
        case 'toggle-group':
          values[fieldName] = []
          break
        case 'select':
        case 'radio':
        case 'combobox':
          values[fieldName] = ''
          break
        case 'number':
        case 'slider':
          values[fieldName] = field.sliderConfig?.min ?? 0
          break
        case 'date':
        case 'datetime':
        case 'time':
          values[fieldName] = ''
          break
        case 'date-range':
          values[fieldName] = { from: undefined, to: undefined }
          break
        case 'file':
          values[fieldName] = null
          break
        default:
          values[fieldName] = ''
      }
    }
  })

  // 合并 initialValues 并进行类型安全检查
  const mergedValues = { ...values, ...props.initialValues }

  // 运行时类型验证（开发环境）
  if (import.meta.env.DEV && props.validationSchema) {
    try {
      const result = props.validationSchema.safeParse(mergedValues)
      if (!result.success) {
        console.warn('[SmartForm] Initial values validation failed:', result.error)
      }
    } catch (error) {
      console.warn('[SmartForm] Initial values validation error:', error)
    }
  }

  return mergedValues as T
}

/**
 * 密码字段显示状态
 */
const passwordVisible = ref<Record<string, boolean>>({})

/**
 * 日期选择器打开状态
 */
const datePickerOpen = ref<Record<string, boolean>>({})

/**
 * 使用 vee-validate 的 useForm
 */
const form = useForm<T>({
  validationSchema: props.validationSchema ? toTypedSchema(props.validationSchema) : undefined,
  initialValues: buildInitialValues(),
  validateOnBlur: props.validateOnBlur,
  validateOnChange: props.validateOnChange,
  validateOnMount: props.validateOnMount,
})

/**
 * 提供表单上下文给子组件（用于 render 函数）
 */
provide<FormContext<T>>('form', form)

/**
 * 使用字段条件联动
 */
const fieldsRef = toRef(props, 'fields')
const { fieldStates, processConditions } = useFieldConditions(form, fieldsRef)

/**
 * 使用表单变更监听（带防抖）
 */
useFormChange(form, emit, { debounce: true, debounceDelay: 300 })

/**
 * 使用字段分组
 */
const groupsRef = toRef(props, 'groups')
const { groupedFields } = useFieldGroups(fieldsRef, groupsRef)

/**
 * 切换密码显示
 */
const togglePasswordVisibility = (fieldName: string) => {
  passwordVisible.value[fieldName] = !passwordVisible.value[fieldName]
}

/**
 * 更新日期选择器状态
 */
const updateDatePickerOpen = (fieldName: string, open: boolean) => {
  datePickerOpen.value[fieldName] = open
}

/**
 * 网格列数类名映射（用于 Tailwind JIT 模式兼容）
 */
const gridColsClassMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
}

/**
 * 表单布局类名
 */
const formLayoutClass = computed(() => {
  switch (props.layout) {
    case 'horizontal':
      return 'space-y-4'
    case 'grid': {
      const colsClass = gridColsClassMap[props.gridCols] || 'md:grid-cols-2'
      return `grid grid-cols-1 ${colsClass} gap-4`
    }
    case 'vertical':
    default:
      return 'space-y-4'
  }
})

/**
 * 字段状态缓存（使用 computed 缓存所有字段状态）
 */
const normalizedFieldStates = computed<Record<string, FieldState>>(() => {
  const result: Record<string, FieldState> = {}
  props.fields.forEach((field) => {
    const fieldName = String(field.name)
    const state = fieldStates.value[fieldName]
    result[fieldName] = state ?? {
      visible: !field.hidden,
      disabled: field.disabled ?? false,
    }
  })
  return result
})

/**
 * 提交表单
 */
const handleSubmit = form.handleSubmit(async (values) => {
  emit('submit', values)
})

/**
 * 重置表单
 */
const handleReset = () => {
  // 重置 vee-validate 表单
  form.resetForm()

  // 清理所有内部状态
  passwordVisible.value = {}
  datePickerOpen.value = {}

  // 触发条件重新评估（composable 会自动重新初始化字段状态）
  processConditions()

  // 触发自定义重置事件
  emit('reset')
}

/**
 * 暴露给父组件的方法
 */
defineExpose<SmartFormExpose<T>>({
  form,
  submit: handleSubmit,
  reset: handleReset,
  validate: async () => {
    const result = await form.validate()
    return result.valid
  },
  setFieldValue: form.setFieldValue,
  getFieldValue: (field) => form.values[field],
  setValues: form.setValues,
  getValues: () => form.values,
  clearErrors: () => {
    form.resetForm({ errors: {} })
  },
})
</script>

<template>
  <form
    @submit="handleSubmit"
    :class="card ? 'bg-card rounded-lg border p-6' : ''"
    role="form"
    :aria-label="title || '表单'"
    :aria-describedby="description ? 'form-description' : undefined"
  >
    <!-- 表单标题 -->
    <div v-if="title || description" class="mb-6">
      <h3 v-if="title" class="text-lg font-semibold" id="form-title">{{ title }}</h3>
      <p v-if="description" id="form-description" class="text-sm text-muted-foreground mt-1">{{ description }}</p>
    </div>

    <!-- 表单内容 - 使用分组 -->
    <div v-if="groups && groups.length > 0" :class="formLayoutClass">
      <SmartFormGroup
        v-for="(groupItem, index) in groupedFields"
        :key="index"
        :group="groupItem.group"
        :fields="groupItem.fields"
        :show-labels="showLabels"
        :show-descriptions="showDescriptions"
        :field-states="normalizedFieldStates"
        :password-visible="passwordVisible"
        :date-picker-open="datePickerOpen"
        @toggle-password="togglePasswordVisibility"
        @update:date-picker-open="updateDatePickerOpen"
      />
    </div>

    <!-- 表单内容 - 不使用分组 -->
    <div v-else :class="formLayoutClass">
      <template v-for="field in fields" :key="field.name">
        <SmartFormField
          v-if="normalizedFieldStates[field.name as string]?.visible !== false"
          :field="field"
          :show-labels="showLabels"
          :show-descriptions="showDescriptions"
          :field-state="normalizedFieldStates[field.name as string] ?? { visible: true, disabled: false }"
          :password-visible="passwordVisible[field.name as string] ?? false"
          :date-picker-open="datePickerOpen[field.name as string] ?? false"
          @toggle-password="togglePasswordVisibility"
          @update:date-picker-open="(open) => datePickerOpen[field.name as string] = open"
        />
      </template>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-6 flex items-center gap-4">
      <template v-if="renderActions">
        <RenderActions
          :render-actions="renderActions"
          :form="form"
          :is-submitting="form.isSubmitting.value"
          :is-valid="form.meta.value.valid"
          :handle-submit="handleSubmit"
          :handle-reset="handleReset"
        />
      </template>
      <template v-else>
        <Button
          type="submit"
          :disabled="submitDisabled || !form.meta.value.valid"
          :loading="submitLoading || form.isSubmitting.value"
        >
          {{ submitText }}
        </Button>
        <Button
          v-if="showReset"
          type="button"
          variant="outline"
          @click="handleReset"
        >
          {{ resetText }}
        </Button>
      </template>
    </div>
  </form>
</template>
