<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleStore } from '@/stores/global/locale';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-vue-next';

/**
 * 语言切换组件
 * 支持下拉选择和直接切换两种模式
 */

const props = withDefaults(defineProps<{
  /** 显示模式：dropdown-下拉菜单, toggle-切换按钮 */
  mode?: 'dropdown' | 'toggle';
  /** 按钮尺寸 */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** 按钮变体 */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}>(), {
  mode: 'dropdown',
  size: 'icon',
  variant: 'ghost',
});

const localeStore = useLocaleStore();

/**
 * 当前语言显示文本
 */
const currentLocaleLabel = computed(() => {
  return localeStore.currentLocaleName;
});

/**
 * 切换语言
 */
const handleToggle = () => {
  if (props.mode === 'toggle') {
    localeStore.toggleLocale();
  }
};

/**
 * 选择语言
 */
const handleSelect = (locale: string) => {
  localeStore.changeLocale(locale as 'zh-CN' | 'en-US');
};
</script>

<template>
  <!-- 下拉菜单模式 -->
  <DropdownMenu v-if="mode === 'dropdown'">
    <DropdownMenuTrigger as-child>
      <Button :variant="variant" :size="size" class="gap-2">
        <Globe class="h-4 w-4" />
        <span v-if="size !== 'icon'" class="hidden sm:inline">{{ currentLocaleLabel }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
      <DropdownMenuItem
        v-for="locale in localeStore.availableLocales"
        :key="locale.value"
        @click="handleSelect(locale.value)"
        class="cursor-pointer justify-between"
      >
        <span>{{ locale.label }}</span>
        <Check
          v-if="localeStore.currentLocale === locale.value"
          class="h-4 w-4"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- 切换按钮模式 -->
  <Button
    v-else
    :variant="variant"
    :size="size"
    class="gap-2"
    @click="handleToggle"
  >
    <Globe class="h-4 w-4" />
    <span v-if="size !== 'icon'" class="hidden sm:inline">{{ currentLocaleLabel }}</span>
  </Button>
</template>
