<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/global/theme';
import { Moon, Sun } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const themeStore = useThemeStore();
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="themeStore.toggleMode"
    class="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
    :title="themeStore.currentMode === 'dark' ? t('common.header.switchToLight') : t('common.header.switchToDark')"
  >
    <Sun v-if="themeStore.currentMode === 'dark'" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </Button>
</template>
