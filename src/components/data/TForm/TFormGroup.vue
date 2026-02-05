<script setup lang="ts">
/**
 * TFormGroup - 表单分组组件
 *
 * @description 将相关字段分组显示，支持折叠
 * @example
 *   <TFormGroup
 *     :field="field"
 *     :form-data="formData"
 *     :group-config="field.groupConfig"
 *   />
 */
import { ref } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import TFormItem from './TFormItem.vue'
import type { FormField, GroupFieldConfig } from './types'

/**
 * 组件 Props 定义
 */
interface Props {
  /** 字段配置 */
  field: FormField
  /** 表单数据 */
  formData: Record<string, any>
  /** 分组配置 */
  groupConfig: GroupFieldConfig
}

const props = defineProps<Props>()

/**
 * 展开状态
 */
const isExpanded = ref(props.groupConfig.defaultExpanded !== false)

/**
 * 切换展开状态
 */
function toggleExpand(): void {
  if (props.groupConfig.collapsible !== false) {
    isExpanded.value = !isExpanded.value
  }
}
</script>

<template>
  <div class="t-form-group border rounded-lg overflow-hidden">
    <!-- 分组标题 -->
    <div
      class="t-form-group-header flex items-center justify-between px-4 py-3 bg-muted/50 cursor-pointer"
      :class="{ 'cursor-default': groupConfig.collapsible === false }"
      @click="toggleExpand"
    >
      <h4 class="font-medium text-sm">
        {{ groupConfig.title || field.label }}
      </h4>
      <ChevronDown
        v-if="groupConfig.collapsible !== false && isExpanded"
        class="h-4 w-4 text-muted-foreground"
      />
      <ChevronUp
        v-else-if="groupConfig.collapsible !== false && !isExpanded"
        class="h-4 w-4 text-muted-foreground"
      />
    </div>

    <!-- 分组内容 -->
    <div
      v-show="isExpanded"
      class="t-form-group-content p-4 space-y-4"
    >
      <TFormItem
        v-for="childField in groupConfig.children"
        :key="String(childField.name)"
        :field="childField"
        :form-data="formData"
      />
    </div>
  </div>
</template>
