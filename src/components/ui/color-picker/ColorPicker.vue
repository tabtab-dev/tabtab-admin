<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const colorValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const presetColors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#000000', '#374151', '#6b7280', '#9ca3af',
  '#d1d5db', '#e5e7eb', '#f3f4f6', '#ffffff',
]
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <input
        v-model="colorValue"
        type="color"
        :disabled="disabled"
        class="w-10 h-10 rounded cursor-pointer border border-input bg-background"
      />
      <input
        v-model="colorValue"
        type="text"
        :disabled="disabled"
        class="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
        placeholder="#000000"
      />
    </div>
    <div class="flex flex-wrap gap-1">
      <button
        v-for="color in presetColors"
        :key="color"
        type="button"
        :disabled="disabled"
        :class="cn(
          'w-6 h-6 rounded-sm border border-input transition-all hover:scale-110',
          colorValue === color && 'ring-2 ring-ring ring-offset-2'
        )"
        :style="{ backgroundColor: color }"
        @click="colorValue = color"
      />
    </div>
  </div>
</template>
