<script setup lang="ts">
import {
  Command,
  Search,
  X,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

const searchQuery = ref('')
const isSearchFocused = ref(false)
const isSearchExpanded = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

/**
 * 是否展开搜索框
 */
const isExpanded = defineModel<boolean>('expanded', { default: false })

/**
 * 处理搜索
 */
function handleSearch() {
  isExpanded.value = true
}

/**
 * 展开搜索框（移动端/平板）
 */
async function expandSearch() {
  isSearchExpanded.value = true
  await nextTick()
  searchInputRef.value?.focus()
}

/**
 * 关闭搜索框
 */
function collapseSearch() {
  isSearchExpanded.value = false
  searchQuery.value = ''
}

/**
 * 处理键盘快捷键
 */
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isExpanded.value = true
  }

  if (e.key === 'Escape' && isSearchExpanded.value) {
    collapseSearch()
  }
}

/**
 * 点击外部关闭搜索
 */
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (isSearchExpanded.value && !target.closest('.search-container')) {
    collapseSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- 搜索框 - 桌面端 -->
  <div
    class="search-container hidden md:flex items-center gap-2 transition-all duration-300 ease-out rounded-xl px-3 py-1.5 border"
    :class="[
      isSearchFocused
        ? 'bg-background border-primary/30 w-72 ring-2 ring-primary/10'
        : 'bg-muted/60 border-transparent w-56 hover:bg-muted hover:border-border/50',
    ]"
  >
    <Search class="h-4 w-4 text-muted-foreground flex-shrink-0" />
    <input
      ref="searchInputRef"
      v-model="searchQuery"
      type="text"
      :placeholder="t('common.header.search')"
      class="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
      @focus="isSearchFocused = true"
      @blur="isSearchFocused = false"
      @keyup.enter="handleSearch"
    >
    <kbd class="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex-shrink-0">
      <Command class="h-3 w-3" />
      <span>K</span>
    </kbd>
  </div>

  <!-- 搜索按钮 - 移动端/平板 -->
  <Button
    variant="ghost"
    size="icon"
    class="md:hidden h-8 w-8 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
    @click="expandSearch"
  >
    <Search class="h-4 w-4" />
  </Button>

  <!-- 移动端展开的搜索框 -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isSearchExpanded"
      class="search-container fixed inset-x-4 top-14 z-50 md:hidden flex items-center gap-2 bg-background border rounded-lg px-3 py-2"
    >
      <Search class="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <input
        ref="searchInputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="t('common.header.search')"
        class="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
        @keyup.enter="handleSearch"
      >
      <Button
        variant="ghost"
        size="icon"
        class="h-6 w-6 rounded flex-shrink-0"
        @click="collapseSearch"
      >
        <X class="h-3 w-3" />
      </Button>
    </div>
  </Transition>

  <!-- 遮罩层 -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isSearchExpanded"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="collapseSearch"
    />
  </Transition>
</template>
