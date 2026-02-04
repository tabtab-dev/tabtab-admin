<script setup lang="ts" generic="T extends GenericObject">
import { ref, watch } from 'vue'
import type { GenericObject } from 'vee-validate'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FormFieldConfig, FormFieldGroup } from '../types'
import SmartFormField from './SmartFormField.vue'

/**
 * SmartFormGroup 组件 - 表单字段分组（支持折叠）
 */
const props = defineProps<{
  /** 分组配置 */
  group?: FormFieldGroup<T>
  /** 分组中的字段 */
  fields: FormFieldConfig<T>[]
  /** 是否显示标签 */
  showLabels: boolean
  /** 是否显示描述 */
  showDescriptions: boolean
  /** 字段状态映射 */
  fieldStates: Record<string, { visible: boolean; disabled: boolean }>
  /** 密码可见性状态 */
  passwordVisible: Record<string, boolean>
  /** 日期选择器打开状态 */
  datePickerOpen: Record<string, boolean>
}>()

const emit = defineEmits<{
  (e: 'toggle-password', fieldName: string): void
  (e: 'update:date-picker-open', fieldName: string, open: boolean): void
}>()

/**
 * 折叠状态
 */
const accordionValue = ref<string[]>([])

/**
 * 初始化折叠状态
 */
const initAccordionState = () => {
  if (props.group?.collapsible) {
    const isExpanded = props.group.defaultExpanded !== false
    accordionValue.value = isExpanded ? ['group'] : []
  }
}

// 监听分组变化，重新初始化
watch(() => props.group, initAccordionState, { immediate: true })

/**
 * 处理密码可见性切换
 */
const handleTogglePassword = (fieldName: string) => {
  emit('toggle-password', fieldName)
}

/**
 * 处理日期选择器状态更新
 */
const handleDatePickerOpen = (fieldName: string, open: boolean) => {
  emit('update:date-picker-open', fieldName, open)
}
</script>

<template>
  <!-- 有分组配置且可折叠 -->
  <Accordion
    v-if="group?.collapsible"
    v-model="accordionValue"
    type="multiple"
    collapsible
    class="w-full"
  >
    <AccordionItem value="group" class="border-0">
      <AccordionTrigger class="hover:no-underline py-2">
        <div class="flex flex-col items-start">
          <span class="text-base font-medium">{{ group.title }}</span>
          <span v-if="group.description" class="text-sm text-muted-foreground font-normal">
            {{ group.description }}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div class="space-y-4 pt-2">
          <SmartFormField
            v-for="field in fields"
            :key="field.name"
            :field="field"
            :show-labels="showLabels"
            :show-descriptions="showDescriptions"
            :field-state="fieldStates[field.name] || { visible: true, disabled: false }"
            :password-visible="passwordVisible[field.name] || false"
            :date-picker-open="datePickerOpen[field.name] || false"
            @toggle-password="handleTogglePassword"
            @update:date-picker-open="(open) => handleDatePickerOpen(field.name as string, open)"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>

  <!-- 有分组配置但不可折叠 -->
  <div v-else-if="group" class="space-y-4">
    <div class="border-b pb-2 mb-4">
      <h4 class="text-base font-medium">{{ group.title }}</h4>
      <p v-if="group.description" class="text-sm text-muted-foreground">
        {{ group.description }}
      </p>
    </div>
    <SmartFormField
      v-for="field in fields"
      :key="field.name"
      :field="field"
      :show-labels="showLabels"
      :show-descriptions="showDescriptions"
      :field-state="fieldStates[field.name] || { visible: true, disabled: false }"
      :password-visible="passwordVisible[field.name] || false"
      :date-picker-open="datePickerOpen[field.name] || false"
      @toggle-password="handleTogglePassword"
      @update:date-picker-open="(open) => handleDatePickerOpen(field.name as string, open)"
    />
  </div>

  <!-- 无分组配置 -->
  <template v-else>
    <SmartFormField
      v-for="field in fields"
      :key="field.name"
      :field="field"
      :show-labels="showLabels"
      :show-descriptions="showDescriptions"
      :field-state="fieldStates[field.name] || { visible: true, disabled: false }"
      :password-visible="passwordVisible[field.name] || false"
      :date-picker-open="datePickerOpen[field.name] || false"
      @toggle-password="handleTogglePassword"
      @update:date-picker-open="(open) => handleDatePickerOpen(field.name as string, open)"
    />
  </template>
</template>
