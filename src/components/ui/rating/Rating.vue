<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: number
  max?: number
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 5,
  disabled: false,
  readonly: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const hoverValue = defineModel<number>('hoverValue', { default: 0 })

const displayValue = computed(() => hoverValue.value || props.modelValue)

function handleClick(value: number) {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', value)
}

function handleMouseEnter(value: number) {
  if (props.disabled || props.readonly) return
  hoverValue.value = value
}

function handleMouseLeave() {
  hoverValue.value = 0
}
</script>

<template>
  <div
    class="flex items-center gap-1"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    @mouseleave="handleMouseLeave"
  >
    <button
      v-for="i in max"
      :key="i"
      type="button"
      :disabled="disabled || readonly"
      :class="cn(
        'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
        !disabled && !readonly && 'hover:scale-110 cursor-pointer',
        readonly && 'cursor-default'
      )"
      @click="handleClick(i)"
      @mouseenter="handleMouseEnter(i)"
    >
      <Star
        :class="cn(
          sizeClasses[size],
          'transition-colors duration-200',
          i <= displayValue
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-transparent text-muted-foreground'
        )"
      />
    </button>
  </div>
</template>
