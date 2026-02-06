<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useThemeStore, presetThemes, type LayoutConfig } from '@/stores/theme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor, Palette, Layout, Type, CircleDot, PanelLeft } from 'lucide-vue-next';

const { t } = useI18n();
const themeStore = useThemeStore();

/**
 * 主题列表
 */
const themes = [
  { key: 'default', nameKey: 'common.theme.colors.default', color: 'bg-neutral-500' },
  { key: 'blue', nameKey: 'common.theme.colors.blue', color: 'bg-blue-500' },
  { key: 'green', nameKey: 'common.theme.colors.green', color: 'bg-emerald-500' },
  { key: 'purple', nameKey: 'common.theme.colors.purple', color: 'bg-purple-500' },
  { key: 'orange', nameKey: 'common.theme.colors.orange', color: 'bg-orange-500' },
  { key: 'red', nameKey: 'common.theme.colors.red', color: 'bg-red-500' },
  { key: 'pink', nameKey: 'common.theme.colors.pink', color: 'bg-pink-500' },
  { key: 'teal', nameKey: 'common.theme.colors.teal', color: 'bg-teal-500' },
  { key: 'indigo', nameKey: 'common.theme.colors.indigo', color: 'bg-indigo-500' },
  { key: 'yellow', nameKey: 'common.theme.colors.yellow', color: 'bg-yellow-500' },
  { key: 'cyan', nameKey: 'common.theme.colors.cyan', color: 'bg-cyan-500' },
  { key: 'amber', nameKey: 'common.theme.colors.amber', color: 'bg-amber-500' },
];

/**
 * 字体大小选项
 */
const fontSizes = [
  { value: 'sm', labelKey: 'common.theme.small', size: '14px' },
  { value: 'base', labelKey: 'common.theme.medium', size: '16px' },
  { value: 'lg', labelKey: 'common.theme.large', size: '18px' },
];

/**
 * 更新圆角
 */
const updateRadius = (value: number[]) => {
  themeStore.updateLayoutConfig({ radius: value[0] });
};

/**
 * 更新侧边栏宽度
 */
const updateSidebarWidth = (value: number[]) => {
  themeStore.updateLayoutConfig({ sidebarWidth: value[0] });
};

/**
 * 更新字体大小
 */
const updateFontSize = (value: string) => {
  themeStore.updateLayoutConfig({ fontSize: value as LayoutConfig['fontSize'] });
};

/**
 * 更新动画开关
 */
const updateAnimations = (value: boolean) => {
  themeStore.updateLayoutConfig({ animations: value });
};

/**
 * 更新侧边栏折叠状态
 */
const updateSidebarCollapsed = (value: boolean) => {
  themeStore.updateLayoutConfig({ sidebarCollapsed: value });
};
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
          v-for="theme in themes"
          :key="theme.key"
          class="group flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-200 hover:shadow-sm"
          :class="themeStore.currentTheme === theme.key ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-border hover:border-primary/50'"
          @click="themeStore.setTheme(theme.key)"
        >
          <div 
            class="w-6 h-6 rounded-full transition-transform duration-200 group-hover:scale-110" 
            :class="theme.color" 
          />
          <span class="text-xs" :class="themeStore.currentTheme === theme.key ? 'text-primary font-medium' : 'text-muted-foreground'">{{ t(theme.nameKey) }}</span>
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
    </div>

    <!-- 字体设置 -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <Type class="h-4 w-4 text-muted-foreground" />
        <span>{{ t('common.theme.fontSize') }}</span>
      </div>
      <RadioGroup
        :model-value="themeStore.layoutConfig.fontSize"
        class="flex gap-2"
        @update:model-value="updateFontSize"
      >
        <div v-for="size in fontSizes" :key="size.value" class="flex-1">
          <RadioGroupItem
            :id="`font-${size.value}`"
            :value="size.value"
            class="peer sr-only"
          />
          <Label
            :for="`font-${size.value}`"
            class="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all duration-200"
          >
            <span class="font-semibold" :style="{ fontSize: size.size }">A</span>
            <span class="text-xs mt-1 text-muted-foreground">{{ t(size.labelKey) }}</span>
          </Label>
        </div>
      </RadioGroup>
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

    <!-- 重置按钮 -->
    <Button 
      variant="outline" 
      class="w-full transition-all duration-200 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" 
      @click="themeStore.resetLayoutConfig"
    >
      <span class="mr-2">↺</span> {{ t('common.theme.reset') }}
    </Button>
  </div>
</template>
