<script setup lang="ts">
import { Check, CircleDot, Download, FolderTree, Github, Layout, Monitor, Moon, Palette, PanelLeft, PanelTop, Sun, Type } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { Slider } from '@/components/ui/slider'

import { Switch } from '@/components/ui/switch'
import { useThemeStore } from '@/stores/global/theme'

const { t } = useI18n()
const themeStore = useThemeStore()

/**
 * 复制成功状态
 */
const copied = ref(false)

/**
 * 主题颜色映射（用于显示色块）
 */
const themeColorMap: Record<string, string> = {
  default: 'bg-neutral-500',
  slate: 'bg-slate-500',
  stone: 'bg-stone-500',
  red: 'bg-red-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
}

/**
 * 更新圆角
 */
function updateRadius(value: number[]) {
  themeStore.updateLayoutConfig({ radius: value[0] })
}

/**
 * 更新侧边栏宽度
 */
function updateSidebarWidth(value: number[]) {
  themeStore.updateLayoutConfig({ sidebarWidth: value[0] })
}

/**
 * 更新字体大小
 */
function updateFontSize(value: number) {
  themeStore.updateLayoutConfig({ fontSize: value })
}

/**
 * 更新动画开关
 */
function updateAnimations(value: boolean) {
  themeStore.updateLayoutConfig({ animations: value })
}

/**
 * 更新侧边栏折叠状态
 */
function updateSidebarCollapsed(value: boolean) {
  themeStore.updateLayoutConfig({ sidebarCollapsed: value })
}

/**
 * 更新标签栏显示状态
 */
function updateShowTabBar(value: boolean) {
  themeStore.updateLayoutConfig({ showTabBar: value })
}

/**
 * 更新面包屑显示状态
 */
function updateShowBreadcrumb(value: boolean) {
  themeStore.updateLayoutConfig({ showBreadcrumb: value })
}

/**
 * 更新固定标签栏状态
 */
function updateFixedTabBar(value: boolean) {
  themeStore.updateLayoutConfig({ fixedTabBar: value })
}

/**
 * 更新 GitHub 显示状态
 */
function updateShowGithub(value: boolean) {
  themeStore.updateLayoutConfig({ showGithub: value })
}

/**
 * 更新 GitHub URL
 */
function updateGithubUrl(value: string) {
  themeStore.updateLayoutConfig({ githubUrl: value })
}

/**
 * 生成主题配置代码
 * @returns 可用于 theme.config.ts 的配置代码
 */
function generateThemeConfigCode(): string {
  const layout = themeStore.layoutConfig
  const config = {
    theme: themeStore.currentTheme,
    mode: themeStore.currentMode,
    layout: {
      sidebarWidth: layout.sidebarWidth,
      sidebarCollapsed: layout.sidebarCollapsed,
      radius: layout.radius,
      fontSize: layout.fontSize,
      animations: layout.animations,
      showTabBar: layout.showTabBar,
      showBreadcrumb: layout.showBreadcrumb,
      fixedTabBar: layout.fixedTabBar,
      showGithub: layout.showGithub,
      githubUrl: layout.githubUrl,
    },
    customThemes: {},
  }
  return JSON.stringify(config, null, 2)
}

/**
 * 复制配置到剪贴板
 */
