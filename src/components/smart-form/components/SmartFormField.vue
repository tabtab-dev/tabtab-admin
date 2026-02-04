<script setup lang="ts" generic="T extends GenericObject">
import { computed } from 'vue'
import { Field, type GenericObject } from 'vee-validate'
import { Eye, EyeOff, Calendar as CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import type { FormFieldConfig } from '../types'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * SmartFormField 组件 - 单个表单字段渲染器
 */
const props = defineProps<{
  /** 字段配置 */
  field: FormFieldConfig<T>
  /** 是否显示标签 */
  showLabels: boolean
  /** 是否显示描述 */
  showDescriptions: boolean
  /** 字段状态 */
  fieldState: { visible: boolean; disabled: boolean }
  /** 密码可见性状态 */
  passwordVisible: boolean
  /** 日期选择器打开状态 */
  datePickerOpen: boolean
}>()

const emit = defineEmits<{
  /** 切换密码可见性 */
  (e: 'toggle-password', fieldName: string): void
  /** 更新日期选择器状态 */
  (e: 'update:date-picker-open', open: boolean): void
}>()

/**
 * 字段名（字符串形式）
 */
const fieldName = computed(() => String(props.field.name))

/**
 * 是否显示标签
 */
const shouldShowLabel = computed(() => {
  return props.showLabels &&
    props.field.type !== 'checkbox' &&
    props.field.type !== 'switch' &&
    props.field.label
})

/**
 * 格式化日期
 */
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'yyyy-MM-dd', { locale: zhCN })
}

/**
 * 处理密码可见性切换
 */
const handleTogglePassword = () => {
  emit('toggle-password', fieldName.value)
}

/**
 * 处理日期选择器关闭
 */
const handleDateSelect = (date: Date | undefined, onChange: (value: string) => void) => {
  onChange(date ? formatDate(date) : '')
  emit('update:date-picker-open', false)
}

/**
 * 处理日期范围选择器关闭
 */
const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined, onChange: (value: unknown) => void) => {
  onChange(range)
  if (range?.from && range?.to) {
    emit('update:date-picker-open', false)
  }
}

/**
 * 处理复选框/开关点击
 */
const handleToggleClick = (
  currentValue: boolean,
  onChange: (value: boolean) => void
) => {
  if (!props.field.disabled && !props.fieldState.disabled) {
    onChange(!currentValue)
  }
}

/**
 * 处理文件选择
 */
const handleFileChange = (event: Event, onChange: (value: File | null) => void) => {
  const target = event.target as HTMLInputElement
  onChange(target.files?.[0] ?? null)
}

/**
 * 处理数字输入
 */
const handleNumberChange = (value: string, onChange: (value: number | undefined) => void) => {
  onChange(value === '' ? undefined : Number(value))
}

/**
 * 处理滑块值变化
 */
const handleSliderChange = (value: number[], onChange: (value: number) => void) => {
  onChange(value[0])
}
</script>

