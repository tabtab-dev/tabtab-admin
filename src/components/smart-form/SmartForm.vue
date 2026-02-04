<script setup lang="ts" generic="T extends GenericObject">
import { computed, ref, toRef } from 'vue'
import { useForm, type GenericObject } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@/components/ui/button'
import { SmartFormField, SmartFormGroup } from './components'
import { useFieldConditions, useFormChange, useFieldGroups } from './composables'
import type {
  SmartFormConfig,
  SmartFormExpose,
} from './types'

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
}>()

/**
 * 构建初始值
 */
const buildInitialValues = (): T => {
  const values: Record<string, unknown> = {}
  props.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      values[field.name as string] = field.defaultValue
    } else {
      switch (field.type) {
        case 'checkbox':
        case 'switch':
          values[field.name as string] = false
          break
        case 'multi-select':
        case 'tags':
        case 'toggle-group':
          values[field.name as string] = []
          break
        case 'select':
        case 'radio':
          values[field.name as string] = ''
          break
        case 'number':
          values[field.name as string] = undefined
          break
        case 'slider':
          values[field.name as string] = field.sliderConfig?.min ?? 0
          break
        default:
          values[field.name as string] = ''
      }
    }
  })
  return { ...values, ...props.initialValues } as T
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
 * 使用字段条件联动
 */
const fieldsRef = toRef(props, 'fields')
const { fieldStates } = useFieldConditions(form, fieldsRef)

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
 * 表单布局类名
 */
const formLayoutClass = computed(() => {
  switch (props.layout) {
    case 'horizontal':
      return 'space-y-4'
    case 'grid':
      return `grid grid-cols-1 md:grid-cols-${props.gridCols} gap-4`
    case 'vertical':
    default:
      return 'space-y-4'
  }
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
  form.resetForm()
  passwordVisible.value = {}
  datePickerOpen.value = {}
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
  <form @submit="handleSubmit" :class="card ? 'bg-card rounded-lg border p-6' : ''">
    <!-- 表单标题 -->
    <div v-if="title || description" class="mb-6">
      <h3 v-if="title" class="text-lg font-semibold">{{ title }}</h3>
      <p v-if="description" class="text-sm text-muted-foreground mt-1">{{ description }}</p>
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
        :field-states="fieldStates"
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
          v-if="fieldStates[field.name]?.visible !== false"
          :field="field"
          :show-labels="showLabels"
          :show-descriptions="showDescriptions"
          :field-state="fieldStates[field.name] || { visible: true, disabled: false }"
          :password-visible="passwordVisible[field.name] || false"
          :date-picker-open="datePickerOpen[field.name] || false"
          @toggle-password="togglePasswordVisibility"
          @update:date-picker-open="(open) => datePickerOpen[field.name] = open"
        />
      </template>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-6 flex items-center gap-4">
      <template v-if="renderActions">
        <component
          :is="() => renderActions({
            form,
            isSubmitting: form.isSubmitting.value,
            isValid: form.meta.value.valid,
            handleSubmit,
            handleReset,
          })"
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