async function copyConfig() {
  const code = generateThemeConfigCode()
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 外观模式 -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <Monitor class="h-4 w-4 text-muted-foreground" />
        <span>{{ t('common.theme.appearance') }}</span>
      </div>
      <div class="flex gap-2">
        <Button
          v-for="mode in ['light', 'dark'] as const"
          :key="mode"
          variant="outline"
          size="sm"
          class="flex-1 transition-all duration-200"
          :class="themeStore.currentMode === mode ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20' : 'hover:border-primary/50'"
          @click="themeStore.setMode(mode)"
        >
          <Sun v-if="mode === 'light'" class="h-4 w-4 mr-1.5" />
          <Moon v-else class="h-4 w-4 mr-1.5" />
          {{ mode === 'light' ? t('common.theme.light') : t('common.theme.dark') }}
        </Button>
      </div>
    </div>

    <!-- 主题配色 -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <Palette class="h-4 w-4 text-muted-foreground" />
        <span>{{ t('common.theme.color') }}</span>
      </div>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="theme in themeStore.availableThemes"
          :key="theme.key"
          class="group flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-200"
          :class="themeStore.currentTheme === theme.key ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-border hover:border-primary/50'"
          @click="themeStore.setTheme(theme.key)"
        >
          <div
            class="w-6 h-6 rounded-full transition-transform duration-200 group-hover:scale-110"
            :class="themeColorMap[theme.key] || 'bg-gray-500'"
          />
          <span class="text-xs" :class="themeStore.currentTheme === theme.key ? 'text-primary font-medium' : 'text-muted-foreground'">{{ t(`common.theme.colors.${theme.key}`) }}</span>
        </button>
      </div>
    </div>

    <!-- 布局设置 -->
    <div class="space-y-4">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <Layout class="h-4 w-4 text-muted-foreground" />
        <span>{{ t('common.theme.layout') }}</span>
      </div>

      <!-- 侧边栏宽度 -->
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <Label class="text-muted-foreground">{{ t('common.theme.sidebarWidth') }}</Label>
          <span class="text-xs font-medium bg-muted px-2 py-0.5 rounded">{{ themeStore.layoutConfig.sidebarWidth }}px</span>
        </div>
        <Slider
          :model-value="[themeStore.layoutConfig.sidebarWidth]"
          :min="200"
          :max="400"
          :step="10"
          class="cursor-pointer"
          @update:model-value="updateSidebarWidth"
        />
      </div>

      <!-- 圆角大小 -->
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <Label class="text-muted-foreground">{{ t('common.theme.radius') }}</Label>
          <span class="text-xs font-medium bg-muted px-2 py-0.5 rounded">{{ themeStore.layoutConfig.radius }}rem</span>
        </div>
        <Slider
          :model-value="[themeStore.layoutConfig.radius]"
          :min="0"
          :max="1.5"
          :step="0.125"
          class="cursor-pointer"
          @update:model-value="updateRadius"
        />
      </div>

      <!-- 侧边栏折叠 -->
      <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div class="flex items-center gap-2 text-sm font-medium text-foreground">
          <PanelLeft class="h-4 w-4 text-muted-foreground" />
          <span>{{ t('common.theme.sidebarCollapsed') }}</span>
        </div>
        <Switch
          :model-value="themeStore.layoutConfig.sidebarCollapsed"
          @update:model-value="updateSidebarCollapsed"
        />
      </div>

      <!-- 标签栏显示 -->
      <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div class="flex items-center gap-2 text-sm font-medium text-foreground">
          <PanelTop class="h-4 w-4 text-muted-foreground" />
          <span>{{ t('common.theme.showTabBar') }}</span>
        </div>
        <Switch
          :model-value="themeStore.layoutConfig.showTabBar"
          @update:model-value="updateShowTabBar"
        />
      </div>

      <!-- 固定标签栏 -->
      <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div class="flex items-center gap-2 text-sm font-medium text-foreground">
          <PanelTop class="h-4 w-4 text-muted-foreground" />
          <span>{{ t('common.theme.fixedTabBar') }}</span>
        </div>
        <Switch
          :model-value="themeStore.layoutConfig.fixedTabBar"
          @update:model-value="updateFixedTabBar"
        />
      </div>

      <!-- 面包屑显示 -->
      <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div class="flex items-center gap-2 text-sm font-medium text-foreground">
          <FolderTree class="h-4 w-4 text-muted-foreground" />
          <span>{{ t('common.theme.showBreadcrumb') }}</span>
        </div>
        <Switch
          :model-value="themeStore.layoutConfig.showBreadcrumb"
          @update:model-value="updateShowBreadcrumb"
        />
      </div>
    </div>

    <!-- 字体设置 -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <Type class="h-4 w-4 text-muted-foreground" />
        <span>{{ t('common.theme.fontSize') }}</span>
      </div>
      <NumberField
        :model-value="themeStore.layoutConfig.fontSize"
        :min="12"
        :max="24"
        :step="1"
        @update:model-value="updateFontSize"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>

    <!-- 动画设置 -->
    <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <CircleDot class="h-4 w-4 text-muted-foreground" />
        <span>{{ t('common.theme.animations') }}</span>
      </div>
      <Switch
        :model-value="themeStore.layoutConfig.animations"
        @update:model-value="updateAnimations"
      />
    </div>

    <!-- GitHub 设置 -->
    <div class="space-y-4">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <Github class="h-4 w-4 text-muted-foreground" />
        <span>GitHub</span>
      </div>

      <!-- 显示 GitHub 图标 -->
      <div class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <span class="text-sm text-foreground">{{ t('common.theme.showGithub') }}</span>
        <Switch
          :model-value="themeStore.layoutConfig.showGithub"
          @update:model-value="updateShowGithub"
        />
      </div>

      <!-- GitHub URL -->
      <div v-if="themeStore.layoutConfig.showGithub" class="space-y-2">
        <Label class="text-sm text-muted-foreground">{{ t('common.theme.githubUrl') }}</Label>
        <Input
          :model-value="themeStore.layoutConfig.githubUrl"
          placeholder="https://github.com/username/repo"
          @update:model-value="updateGithubUrl"
        />
      </div>
    </div>

    <!-- 重置按钮 -->
    <Button
      variant="outline"
      class="w-full transition-all duration-200 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
      @click="themeStore.resetLayoutConfig"
    >
      <span class="mr-2">↺</span> {{ t('common.theme.reset') }}
    </Button>

    <!-- 导出配置按钮 -->
    <Button
      variant="outline"
      class="w-full transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
      @click="copyConfig"
    >
      <Check v-if="copied" class="h-4 w-4 mr-2" />
      <Download v-else class="h-4 w-4 mr-2" />
      {{ copied ? t('common.theme.exportConfigSuccess') : t('common.theme.exportConfig') }}
    </Button>
  </div>
</template>
