<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import * as icons from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Modal } from 'antdv-next'
import { Search, X, Smile } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { ICON_CATEGORIES, getCategoryName } from './constants'
import type { TIconPickerProps, TIconPickerEmits, IconItem } from './types'

const props = withDefaults(defineProps<TIconPickerProps>(), {
  width: 720,
  height: 480,
  columns: 8,
  showCategoryTabs: true,
})

const emit = defineEmits<TIconPickerEmits>()

const { t } = useI18n()

const searchQuery = ref('')
const localSelectedIcon = ref(props.selectedIcon || '')
const activeTab = ref('all')

watch(() => props.selectedIcon, (newVal) => {
  localSelectedIcon.value = newVal || ''
})

watch(() => props.visible, (visible) => {
  if (visible) {
    searchQuery.value = ''
    nextTick(() => {
      scrollToSelected()
    })
  }
})

const filteredCategories = computed(() => {
  let categories = ICON_CATEGORIES

  if (props.categories && props.categories.length > 0) {
    categories = categories.filter(cat => props.categories!.includes(cat.key))
  }
  if (props.excludeCategories && props.excludeCategories.length > 0) {
    categories = categories.filter(cat => !props.excludeCategories!.includes(cat.key))
  }

  return categories
})

const allIcons = computed<IconItem[]>(() => {
  const iconList: IconItem[] = []

  filteredCategories.value.forEach((category) => {
    category.icons.forEach((iconName) => {
      const component = (icons as Record<string, unknown>)[iconName]
      if (component) {
        iconList.push({
          name: iconName,
          component: component as IconItem['component'],
          category: category.key,
        })
      }
    })
  })

  return iconList
})

