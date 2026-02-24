<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/global/app';
import { useThemeStore } from '@/stores/global/theme';
import { useMenuStore } from '@/stores/global/menu';
import ThemeSettings from './ThemeSettings.vue';
import LanguageSwitch from './LanguageSwitch.vue';
import MenuSearchDialog from './MenuSearchDialog.vue';
import NotificationPanel from './NotificationPanel.vue';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  Moon,
  Sun,
  Palette,
  Command,
  X,
  Home,
} from 'lucide-vue-next';
import { PageBreadcrumbDropdown } from './PageBreadcrumbDropdown';
import { UserMenu } from './UserMenu';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const themeStore = useThemeStore();
const menuStore = useMenuStore();

const searchQuery = ref('');
const isSearchFocused = ref(false);
const isSearchExpanded = ref(false);
const isThemeDrawerOpen = ref(false);
const isMenuSearchOpen = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);

/**
 * 当前路由标题
 */
const currentRouteTitle = computed(() => {
  return menuStore.getRouteTitle(route.path);
});

/**
 * 跳转到首页
 */
const goToHome = () => {
  router.push('/');
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  isMenuSearchOpen.value = true;
};

/**
 * 展开搜索框（移动端/平板）
 */
const expandSearch = async () => {
  isSearchExpanded.value = true;
  // 等待 DOM 更新后聚焦
  await nextTick();
  searchInputRef.value?.focus();
};

/**
 * 关闭搜索框
 */
const collapseSearch = () => {
  isSearchExpanded.value = false;
  searchQuery.value = '';
};

/**
 * 处理键盘快捷键
 */
const handleKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K 打开菜单搜索
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    isMenuSearchOpen.value = true;
  }
  
  // ESC 关闭搜索
  if (e.key === 'Escape' && isSearchExpanded.value) {
    collapseSearch();
  }
};

/**
 * 点击外部关闭搜索
 */
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (isSearchExpanded.value && !target.closest('.search-container')) {
    collapseSearch();
  }
};

/**
 * 组件属性
 */
defineProps<{
  /** 侧栏是否折叠 */
  sidebarCollapsed?: boolean;
}>();

// Header 组件不再发出 toggle-collapse 事件，折叠按钮已移至 Sidebar 底部

// 添加事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="h-12 sm:h-14 border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50">
    <div class="flex items-center justify-between h-full px-2">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- 移动端菜单按钮 -->
        <Button
          variant="ghost"
          size="icon"
          @click="appStore.toggleMobileSidebar"
          class="lg:hidden hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg flex-shrink-0"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        <!-- 面包屑导航 - 下拉卡片模式 -->
        <template v-if="themeStore.layoutConfig.showBreadcrumb">
          <div class="hidden md:flex items-center min-w-0">
            <PageBreadcrumbDropdown />
          </div>
        </template>

        <!-- 面包屑隐藏时，显示页面标题 -->
        <div v-if="!themeStore.layoutConfig.showBreadcrumb" class="hidden md:flex items-center gap-2 min-w-0">
          <div 
            class="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-primary/20 transition-colors"
            @click="goToHome"
          >
            <Home class="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 class="text-sm font-semibold text-foreground truncate">
            {{ $t(currentRouteTitle) }}
          </h1>
        </div>

        <!-- 移动端页面标题 -->
        <h1 class="md:hidden text-xs sm:text-sm font-semibold text-foreground truncate">
          {{ $t(currentRouteTitle) }}
        </h1>
      </div>

      <div class="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        <!-- 搜索框 - 桌面端 -->
        <div
          class="search-container hidden md:flex items-center gap-2 transition-all duration-300 ease-out rounded-xl px-3 py-1.5 border"
          :class="[
            isSearchFocused
              ? 'bg-background border-primary/30 w-72 ring-2 ring-primary/10'
              : 'bg-muted/60 border-transparent w-56 hover:bg-muted hover:border-border/50'
          ]"
        >
          <Search class="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="t('common.header.search')"
            class="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            @keyup.enter="handleSearch"
          />
          <kbd class="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex-shrink-0">
            <Command class="h-3 w-3" />
            <span>K</span>
          </kbd>
        </div>

        <!-- 搜索按钮 - 移动端/平板 -->
        <Button
          variant="ghost"
          size="icon"
          class="md:hidden h-8 w-8 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
          @click="expandSearch"
        >
          <Search class="h-4 w-4" />
        </Button>

        <!-- 移动端展开的搜索框 -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isSearchExpanded"
            class="search-container fixed inset-x-4 top-14 z-50 md:hidden flex items-center gap-2 bg-background border rounded-lg px-3 py-2"
          >
            <Search class="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.header.search')"
              class="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
              @keyup.enter="handleSearch"
            />
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 rounded flex-shrink-0"
              @click="collapseSearch"
            >
              <X class="h-3 w-3" />
            </Button>
          </div>
        </Transition>

        <!-- 遮罩层 -->
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isSearchExpanded"
            class="fixed inset-0 bg-black/40 z-40 md:hidden"
            @click="collapseSearch"
          />
        </Transition>

        <!-- 语言切换 -->
        <LanguageSwitch mode="dropdown" size="icon" variant="ghost" />

        <!-- 主题切换 -->
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

        <!-- 主题设置抽屉 -->
        <Sheet v-model:open="isThemeDrawerOpen">
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

        <!-- 通知面板 -->
        <NotificationPanel />

        <!-- 用户菜单 - Bento 风格设计 -->
        <UserMenu />
      </div>
    </div>

    <!-- 菜单搜索对话框 -->
    <MenuSearchDialog v-model:open="isMenuSearchOpen" />
  </header>
</template>
