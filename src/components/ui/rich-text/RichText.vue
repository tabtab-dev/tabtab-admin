<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Code, Undo, Redo } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  disabled: false,
  readonly: false,
  minHeight: '200px',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement>()
const isFocused = ref(false)

// 编辑器内容
const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 当前选中的格式
const activeFormats = ref<string[]>([])

// 更新当前格式
function updateActiveFormats() {
  if (!editorRef.value) return
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const formats: string[] = []
  if (document.queryCommandState('bold')) formats.push('bold')
  if (document.queryCommandState('italic')) formats.push('italic')
  if (document.queryCommandState('underline')) formats.push('underline')
  if (document.queryCommandState('strikeThrough')) formats.push('strikeThrough')
  if (document.queryCommandState('insertUnorderedList')) formats.push('unorderedList')
  if (document.queryCommandState('insertOrderedList')) formats.push('orderedList')
  if (document.queryCommandState('blockquote')) formats.push('blockquote')
  if (document.queryCommandState('insertCode')) formats.push('code')

  activeFormats.value = formats
}

// 执行编辑器命令
function execCommand(command: string, value: string = '') {
  if (props.disabled || props.readonly) return
  document.execCommand(command, false, value)
  updateActiveFormats()
  if (editorRef.value) {
    content.value = editorRef.value.innerHTML
  }
}

// 处理输入
function handleInput() {
  if (editorRef.value) {
    content.value = editorRef.value.innerHTML
  }
}

// 处理粘贴（纯文本）
function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.innerHTML !== newValue) {
    editorRef.value.innerHTML = newValue
  }
}, { immediate: true })
</script>

<template>
  <div
    class="border rounded-md overflow-hidden"
    :class="{
      'border-input': !isFocused,
      'border-ring ring-1 ring-ring': isFocused,
      'opacity-50': disabled,
    }"
  >
    <!-- 工具栏 -->
    <div
      class="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50"
      :class="{ 'pointer-events-none': disabled || readonly }"
    >
      <ToggleGroup
        type="multiple"
        :model-value="activeFormats"
        @update:model-value="updateActiveFormats"
        class="flex flex-wrap gap-1"
      >
        <ToggleGroupItem
          value="bold"
          size="sm"
          @click="execCommand('bold')"
        >
          <Bold class="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          size="sm"
          @click="execCommand('italic')"
        >
          <Italic class="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          size="sm"
          @click="execCommand('underline')"
        >
          <Underline class="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strikeThrough"
          size="sm"
          @click="execCommand('strikeThrough')"
        >
          <Strikethrough class="w-4 h-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <div class="w-px h-6 bg-border mx-1" />

      <ToggleGroup
        type="single"
        :model-value="activeFormats.find(f => f === 'unorderedList' || f === 'orderedList')"
        class="flex gap-1"
      >
        <ToggleGroupItem
          value="unorderedList"
          size="sm"
          @click="execCommand('insertUnorderedList')"
        >
          <List class="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="orderedList"
          size="sm"
          @click="execCommand('insertOrderedList')"
        >
          <ListOrdered class="w-4 h-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <div class="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        @click="execCommand('blockquote')"
      >
        <Quote class="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        @click="execCommand('insertCode')"
      >
        <Code class="w-4 h-4" />
      </Button>

      <div class="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        @click="execCommand('undo')"
      >
        <Undo class="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        @click="execCommand('redo')"
      >
        <Redo class="w-4 h-4" />
      </Button>
    </div>

    <!-- 编辑器区域 -->
    <div
      ref="editorRef"
      contenteditable
      class="p-3 outline-none min-h-[200px] prose prose-sm max-w-none"
      :class="{ 'pointer-events-none': disabled || readonly }"
      :style="{ minHeight }"
      :placeholder="placeholder"
      @input="handleInput"
      @paste="handlePaste"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @mouseup="updateActiveFormats"
      @keyup="updateActiveFormats"
    />
  </div>
</template>

<style scoped>
[contenteditable]:empty:before {
  content: attr(placeholder);
  color: hsl(var(--muted-foreground));
  pointer-events: none;
}
</style>
