<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useMenuStore } from '@/stores/global/menu';
import { loadIcon, getCachedIcon } from '@/composables/useIcon';
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';

const router = useRouter();
const { t } = useI18n();
const menuStore = useMenuStore();

const open = defineModel<boolean>('open', { default: false });

/**
 * 图标缓存
 */
const iconCache = ref<Record<string, Component>>({});

/**
 * 过滤后的菜单
 */
const filteredMenus = computed(() => {
  return menuStore.flatMenus.filter(menu => !menu.hidden);
});

/**
 * 按分组组织的菜单
 */
const groupedMenus = computed(() => {
  const groups: Record<string, typeof filteredMenus.value> = {};

  filteredMenus.value.forEach(menu => {
    const groupKey = menu.group || 'other';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(menu);
  });

  return groups;
});

/**
 * 获取图标组件（带缓存）
 * @param iconName - 图标名称
 * @returns 图标组件或 undefined
 */
const getCachedIcon = (iconName?: string): Component | undefined => {
  if (!iconName) return undefined;
  return iconCache.value[iconName];
};

/**
 * 预加载所有菜单图标
 */
const preloadIcons = async () => {
  const iconNames = new Set<string>();

  filteredMenus.value.forEach(menu => {
    if (menu.icon) {
      iconNames.add(menu.icon);
    }
  });

  await Promise.all(
    Array.from(iconNames).map(async (name) => {
      if (!iconCache.value[name]) {
        const cached = getCachedIcon(name);
        if (cached) {
          iconCache.value[name] = cached;
        } else {
          const icon = await loadIcon(name);
          if (icon) {
            iconCache.value[name] = icon;
          }
        }
      }
    })
  );
};

/**
 * 监听对话框打开，预加载图标
 */
watch(open, (isOpen) => {
  if (isOpen) {
    preloadIcons();
  }
});

/**
 * 处理选择
 * @param path - 路由路径
 */
const handleSelect = (path: string) => {
  router.push(path);
  open.value = false;
};
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput :placeholder="t('common.header.searchPlaceholder') || '搜索菜单...'" />

    <CommandList>
      <CommandEmpty>
        <div class="flex flex-col items-center justify-center py-8 text-center">
          <FileText class="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p class="text-sm text-muted-foreground">未找到相关菜单</p>
        </div>
      </CommandEmpty>

      <template v-for="(menus, groupKey) in groupedMenus" :key="groupKey">
        <CommandGroup v-if="menus.length > 0" :heading="groupKey === 'other' ? undefined : t(`menu.group${groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}`)">
          <CommandItem
            v-for="menu in menus"
            :key="menu.key"
            :value="menu.path"
            @select="handleSelect(menu.path)"
          >
            <component
              :is="getCachedIcon(menu.icon)"
              v-if="getCachedIcon(menu.icon)"
              class="h-4 w-4 mr-2 text-muted-foreground"
            />
            <span>{{ t(menu.i18nKey) }}</span>
            <span class="ml-auto text-xs text-muted-foreground truncate max-w-[120px]">
              {{ menu.path }}
            </span>
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>
  </CommandDialog>
</template>
