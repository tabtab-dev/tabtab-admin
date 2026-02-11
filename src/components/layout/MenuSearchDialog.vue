<script setup lang="ts">
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useMenuStore } from '@/stores/global/menu';
import { getIcon } from '@/composables/useIcon';
import { FileText } from 'lucide-vue-next';

const router = useRouter();
const { t } = useI18n();
const menuStore = useMenuStore();

const open = defineModel<boolean>('open', { default: false });

const filteredMenus = computed(() => 
  menuStore.flatMenus.filter(menu => !menu.hidden)
);

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

      <CommandGroup>
        <CommandItem
          v-for="menu in filteredMenus"
          :key="menu.key"
          :value="menu.path"
          @select="handleSelect(menu.path)"
        >
          <component
            :is="getIcon(menu.icon)"
            v-if="menu.icon"
            class="h-4 w-4 mr-2 text-muted-foreground"
          />
          <span>{{ t(menu.i18nKey) }}</span>
          <span class="ml-auto text-xs text-muted-foreground truncate max-w-[120px]">
            {{ menu.path }}
          </span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
