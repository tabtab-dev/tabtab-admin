<script setup lang="ts">
import { ref, computed } from 'vue'
import * as icons from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Smile, X, ChevronDown } from 'lucide-vue-next'
import TIconPicker from './TIconPicker.vue'
import type { TIconProps, TIconEmits, TIconExpose } from './types'

defineOptions({
  name: 'TIcon'
})

const props = withDefaults(defineProps<TIconProps>(), {
  placeholder: undefined,
  disabled: false,
  size: 'default',
  showClear: true,
  popupWidth: 720,
  popupHeight: 480,
  columns: 8,
  showCategoryTabs: true,
})

const emit = defineEmits<TIconEmits>()

const { t } = useI18n()

const pickerVisible = ref(false)

const placeholderText = computed(() => {
  return props.placeholder ?? t('icon.placeholder', '请选择图标')
})

const selectedIconComponent = computed(() => {
  if (!props.modelValue) return null
  return (icons as Record<string, unknown>)[props.modelValue] as typeof Smile | null
})

const sizeClasses = computed(() => {
  const sizeMap = {
    sm: {
      trigger: 'h-[24px] px-2 text-xs gap-1.5 rounded-sm',
      icon: 'h-3.5 w-3.5',
      clear: 'h-3 w-3',
      arrow: 'h-3 w-3',
    },
    default: {
      trigger: 'h-[32px] px-3 text-sm gap-2 rounded-sm',
      icon: 'h-4 w-4',
      clear: 'h-3.5 w-3.5',
      arrow: 'h-3.5 w-3.5',
    },
    lg: {
      trigger: 'h-[40px] px-4 text-base gap-2 rounded-sm',
      icon: 'h-5 w-5',
      clear: 'h-4 w-4',
      arrow: 'h-4 w-4',
    },
  }
  return sizeMap[props.size]
})

function open() {
  if (props.disabled) return
  pickerVisible.value = true
}

function close() {
  pickerVisible.value = false
}

function clear(e?: Event) {
  e?.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

function handleSelect(iconName: string) {
  emit('update:modelValue', iconName)
  emit('change', iconName)
}

function getValue() {
  return props.modelValue
}

defineExpose<TIconExpose>({
  open,
  close,
  clear,
  getValue,
})
</script>

<template>
  <div class="t-icon-selector">
    <Button
      type="button"
      variant="outline"
      :disabled="disabled"
      :class="cn(
        't-icon-trigger w-full justify-between',
        'bg-background hover:bg-accent/50',
        'border border-input hover:border-primary/50',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:border-primary',
        sizeClasses.trigger,
        !modelValue && 'text-muted-foreground',
        disabled && 'cursor-not-allowed opacity-50',
        $attrs.class as string
      )"
      @click="open"
    >
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <template v-if="modelValue && selectedIconComponent">
          <div class="t-icon-selected-wrapper">
            <component
              :is="selectedIconComponent"
              :class="cn(sizeClasses.icon, 'text-primary')"
            />
          </div>
          <span class="truncate font-medium">{{ modelValue }}</span>
        </template>
        <template v-else>
          <div class="t-icon-empty-wrapper">
            <Smile :class="cn(sizeClasses.icon, 'opacity-40')" />
          </div>
          <span class="truncate">{{ placeholderText }}</span>
        </template>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <button
          v-if="showClear && modelValue && !disabled"
          type="button"
          :class="cn(
            't-icon-clear p-1 rounded-full',
            'hover:bg-destructive/10 hover:text-destructive',
            'focus:outline-none',
            'transition-colors duration-150'
          )"
          :title="t('icon.clear', '清除')"
          @click="clear"
        >
          <X :class="sizeClasses.clear" />
        </button>

        <span v-if="showClear && modelValue && !disabled" class="w-px h-4 bg-border/80 mx-1" />

        <ChevronDown
          :class="cn(
            sizeClasses.arrow,
            'text-muted-foreground/70 transition-transform duration-300 ease-out',
            pickerVisible && 'rotate-180 text-primary'
          )"
        />
      </div>
    </Button>

    <TIconPicker
      v-model:visible="pickerVisible"
      :selected-icon="modelValue"
      :categories="categories"
      :exclude-categories="excludeCategories"
      :width="popupWidth"
      :height="popupHeight"
      :columns="columns"
      :show-category-tabs="showCategoryTabs"
      @select="handleSelect"
      @cancel="close"
    />
  </div>
</template>

<style scoped>
.t-icon-selector {
  display: inline-flex;
  width: 100%;
}

.t-icon-trigger {
  /* 与 antd Input 保持一致 - 无边框阴影 */
  box-shadow: none !important;
}

.t-icon-trigger:hover:not(:disabled) {
  border-color: hsl(var(--primary) / 0.5);
}

.t-icon-trigger:focus-visible {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: none !important;
}

.t-icon-selected-wrapper,
.t-icon-empty-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: calc(var(--radius) - 6px);
  background: linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.05) 100%);
  border: 1px solid hsl(var(--primary) / 0.15);
  transition: all 0.2s ease;
}

.t-icon-empty-wrapper {
  background: hsl(var(--muted) / 0.5);
  border-color: hsl(var(--border) / 0.5);
}

.t-icon-trigger:hover .t-icon-selected-wrapper {
  background: linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.08) 100%);
  border-color: hsl(var(--primary) / 0.25);
  transform: scale(1.05);
}

.t-icon-trigger:hover .t-icon-empty-wrapper {
  background: hsl(var(--muted));
  border-color: hsl(var(--border));
}

.t-icon-clear {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.15s ease;
}

.t-icon-trigger:hover .t-icon-clear {
  opacity: 1;
  transform: scale(1);
}

.t-icon-clear:hover {
  transform: scale(1.1) !important;
}

.t-icon-trigger :deep(.truncate) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