<template>
  <Field
    v-slot="{ field: fieldProps, errorMessage }"
    :name="field.name"
  >
    <FormItem :class="field.colSpan ? `col-span-${field.colSpan}` : ''">
      <!-- 标签 -->
      <FormLabel v-if="shouldShowLabel">
        {{ field.label }}
        <span v-if="field.required" class="text-destructive ml-1">*</span>
      </FormLabel>

      <!-- 输入控件 -->
      <FormControl>
        <!-- 文本/邮箱输入 -->
        <div
          v-if="field.type === 'text' || field.type === 'email'"
          class="relative flex items-center"
        >
          <component
            :is="field.prefixIcon"
            v-if="field.prefixIcon"
            class="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none"
          />
          <Input
            :type="field.type"
            :model-value="fieldProps.value as string"
            @update:model-value="fieldProps.onChange"
            :placeholder="field.placeholder"
            :disabled="fieldState.disabled || fieldProps.disabled"
            :readonly="field.readonly"
            @blur="fieldProps.onBlur"
            :class="field.prefixIcon ? 'pl-10' : ''"
          />
        </div>

        <!-- 密码输入 -->
        <div
          v-else-if="field.type === 'password'"
          class="relative flex items-center"
        >
          <component
            :is="field.prefixIcon"
            v-if="field.prefixIcon"
            class="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none"
          />
          <Input
            :type="passwordVisible ? 'text' : 'password'"
            :model-value="fieldProps.value as string"
            @update:model-value="fieldProps.onChange"
            :placeholder="field.placeholder"
            :disabled="fieldState.disabled || fieldProps.disabled"
            :readonly="field.readonly"
            @blur="fieldProps.onBlur"
            :class="`${field.prefixIcon ? 'pl-10' : ''} pr-10`"
          />
          <button
            type="button"
            class="absolute right-3 flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            @click="handleTogglePassword"
          >
            <component :is="passwordVisible ? EyeOff : Eye" class="w-4 h-4" />
          </button>
        </div>

        <!-- 数字输入 -->
        <Input
          v-else-if="field.type === 'number'"
          type="number"
          :model-value="fieldProps.value as number"
          @update:model-value="(val: string) => handleNumberChange(val, fieldProps.onChange)"
          :placeholder="field.placeholder"
          :disabled="fieldState.disabled || fieldProps.disabled"
          :readonly="field.readonly"
          @blur="fieldProps.onBlur"
        />

        <!-- 文本域 -->
        <Textarea
          v-else-if="field.type === 'textarea'"
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :placeholder="field.placeholder"
          :disabled="fieldState.disabled || fieldProps.disabled"
          :readonly="field.readonly"
          @blur="fieldProps.onBlur"
        />

        <!-- 下拉选择 -->
        <Select
          v-else-if="field.type === 'select'"
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :disabled="fieldState.disabled || fieldProps.disabled"
        >
          <SelectTrigger>
            <SelectValue :placeholder="field.placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in field.options"
              :key="opt.value"
              :value="opt.value as string"
              :disabled="opt.disabled"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <!-- 多选下拉 -->
        <Select
          v-else-if="field.type === 'multi-select'"
          :model-value="fieldProps.value as string[]"
          @update:model-value="fieldProps.onChange"
          :disabled="fieldState.disabled || fieldProps.disabled"
          multiple
        >
          <SelectTrigger class="h-auto min-h-10">
            <div class="flex flex-wrap gap-1">
              <template v-if="(fieldProps.value as string[])?.length">
                <Badge
                  v-for="v in (fieldProps.value as string[])"
                  :key="v"
                  variant="secondary"
                  class="mr-1"
                >
                  {{ field.options?.find(o => o.value === v)?.label || v }}
                </Badge>
              </template>
              <span v-else class="text-muted-foreground">{{ field.placeholder || '请选择' }}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in field.options"
              :key="opt.value"
              :value="opt.value as string"
              :disabled="opt.disabled"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <!-- 复选框 -->
        <div v-else-if="field.type === 'checkbox'" class="flex items-center space-x-2">
          <Checkbox
            :checked="fieldProps.value as boolean"
            @update:checked="fieldProps.onChange"
            :disabled="fieldState.disabled || fieldProps.disabled"
          />
          <Label
            v-if="field.label"
            class="text-sm font-normal cursor-pointer"
            @click="handleToggleClick(fieldProps.value as boolean, fieldProps.onChange)"
          >
            {{ field.label }}
          </Label>
        </div>

        <!-- 开关 -->
        <div v-else-if="field.type === 'switch'" class="flex items-center space-x-2">
          <Switch
            :checked="fieldProps.value as boolean"
            @update:checked="fieldProps.onChange"
            :disabled="fieldState.disabled || fieldProps.disabled"
          />
          <Label
            v-if="field.label"
            class="text-sm font-normal cursor-pointer"
            @click="handleToggleClick(fieldProps.value as boolean, fieldProps.onChange)"
          >
            {{ field.label }}
          </Label>
        </div>

        <!-- 单选框 -->
        <RadioGroup
          v-else-if="field.type === 'radio'"
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :disabled="fieldState.disabled || fieldProps.disabled"
          class="flex flex-col space-y-2"
        >
          <div v-for="opt in field.options" :key="opt.value" class="flex items-center space-x-2">
            <RadioGroupItem :value="opt.value as string" :id="`${fieldName}-${opt.value}`" />
            <Label :for="`${fieldName}-${opt.value}`" class="text-sm font-normal cursor-pointer">
              {{ opt.label }}
            </Label>
          </div>
        </RadioGroup>

        <!-- 日期选择器 -->
        <Popover
          v-else-if="field.type === 'date'"
          :open="datePickerOpen"
          @update:open="$emit('update:date-picker-open', $event)"
        >
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="`w-full justify-start text-left font-normal ${!fieldProps.value ? 'text-muted-foreground' : ''}`"
              :disabled="fieldState.disabled || fieldProps.disabled"
            >
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ fieldProps.value ? formatDate(fieldProps.value as string) : field.placeholder || '选择日期' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="start">
            <Calendar
              :model-value="fieldProps.value ? new Date(fieldProps.value as string) : undefined"
              @update:model-value="(date) => handleDateSelect(date, fieldProps.onChange)"
              locale="zh-CN"
            />
          </PopoverContent>
        </Popover>

        <!-- 日期范围选择器 -->
        <Popover
          v-else-if="field.type === 'date-range'"
          :open="datePickerOpen"
          @update:open="$emit('update:date-picker-open', $event)"
        >
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="`w-full justify-start text-left font-normal ${!(fieldProps.value as any)?.from ? 'text-muted-foreground' : ''}`"
              :disabled="fieldState.disabled || fieldProps.disabled"
            >
              <CalendarIcon class="mr-2 h-4 w-4" />
              <template v-if="(fieldProps.value as any)?.from">
                {{ formatDate((fieldProps.value as any).from) }} - {{ formatDate((fieldProps.value as any).to) }}
              </template>
              <template v-else>
                {{ field.placeholder || '选择日期范围' }}
              </template>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="start">
            <RangeCalendar
              :model-value="fieldProps.value as any"
              @update:model-value="(range) => handleRangeSelect(range, fieldProps.onChange)"
              locale="zh-CN"
            />
          </PopoverContent>
        </Popover>

        <!-- 滑块 -->
        <div v-else-if="field.type === 'slider'" class="py-4">
          <Slider
            :model-value="[(fieldProps.value as number) ?? (field.sliderConfig?.min ?? 0)]"
            @update:model-value="(val) => handleSliderChange(val, fieldProps.onChange)"
            :min="field.sliderConfig?.min ?? 0"
            :max="field.sliderConfig?.max ?? 100"
            :step="field.sliderConfig?.step ?? 1"
            :disabled="fieldState.disabled || fieldProps.disabled"
          />
          <div class="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{{ field.sliderConfig?.min ?? 0 }}</span>
            <span class="font-medium text-foreground">{{ fieldProps.value ?? (field.sliderConfig?.min ?? 0) }}</span>
            <span>{{ field.sliderConfig?.max ?? 100 }}</span>
          </div>
        </div>

        <!-- 标签输入 -->
        <TagsInput
          v-else-if="field.type === 'tags'"
          :model-value="(fieldProps.value as string[]) || []"
          @update:model-value="fieldProps.onChange"
          :disabled="fieldState.disabled || fieldProps.disabled"
        >
          <TagsInputItem v-for="item in (fieldProps.value as string[]) || []" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput :placeholder="field.placeholder || '输入标签后按回车'" />
        </TagsInput>

        <!-- OTP 输入 -->
        <InputOTP
          v-else-if="field.type === 'otp'"
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :maxlength="field.otpConfig?.length ?? 6"
          :disabled="fieldState.disabled || fieldProps.disabled"
        >
          <InputOTPGroup>
            <InputOTPSlot
              v-for="i in (field.otpConfig?.length ?? 6)"
              :key="i"
              :index="i"
            />
          </InputOTPGroup>
        </InputOTP>

        <!-- PIN 输入 -->
        <InputOTP
          v-else-if="field.type === 'pin'"
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :maxlength="field.otpConfig?.length ?? 4"
          mask
          :disabled="fieldState.disabled || fieldProps.disabled"
        >
          <InputOTPGroup>
            <InputOTPSlot
              v-for="i in (field.otpConfig?.length ?? 4)"
              :key="i"
              :index="i"
            />
          </InputOTPGroup>
        </InputOTP>

        <!-- 切换按钮组 -->
        <ToggleGroup
          v-else-if="field.type === 'toggle-group'"
          :model-value="fieldProps.value as string[]"
          @update:model-value="fieldProps.onChange"
          type="multiple"
          :disabled="fieldState.disabled || fieldProps.disabled"
        >
          <ToggleGroupItem
            v-for="opt in field.options"
            :key="opt.value"
            :value="opt.value as string"
          >
            {{ opt.label }}
          </ToggleGroupItem>
        </ToggleGroup>

        <!-- 日期时间 -->
        <Input
          v-else-if="field.type === 'datetime'"
          type="datetime-local"
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :placeholder="field.placeholder"
          :disabled="fieldState.disabled || fieldProps.disabled"
          :readonly="field.readonly"
          @blur="fieldProps.onBlur"
        />

        <!-- 时间 -->
        <Input
          v-else-if="field.type === 'time'"
          type="time"
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :placeholder="field.placeholder"
          :disabled="fieldState.disabled || fieldProps.disabled"
          :readonly="field.readonly"
          @blur="fieldProps.onBlur"
        />

        <!-- 文件 -->
        <Input
          v-else-if="field.type === 'file'"
          type="file"
          @change="(e: Event) => handleFileChange(e, fieldProps.onChange)"
          :placeholder="field.placeholder"
          :disabled="fieldState.disabled || fieldProps.disabled"
          :readonly="field.readonly"
          @blur="fieldProps.onBlur"
        />

        <!-- 自定义组件 -->
        <component
          v-else-if="field.type === 'custom' && field.component"
          :is="field.component"
          :model-value="fieldProps.value"
          @update:model-value="fieldProps.onChange"
          :disabled="fieldState.disabled || fieldProps.disabled"
          :readonly="field.readonly"
          :placeholder="field.placeholder"
          @blur="fieldProps.onBlur"
          v-bind="field.componentProps"
        />

        <!-- 默认文本输入 -->
        <Input
          v-else
          :model-value="fieldProps.value as string"
          @update:model-value="fieldProps.onChange"
          :placeholder="field.placeholder"
          :disabled="fieldState.disabled || fieldProps.disabled"
          :readonly="field.readonly"
          @blur="fieldProps.onBlur"
        />
      </FormControl>

      <!-- 描述文字 -->
      <FormDescription v-if="showDescriptions && field.description">
        {{ field.description }}
      </FormDescription>

      <!-- 错误信息 -->
      <FormMessage />
    </FormItem>
  </Field>
</template>