const filteredIcons = computed<IconItem[]>(() => {
  let icons = allIcons.value

  if (activeTab.value !== 'all') {
    icons = icons.filter(icon => icon.category === activeTab.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    icons = icons.filter(icon =>
      icon.name.toLowerCase().includes(query)
    )
  }

  return icons
})

const groupedIcons = computed(() => {
  const groups: Record<string, IconItem[]> = {}

  filteredIcons.value.forEach((icon) => {
    if (!groups[icon.category]) {
      groups[icon.category] = []
    }
    groups[icon.category].push(icon)
  })

  return groups
})

const totalIconCount = computed(() => allIcons.value.length)
const filteredIconCount = computed(() => filteredIcons.value.length)

function handleSelect(iconName: string) {
  localSelectedIcon.value = iconName
  emit('select', iconName)
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}

function clearSearch() {
  searchQuery.value = ''
}

function scrollToSelected() {
  const element = document.querySelector('[data-selected="true"]')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function getIconComponent(name: string) {
  return (icons as Record<string, unknown>)[name] as IconItem['component']
}
</script>

<template>
  <Modal
    :open="visible"
    :title="null"
    :footer="null"
    :closable="false"
    :mask-closable="true"
    :width="width"
    :z-index="9999"
    @cancel="handleCancel"
  >
    <div
      class="t-icon-picker-modal flex flex-col overflow-hidden"
      :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    >
      <!-- 头部：标题和搜索 -->
      <div class="px-4 py-3 border-b bg-gradient-to-r from-background to-muted/30 shrink-0">
        <div class="flex items-center justify-between mb-2">
          <div class="text-base font-semibold flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smile class="w-3.5 h-3.5 text-primary" />
            </div>
            {{ t('icon.selectTitle', '选择图标') }}
          </div>
          <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {{ filteredIconCount }} / {{ totalIconCount }}
          </span>
        </div>

        <!-- 搜索框 -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            v-model="searchQuery"
            :placeholder="t('icon.searchPlaceholder', '搜索图标...')"
            class="pl-9 pr-9 h-9 bg-muted/50 border-muted-foreground/20 focus:bg-background"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
            @click="clearSearch"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- 分类标签页 -->
      <div v-if="showCategoryTabs && !searchQuery" class="border-b px-4 bg-muted/20 shrink-0">
        <Tabs v-model="activeTab" class="w-full">
          <ScrollArea class="w-full" orientation="horizontal">
            <TabsList class="w-max justify-start h-10 bg-transparent p-0 gap-1">
              <TabsTrigger
                value="all"
                class="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary text-xs px-3 py-1.5 h-7 rounded-md border border-transparent data-[state=active]:border-border transition-all whitespace-nowrap"
              >
                {{ t('icon.categoryAll', '全部') }}
              </TabsTrigger>
              <TabsTrigger
                v-for="cat in filteredCategories"
                :key="cat.key"
                :value="cat.key"
                class="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary text-xs px-3 py-1.5 h-7 rounded-md border border-transparent data-[state=active]:border-border transition-all whitespace-nowrap"
              >
                {{ t(`icon.category.${cat.key}`, cat.name) }}
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </Tabs>
      </div>

      <!-- 图标列表区域 -->
      <ScrollArea class="flex-1 min-h-0 bg-background">
        <div class="p-4">
          <!-- 搜索结果为空 -->
          <div
            v-if="filteredIcons.length === 0"
            class="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Search class="h-8 w-8 opacity-30" />
            </div>
            <p class="text-sm font-medium">{{ t('icon.noResults', '未找到匹配的图标') }}</p>
            <p class="text-xs text-muted-foreground/60 mt-1">{{ t('icon.tryDifferentKeyword', '尝试使用其他关键词') }}</p>
          </div>

          <!-- 按分类显示图标 -->
          <template v-else-if="showCategoryTabs && activeTab === 'all' && !searchQuery">
            <div
              v-for="(icons, categoryKey) in groupedIcons"
              :key="categoryKey"
              class="mb-6 last:mb-0"
            >
              <h4 class="text-xs font-semibold text-muted-foreground/80 mb-3 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                <span class="w-1 h-3.5 rounded-full bg-primary/60" />
                {{ t(`icon.category.${categoryKey}`, getCategoryName(categoryKey)) }}
                <span class="text-muted-foreground/40 font-normal">({{ icons.length }})</span>
              </h4>
              <div
                class="grid gap-1.5"
                :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
              >
                <button
                  v-for="icon in icons"
                  :key="icon.name"
                  type="button"
                  :data-selected="localSelectedIcon === icon.name"
                  :class="cn(
                    't-icon-item flex items-center justify-center',
                    'w-full aspect-square rounded-lg border-2',
                    'bg-muted/30 hover:bg-accent hover:border-accent-foreground/30',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                    localSelectedIcon === icon.name && 'bg-primary/10 border-primary text-primary shadow-md scale-105'
                  )"
                  :title="icon.name"
                  @click="handleSelect(icon.name)"
                >
                  <component
                    :is="icon.component"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="localSelectedIcon === icon.name && 'scale-110'"
                  />
                </button>
              </div>
            </div>
          </template>

          <!-- 单一分类或搜索结果 -->
          <div
            v-else
            class="grid gap-1.5"
            :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
          >
            <button
              v-for="icon in filteredIcons"
              :key="icon.name"
              type="button"
              :data-selected="localSelectedIcon === icon.name"
              :class="cn(
                't-icon-item flex items-center justify-center',
                'w-full aspect-square rounded-lg border-2',
                'bg-muted/30 hover:bg-accent hover:border-accent-foreground/30',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                localSelectedIcon === icon.name && 'bg-primary/10 border-primary text-primary shadow-md scale-105'
              )"
              :title="icon.name"
              @click="handleSelect(icon.name)"
            >
              <component
                :is="icon.component"
                class="h-4 w-4 transition-transform duration-200"
                :class="localSelectedIcon === icon.name && 'scale-110'"
              />
            </button>
          </div>
        </div>
      </ScrollArea>

      <!-- 底部：已选图标和操作按钮 -->
      <div class="px-4 py-3 border-t gap-3 bg-muted/20 shrink-0 flex items-center justify-between">
        <div class="flex-1 flex items-center gap-2 min-w-0">
          <span class="text-xs text-muted-foreground font-medium shrink-0">{{ t('icon.selected', '已选') }}:</span>
          <div
            v-if="localSelectedIcon"
            class="flex items-center gap-2 px-2.5 py-1 bg-background rounded-lg border shadow-sm min-w-0"
          >
            <component
              :is="getIconComponent(localSelectedIcon)"
              class="h-4 w-4 text-primary shrink-0"
            />
            <span class="text-xs font-semibold truncate">{{ localSelectedIcon }}</span>
          </div>
          <span v-else class="text-xs text-muted-foreground/60 italic">{{ t('icon.notSelected', '未选择') }}</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" class="px-3" @click="handleCancel">
            {{ t('common.cancel', '取消') }}
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.t-icon-picker-modal {
  border-radius: calc(var(--radius) + 4px);
}

.t-icon-item {
  min-height: 36px;
  position: relative;
  overflow: hidden;
}

.t-icon-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.t-icon-item:hover::before {
  opacity: 1;
}

.t-icon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -2px hsl(var(--primary) / 0.15);
}

.t-icon-item:active {
  transform: translateY(0);
}

.t-icon-item[data-selected="true"] {
  animation: iconSelect 0.3s ease;
}

@keyframes iconSelect {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.05);
  }
}

/* 横向滚动条样式 */
:deep([data-orientation="horizontal"]) {
  padding-bottom: 4px;
}

:deep([data-orientation="horizontal"] > div) {
  padding-bottom: 2px;
}
</style>
