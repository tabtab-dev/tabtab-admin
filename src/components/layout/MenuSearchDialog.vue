<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useMenuStore } from '@/stores/global/menu';
import { getIcon } from '@/components/layout/sidebar/config';
import { ArrowRight, FileText } from 'lucide-vue-next';

const router = useRouter();
const { t } = useI18n();
const menuStore = useMenuStore();

const open = defineModel<boolean>('open', { default: false });

const filteredMenus = computed(() => {
  return menuStore.flatMenus.filter(menu => !menu.hidden);
});

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
              :is="getIcon(menu.icon)"
              v-if="getIcon(menu.icon)"
              class="h-4 w-4 mr-2 text-muted-foreground"
            />
            <span>{{ t(menu.i18nKey) }}</span>
            <span class="ml-auto text-xs text-muted-foreground truncate max-w-[120px]">
              {{ menu.path }}
            </span>
            <ArrowRight class="h-3.5 w-3.5 ml-2 text-muted-foreground/50" />
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>
  </CommandDialog>
</template>
