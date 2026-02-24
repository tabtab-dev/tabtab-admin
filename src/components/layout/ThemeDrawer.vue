<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import ThemeSettings from './ThemeSettings.vue';
import { Palette } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/**
 * 是否打开抽屉
 */
const isOpen = defineModel<boolean>('open', { default: false });
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors hidden sm:flex"
        :title="t('common.header.themeSettings')"
      >
        <Palette class="h-4 w-4" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" class="w-[360px] sm:w-[400px] p-0">
      <SheetHeader class="px-6 py-4 border-b border-border/50">
        <SheetTitle class="flex items-center gap-2">
          <Palette class="h-5 w-5 text-primary" />
          {{ t('common.header.themeSettings') }}
        </SheetTitle>
        <SheetDescription class="sr-only">
          {{ t('common.header.themeSettingsDesc') }}
        </SheetDescription>
      </SheetHeader>
      <ScrollArea class="h-[calc(100vh-80px)]">
        <div class="p-6">
          <ThemeSettings />
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
