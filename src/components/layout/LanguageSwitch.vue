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
import { Globe, Check, Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

/**
 * 语言切换组件
 * 支持下拉选择和直接切换两种模式
 * 支持加载状态显示
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
 * 是否正在加载
 */
const isLoading = computed(() => localeStore.isLoading);

/**
 * 切换语言（toggle 模式）
 */
const handleToggle = async () => {
  if (props.mode === 'toggle' && !isLoading.value) {
    const newLocale = await localeStore.toggleLocale();
    if (newLocale) {
      toast.success(`已切换至 ${localeStore.currentLocaleName}`);
    } else {
      toast.error('切换语言失败');
    }
  }
};

/**
 * 选择语言（dropdown 模式）
 */
const handleSelect = async (locale: string) => {
  const success = await localeStore.changeLocale(locale as 'zh-CN' | 'en-US');
  if (success) {
    toast.success(`已切换至 ${localeStore.currentLocaleName}`);
  } else {
    toast.error(localeStore.error || '切换语言失败');
  }
};
</script>

<template>
  <!-- 下拉菜单模式 -->
  <DropdownMenu v-if="mode === 'dropdown'">
    <DropdownMenuTrigger as-child>
      <Button
        :variant="variant"
        :size="size"
        class="gap-2"
        :disabled="isLoading"
      >
        <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
        <Globe v-else class="h-4 w-4" />
        <span v-if="size !== 'icon'" class="hidden sm:inline">{{ currentLocaleLabel }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
      <DropdownMenuItem
        v-for="locale in localeStore.availableLocales"
        :key="locale.value"
        @click="handleSelect(locale.value)"
        class="cursor-pointer justify-between"
        :disabled="isLoading"
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
    :disabled="isLoading"
    @click="handleToggle"
  >
    <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
    <Globe v-else class="h-4 w-4" />
    <span v-if="size !== 'icon'" class="hidden sm:inline">{{ currentLocaleLabel }}</span>
  </Button>
</template>
