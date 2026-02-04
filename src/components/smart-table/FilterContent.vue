<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SmartTableColumn } from './types'

/**
 * 组件属性定义
 */
const props = defineProps<{
  column: SmartTableColumn<T>
}>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  (e: 'filter-change', columnKey: string, value: any): void
  (e: 'close'): void
}>()

/**
 * 当前筛选值
 */
const filterValue = defineModel<Record<string, any>>('filters', { default: () => ({}) })

/**
 * 获取当前列的筛选值
 */
const currentValue = computed(() => {
  return filterValue.value[props.column.key] ?? ''
})

/**
 * 处理筛选值变化
 */
function handleChange(value: any) {
  emit('filter-change', props.column.key, value)
  // 选择类型筛选后自动关闭
  if (props.column.filter?.type === 'select') {
    emit('close')
  }
}
</script>

<template>
  <div v-if="column.filter" class="p-2">
    <!-- 文本筛选 -->
    <template v-if="column.filter.type === 'text'">
      <Input
        :model-value="currentValue"
        :placeholder="column.filter.placeholder || '请输入...'"
        class="w-40"
        @update:model-value="handleChange"
      />
    </template>

    <!-- 选择筛选 -->
    <template v-else-if="column.filter.type === 'select'">
      <Select :model-value="currentValue" @update:model-value="handleChange">
        <SelectTrigger class="w-40">
          <SelectValue :placeholder="column.filter.placeholder || '请选择...'" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">全部</SelectItem>
          <SelectItem
            v-for="option in column.filter.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </template>

    <!-- 日期筛选 -->
    <template v-else-if="column.filter.type === 'date'">
      <Input
        type="date"
        :model-value="currentValue"
        :placeholder="column.filter.placeholder || '请选择日期...'"
        class="w-40"
        @update:model-value="handleChange"
      />
    </template>

    <!-- 数字筛选 -->
    <template v-else-if="column.filter.type === 'number'">
      <Input
        type="number"
        :model-value="currentValue"
        :placeholder="column.filter.placeholder || '请输入数字...'"
        class="w-40"
        @update:model-value="handleChange"
      />
    </template>

    <!-- 不支持的筛选类型提示 -->
    <template v-else>
      <div class="text-sm text-muted-foreground px-2 py-1">
        暂不支持 {{ column.filter.type }} 类型筛选
      </div>
    </template>
  </div>
</template>
